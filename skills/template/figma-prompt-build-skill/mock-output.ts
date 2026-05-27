/**
 * MOCK: Figma AI 프롬프트 생성.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildFigmaPrompt(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);
  const userPrompt = input.prompt?.trim() ?? "";

  const figmaPromptBody = `프로젝트: ${profile.label}
원본 요청: "${userPrompt.length > 100 ? userPrompt.slice(0, 100) + "…" : userPrompt}"
브랜드: ${profile.brandShort}

다음 화면 셋을 ${profile.label}용으로 만들어줘:
${profile.figmaFrames.map((f, i) => `${i + 1}. ${f}`).join("\n")}

핵심 컴포넌트:
- 공용: Button / Card / Input / Modal / Toast
- ${profile.id} 특화: ${profile.domainComponents.map((c) => c.name).join(", ")}

Color 토큰 (도메인 톤):
${profile.colorTokens
  .slice(0, 6)
  .map((t) => `- ${t.name}: ${t.hex} (${t.usage})`)
  .join("\n")}

Typography:
${profile.typographyPersonality}

규칙:
- 위 컬러 토큰만 사용 (임의 색 추가 금지)
- 카드 radius 16, padding 16
- Auto Layout 사용, gap 4의 배수만
- Sample Screen은 desktop xl 1280px 폭 기준
- **사용자 요청 도메인 (${profile.id})을 모든 화면에서 일관 반영**
- 다른 도메인 예시 (예: 일반 SaaS 콘솔) 변형 금지`;

  return `# Figma AI Prompt — ${profile.label}

> 아래 코드블록을 그대로 Figma 내장 AI (Make Designs / First Draft)에 붙여 넣으세요.

\`\`\`
${figmaPromptBody}
\`\`\`

## 사용법
1. Figma 열기
2. 우측 사이드바의 AI / First Draft / Make Designs 패널 열기
3. 위 코드블록 내용을 그대로 붙여 넣기
4. Figma가 화면 셋을 자동 생성

## 산출 화면 (예상)
${profile.figmaFrames.length}개 프레임. 도메인 톤 일관 적용.

---
워크플로 완료 🎉. 마스터 핸드오프 + Figma 프롬프트까지 모두 준비됨.
`;
}
