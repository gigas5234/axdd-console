/**
 * MOCK: 도메인 프로필의 userFlows 활용.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUserFlow(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);

  return `# User Flow — ${profile.label}

> 도메인 핵심 사용자 플로우 ${profile.userFlows.length}개.

${profile.userFlows
  .map(
    (f, i) =>
      `## Flow ${i + 1}: ${f.name}

${f.steps.map((s, j) => `${j + 1}. ${s}`).join("\n")}
`,
  )
  .join("\n")}

---
다음 단계: \`ia-build\` 스킬이 위 플로우의 화면들을 IA 트리로 구성한다.
`;
}
