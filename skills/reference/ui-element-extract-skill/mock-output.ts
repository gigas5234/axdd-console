/**
 * MOCK: AXDD DS 또는 고객사 DS 레퍼런스 기반 UI 요소 추출.
 * Phase 6 재정의: 4-Case 매트릭스 인지.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUiElementExtract(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);
  const dsSource =
    profile.id === "customer-project"
      ? "고객사 DS (1차) + AXDD DS 폴백"
      : profile.id === "ds-bootstrap"
        ? "(없음 — DS Bootstrap이 먼저 실행되어야 함)"
        : "AXDD DS";

  return `# UI Element Extract — ${profile.label}

> DS 출처: **${dsSource}**
> 본 프로젝트에 필요한 UI 요소(컴포넌트 후보)를 디자인 시스템 레퍼런스에서 추출.

## 1. 공용 컴포넌트 (5종)

| 컴포넌트 | 한 줄 설명 | 사용 이유 |
| --- | --- | --- |
| Button | 모든 액션의 진입점 (primary/secondary/ghost/outline) | 전 화면 공통 |
| Card | 정보 단위 컨테이너 (glass/solid/interactive) | 카드 그리드 패턴 |
| Input | 폼 입력 (text/textarea/search/select) | 사용자 입력 |
| Modal | 확인·경고 dialog + 슬라이드 패널 | 위험 액션·상세 보기 |
| Toast | 일시 알림 (success/warning/error/info) | 액션 피드백 |

## 2. 프로젝트 특화 컴포넌트 (${profile.domainComponents.length}종)

${profile.domainComponents
  .map(
    (c) => `### ${c.name}
- **목적**: ${c.purpose}
- **Variants**: ${c.variants.join(" / ")}
- **States**: ${c.states.join(" / ")}`,
  )
  .join("\n\n")}

## 3. 컴포넌트별 필요 이유

${profile.domainComponents
  .map(
    (c, i) =>
      `- **${c.name}** ← 요구사항: ${profile.personas[i % profile.personas.length]?.goal ?? "프로젝트 핵심 작업"}`,
  )
  .join("\n")}

---
다음 단계: \`ui-foundation-build\` 스킬이 위 요소들을 실제 디자인 토큰으로 변환한다.
`;
}
