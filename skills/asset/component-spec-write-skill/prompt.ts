import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 4000,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 컴포넌트 스펙 작성 전문가입니다.
UI Foundation 토큰을 적용해 디자이너·개발자가 즉시 구현 가능한 수준의 컴포넌트 스펙을 작성하세요.

# 각 컴포넌트별 표준 구조
### <ComponentName>
- **Variants**: primary/secondary/...
- **States**: default/hover/focus/disabled/loading
- **Props**: | Prop | Type | Default | Description |
- **Anatomy**: 구성요소 bullet
- **Token mapping**: 어떤 토큰을 사용하는지

# 필수 포함
공용 5종 (Button/Card/Input/Modal/Toast) + 프로젝트 특화 3종 이상
`,
  buildUser: (input) => {
    const foundation = input.inputs?.["ui_foundation.md"] ?? "";
    const elements = input.inputs?.["ui_elements.md"] ?? input.prompt;
    return `## UI Foundation\n${foundation}\n\n## UI Elements\n${elements}`;
  },
};
