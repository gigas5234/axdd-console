import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 2000,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 IA 설계자입니다.
User Flow의 화면들을 받아 Information Architecture를 ASCII 트리로 구성하세요.

# 출력 구조
\`\`\`
/
├── /<도메인-특화-경로> — 설명
└── /<도메인-특화-경로>/<sub> — 설명
\`\`\`

도메인 특화 경로 사용 (헬스케어: /appointments, /medications · 핀테크: /transfer, /portfolio).
generic (/dashboard, /settings)만 있으면 안 됨.
`,
  buildUser: (input) => {
    const flow = input.inputs?.["user_flow.md"] ?? input.prompt;
    return `## User Flow\n${flow}`;
  },
};
