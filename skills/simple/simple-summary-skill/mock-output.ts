/**
 * MOCK: 사용자 프롬프트 + intent 기반 동적 5섹션 요약.
 * intent가 있으면 도메인/톤/누락 정보를 반영해 더 정확한 요약을 만든다.
 */

import type { SkillRunInput } from "../../_runtime/types";

function extractFirstSentence(text: string, maxLen = 100): string {
  const s = text.split(/[.。!?\n]/)[0]?.trim() ?? text;
  return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
}

export function buildSimpleSummary(input: SkillRunInput): string {
  const userPrompt = input.prompt?.trim() || "(프롬프트 없음)";
  const intent = input.context?.intent;
  const headline = extractFirstSentence(userPrompt);

  const domain = intent?.domain ?? "unknown";
  const tone = intent?.tone ?? "unknown";
  const scopeKeys = intent
    ? (Object.keys(intent.scope) as Array<keyof typeof intent.scope>).filter(
        (k) => intent.scope[k],
      )
    : [];
  const unknowns = intent?.unknowns ?? [];

  const scopeLabel: Record<string, string> = {
    needsRequirementSummary: "요구사항 요약",
    needsIA: "Information Architecture",
    needsUserFlow: "User Flow",
    needsDesignSystem: "UI Foundation · 디자인 토큰",
    needsComponentSpec: "컴포넌트 스펙",
    needsHandoff: "Figma 핸드오프",
    needsKickoffReport: "착수보고서",
    needsCICD: "CI/CD",
  };

  const unknownLabel: Record<string, string> = {
    domain: "도메인",
    tone: "톤·무드",
    timeline: "일정",
    "team-size": "팀 규모",
    "existing-design-system": "기존 디자인 시스템 유무",
    "target-persona": "타겟 페르소나",
    "scope-specifics": "작업 범위 상세",
    platform: "플랫폼",
  };

  return [
    "# Requirement Summary",
    "",
    `> 원본 요청: "${headline}"`,
    "",
    "## Context",
    `- 도메인: **${domain === "unknown" ? "⚠️ 미지정 — 일반 SaaS로 가정" : domain}**`,
    `- 톤: ${tone === "unknown" ? "⚠️ 미지정" : tone}`,
    `- 요청 형태: 자연어 입력 → 단계별 산출물 자동 생성`,
    "",
    "## Goal",
    ...(scopeKeys.length === 0
      ? ["- ⚠️ 구체적 작업 범위가 명시되지 않음 — 핸드오프 문서 풀세트로 가정"]
      : scopeKeys.map((k) => `- ${scopeLabel[k] ?? k}`)),
    "",
    "## Key Points",
    `- 사용자 요청의 **도메인(${domain === "unknown" ? "미지정" : domain})** 을 모든 산출물에서 일관되게 유지`,
    "- 도메인 핵심 사용자·시나리오·컴포넌트를 우선 정의",
    "- 디자인 시스템 토큰은 도메인 톤에 맞춰 선택",
    "- 산출물 누락 없이 검증 가능한 형태로 마감",
    "",
    "## Risks",
    `- 도메인 정보 부족: ${
      unknowns.length === 0
        ? "양호"
        : `**${unknowns.map((u) => unknownLabel[u] ?? u).join(", ")}** 미명시 → TBD로 채워짐`
    }`,
    "- 사용자 요청을 다른 도메인 예시로 덮어쓰기 위험 (anchor 금지 규칙 필요)",
    "- 휴먼 리뷰 일정 미확정 시 릴리즈 지연",
    "",
    "## Next Steps",
    "1. 디자인 시스템 / 레퍼런스 수집 (없다면 도메인 표준 적용)",
    "2. UX 프로세스 플랜으로 단계화",
    `3. **${domain === "unknown" ? "컨텍스트 미확정 — generic 톤" : domain + " 프로젝트 특화"}** UI Foundation 정의`,
    "4. 컴포넌트 스펙 + 샘플 화면 + Figma 프롬프트 순서로 진행",
    "5. validation skill로 도메인 fit 자동 검증",
  ].join("\n");
}
