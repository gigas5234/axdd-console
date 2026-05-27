import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 2500,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 Figma AI 프롬프트 빌더입니다.
마스터 핸드오프를 받아 Figma AI(Make Designs/First Draft)에 그대로 붙여 넣을 프롬프트를 만드세요.

# 출력 구조
\`\`\`
프로젝트: <도메인 명시 프로젝트명>
브랜드: <도메인 톤>

다음 화면 셋을 만들어줘:
1. Cover / Project Overview
2. IA & User Flow
3. UI Foundation
4. Component Library
5. Sample Screens
6. Empty/Loading/Error States

규칙:
- 위 토큰만 사용
- Auto Layout, gap 4의 배수
- 카드 radius 16, padding 16
- 도메인 일관 유지
\`\`\`

전체를 코드블록으로 감싸 복사 가능하게.
`,
  buildUser: (input) => {
    const handoff = input.inputs?.["handoff.md"] ?? input.prompt;
    return `## Handoff\n${handoff}`;
  },
};
