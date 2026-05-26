/**
 * MOCK: UX Process Asset 산출물.
 * intent.domain을 받아 도메인별 페르소나/유저플로우를 반영.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUxProcessAsset(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);

  const personaSections = profile.personas
    .map(
      (p, i) =>
        `### Persona ${i + 1} — ${p.role}
- **Goal**: ${p.goal}
- **Pain**: ${p.pain}
- **Insight**: ${p.insight}`,
    )
    .join("\n\n");

  return `# UX Process Plan — ${profile.label}

> 입력: \`raw_requirement.md\`
> 산출: Double Diamond 기반 5주 플랜 + 도메인(${profile.id}) 특화 페르소나·플로우.

## 1. 프로젝트 컨텍스트
**도메인**: ${profile.id === "unknown" ? "⚠️ 미지정 — generic UX 프로세스" : profile.label}
**브랜드 정체성**: ${profile.brandShort}
**톤**: ${profile.toneDescriptors.join(" · ")}

5주 일정으로 UX 프로세스 진행. 인터뷰는 PM·디자이너 분담.

## 2. 사용자 가설 (Persona × Goal × Pain × Insight)

${personaSections}

## 3. UX 단계별 액션 (Double Diamond · 5주)

### 🔍 Discover (1주)
| Action | Method | Output |
| --- | --- | --- |
| ${profile.id} 사용자 인터뷰 | 1:1 ×5명 (30분) | \`stakeholder_insights.md\` |
| 기존 ${profile.id} 제품 분석 | Heuristic eval | \`competitor_audit.md\` |
| 실제 사용자 관찰 | shadow ×3명 | \`user_observation.md\` |
| ${profile.id} 도메인 표준 / 규제 | 자료 수집 | \`domain_standards.md\` |

### 📐 Define (1주)
| Action | Method | Output |
| --- | --- | --- |
| 페르소나 확정 | 위 인사이트 종합 | \`personas.md\` |
| Job-To-Be-Done 도출 | JTBD 인터뷰 | \`jtbd_map.md\` |
| 핵심 사용자 플로우 (${profile.userFlows.length}개) | state machine | \`user_flow.md\` |
| 정보 구조 (IA) | card sorting | \`ia.md\` |

### 🎨 Design (2주)
| Action | Method | Output |
| --- | --- | --- |
| ${profile.id} 도메인 UI Foundation 정의 | 디자인 토큰 | (디자인 시스템 스킬이 담당) |
| 도메인 특화 컴포넌트 (${profile.domainComponents.length}종) | Anatomy + Props | (핸드오프 스킬이 담당) |
| 와이어프레임 → 비주얼 디자인 | Figma | \`screens.md\` |
| 인터랙션 / 모션 사양 | timing + easing | \`motion_spec.md\` |

### ✅ Validate (1주)
| Action | Method | Output |
| --- | --- | --- |
| 사용성 테스트 | task ×5, 사용자 ×5 | \`usability_test_report.md\` |
| 접근성 검증 | WCAG 2.1 AA | \`a11y_audit.md\` |
| 개발자 핸드오프 리뷰 | 합동 워크샵 | \`handoff_review.md\` |
| 도메인 fit 검증 | 도메인 키워드 카운트 + 휴먼 리뷰 | \`domain_fit_report.md\` |

## 4. 핵심 User Flow (${profile.id})
${profile.userFlows
  .map(
    (f, i) =>
      `### Flow ${i + 1}: ${f.name}
${f.steps.map((s, j) => `${j + 1}. ${s}`).join("\n")}`,
  )
  .join("\n\n")}

## 5. 검증 체크리스트 (도메인 fit 포함)
- [ ] 모든 페르소나의 핵심 시나리오가 user flow에 존재
- [ ] IA 트리에 고아 페이지(orphan) 없음
- [ ] 화면 ≥ 3개에 대해 컴포넌트 단위 스펙 작성됨
- [ ] 본문 색 대비 ≥ 4.5:1 충족
- [ ] 키보드 only 네비게이션 가능
- [ ] 빈/로딩/에러 상태가 모든 데이터 화면에 정의됨
- [ ] 반응형 정의됨 (sm/md/lg)
- [ ] 임의값 0 (디자인 토큰만 사용)
- [ ] **모든 산출물에 ${profile.id} 도메인 키워드가 일관되게 등장**
- [ ] **다른 도메인 컨텍스트로 누출되지 않음 (검증 스킬이 자동 체크)**
- [ ] 모션 사양 ≥ ${profile.interactions.length}개
- [ ] 휴먼 리뷰 일정 및 책임자 확정

## 6. 리스크 · 완화

| Risk | 영향 | 완화 |
| --- | --- | --- |
| 이해관계자 일정 미확정 | 인터뷰 지연 | PM이 일정 잠금 (Discover 시작 전) |
| 도메인 표준 / 규제 미파악 | 컴플라이언스 실패 | Discover 단계 \`domain_standards.md\` 필수 |
| 다른 도메인 예시 anchoring | 산출물 일관성 깨짐 | validation skill이 도메인 fit 자동 체크 |
| 사용자 모집 실패 | Validate 지연 | 사내 대체 사용자 풀 확보 |

---
다음 단계: \`ux-ui-handoff-fullstep-skill\`이 위 프로세스 산출물을 합쳐 **${profile.label}**의 마스터 핸드오프 문서를 만든다.
`;
}
