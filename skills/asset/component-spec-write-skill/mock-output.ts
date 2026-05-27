/**
 * MOCK: 공용 5종 + 프로젝트 특화 컴포넌트 풀 스펙.
 * 각 컴포넌트마다 Variants/States/Props/Anatomy/Token mapping.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildComponentSpec(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);
  const primaryToken = profile.colorTokens[0]?.name ?? "primary/blue-500";

  return `# Component Spec — ${profile.label}

> 공용 컴포넌트 5종 + 프로젝트 특화 컴포넌트 ${profile.domainComponents.length}종.

## 공용 컴포넌트

### Button
- **Variants**: primary / secondary / ghost / outline
- **States**: default / hover / focus-visible / disabled / loading
- **Props**:
  | Prop | Type | Default | Description |
  | --- | --- | --- | --- |
  | variant | enum | primary | 위 4종 |
  | size | sm \\| md \\| lg | md | h-8 / h-9 / h-10 |
  | disabled | boolean | false | |
  | loading | boolean | false | spinner |
- **Anatomy**: container · leading icon · label · trailing icon
- **Token mapping**: \`radius/md\` · \`motion/snap\` · primary는 \`${primaryToken}\`

### Card
- **Variants**: default / interactive
- **States**: default / hover (interactive only)
- **Props**: glass · onClick
- **Token mapping**: \`radius/lg\` · \`shadow/md\`

### Input
- **Variants**: text / textarea / search / select
- **States**: default / focus / error / disabled
- **Token mapping**: \`radius/md\` · focus ring \`${primaryToken}/30\`

### Modal
- **Variants**: center-modal / right-slide-panel
- **States**: closed / opening / open / closing
- **Token mapping**: \`radius/xl\` · \`shadow/lg\` · \`motion/smooth\`

### Toast
- **Variants**: success / warning / error / info
- **States**: enter / visible / leave
- **Token mapping**: variant별 \`status/*\` 색

## 프로젝트 특화 컴포넌트

${profile.domainComponents
  .map(
    (c) => `### ${c.name}
- **Purpose**: ${c.purpose}
- **Variants**: ${c.variants.join(" / ")}
- **States**: ${c.states.join(" / ")}
- **Props**: 자세한 정의는 다음 단계에서 화면별로 구체화
- **Anatomy**: 컴포넌트 내부 영역은 \`sample-screen-design\` 스킬에서 확정
- **Token mapping**: \`radius/lg\` · 도메인 컬러 (\`${primaryToken}\`)`,
  )
  .join("\n\n")}

---
다음 단계: \`sample-screen-design\` 스킬이 위 컴포넌트로 도메인 화면 3개를 와이어프레임으로 설계한다.
`;
}
