/**
 * MOCK: 도메인 프로필의 iaTree 활용.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildIa(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);

  return `# Information Architecture — ${profile.label}

> 도메인 특화 라우트 트리 + 각 노드 한 줄 설명.

## 라우트 트리

\`\`\`
${profile.iaTree}
\`\`\`

## 화면 매핑
- 모든 User Flow의 state가 위 트리에 매핑됨
- 도메인 특화 경로 사용 (generic /dashboard 아님)
- orphan 노드 없음

---
UX 트랙 종료. 다음 단계: \`handoff-merge\` 스킬이 UI 트랙 + UX 트랙을 마스터 핸드오프로 합친다.
`;
}
