import type { FigmaAdapter, DesignFoundation, FigmaExportResult } from "./types";

/**
 * AI-prompt adapter (the fallback when MCP is blocked).
 *
 * Generates a portable design-foundation prompt that a designer can paste
 * directly into Figma's built-in AI / Figma Make / Make Designs panel.
 * Output is structured for maximum determinism: it tells the AI which
 * artboards/frames to create and which tokens to honor.
 *
 * This adapter is always available — no network, no MCP, no auth.
 */

function buildPrompt(input: DesignFoundation): string {
  const {
    projectName,
    brandIdentity,
    uxFoundationMarkdown,
    uiFoundationMarkdown,
    iaMarkdown,
    componentSpecMarkdown,
    notes,
  } = input;

  return [
    `# Figma AI 디자인 파운데이션 프롬프트`,
    `프로젝트: **${projectName}**`,
    brandIdentity ? `브랜드 아이덴티티: ${brandIdentity}` : null,
    ``,
    `## 작업 지시`,
    `아래 마크다운 명세를 그대로 시각화하는 Figma 화면 셋을 생성해줘.`,
    `- 디자인 시스템과 충돌 없이 컴포넌트 단위로 만들어줘.`,
    `- 다음 아트보드(프레임)를 만들어줘:`,
    `  1. Cover / Project Overview`,
    `  2. IA & User Flow`,
    `  3. UX Foundation`,
    `  4. UI Foundation (Tokens, Type, Color, Spacing)`,
    `  5. Component Library`,
    `  6. Sample Screens (3개 이상)`,
    ``,
    `## UX Foundation`,
    "```md",
    uxFoundationMarkdown.trim(),
    "```",
    ``,
    `## UI Foundation`,
    "```md",
    uiFoundationMarkdown.trim(),
    "```",
    iaMarkdown
      ? [`## Information Architecture`, "```md", iaMarkdown.trim(), "```"].join(
          "\n",
        )
      : null,
    componentSpecMarkdown
      ? [`## Component Spec`, "```md", componentSpecMarkdown.trim(), "```"].join(
          "\n",
        )
      : null,
    notes ? [`## 추가 메모`, notes].join("\n") : null,
    ``,
    `## 산출 규칙`,
    `- 텍스트는 한국어/영문 혼용을 허용.`,
    `- 컬러는 위 토큰만 사용 (예: primary/blue, neutral/ink-900).`,
    `- 스페이싱은 4의 배수.`,
    `- 카드는 12 radius, 16 padding 기준으로 정렬.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const figmaPromptAdapter: FigmaAdapter = {
  mode: "prompt",
  label: "Figma AI용 프롬프트 복사",
  description:
    "디자이너가 Figma 내장 AI(Make Designs / Figma AI)에 그대로 붙여 넣을 프롬프트를 만들어 복사합니다.",
  isAvailable() {
    return true;
  },
  async export(input: DesignFoundation): Promise<FigmaExportResult> {
    const payload = buildPrompt(input);

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(payload);
        return {
          mode: "prompt",
          ok: true,
          message:
            "디자인 파운데이션 프롬프트를 클립보드에 복사했어요. Figma AI에 그대로 붙여 넣으세요.",
          promptPayload: payload,
        };
      } catch {
        // Fallback below
      }
    }

    return {
      mode: "prompt",
      ok: true,
      message:
        "프롬프트가 준비됐어요. 우측 미리보기에서 직접 복사해 Figma AI에 붙여 넣으세요.",
      promptPayload: payload,
    };
  },
};
