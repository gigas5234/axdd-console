/**
 * MOCK: 도메인 프로필의 sampleScreens 그대로 활용.
 * 도메인 프로필이 이미 ASCII 와이어프레임을 가지고 있으므로 그대로 출력 + 토큰 매핑.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildSampleScreens(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);
  const primaryToken = profile.colorTokens[0]?.name ?? "primary/blue-500";

  return `# Sample Screens — ${profile.label}

> 도메인 핵심 화면 ${profile.sampleScreens.length}개 와이어프레임.

${profile.sampleScreens
  .map(
    (s, i) =>
      `## Screen ${String.fromCharCode(65 + i)}: ${s.name}

${s.description}

\`\`\`
${s.wireframe}
\`\`\`

**영역별 컴포넌트·토큰 매핑**:
- 헤더 → \`Card\` (\`radius/lg\`, \`shadow/md\`)
- 본문 영역 → 도메인 특화 컴포넌트 (${profile.domainComponents[i % profile.domainComponents.length]?.name})
- 액션 영역 → \`Button\` (primary는 \`${primaryToken}\`)
- 페이지 padding: \`spacing/3xl\` (32)
`,
  )
  .join("\n\n")}

---
다음 단계: UI 트랙 종료. \`ux-process-define\` 스킬이 UX 트랙을 시작한다.
`;
}
