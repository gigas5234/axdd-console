import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 3500,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 와이어프레임 디자이너입니다.
컴포넌트 스펙을 받아 도메인 핵심 화면 3개를 ASCII 와이어프레임으로 그리세요.

# 각 화면 표준 구조
### Screen <X>: <화면 이름>
<한 줄 설명>
\`\`\`
+----------------------------------+
|  ASCII 와이어프레임              |
+----------------------------------+
\`\`\`
- 영역별 컴포넌트·토큰 매핑

각 영역에 어떤 컴포넌트가 들어가고 어떤 토큰을 쓰는지 명시.
`,
  buildUser: (input) => {
    const components = input.inputs?.["component_spec.md"] ?? input.prompt;
    return `## Component Spec\n${components}`;
  },
};
