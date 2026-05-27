/**
 * MOCK: 도메인 특화 UX 프로세스 플랜.
 * 페르소나 + Double Diamond 4단계.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUxProcessDefine(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);

  return `# UX Process Plan — ${profile.label}

> ${profile.brandShort}

## 1. 프로젝트 컨텍스트
- 도메인: ${profile.id}
- 톤: ${profile.toneDescriptors.join(" · ")}
- 일정: 5주 (Double Diamond)

## 2. 사용자 가설 (페르소나 ${profile.personas.length}종)

${profile.personas
  .map(
    (p, i) =>
      `### Persona ${i + 1} — ${p.role}
- **Goal**: ${p.goal}
- **Pain**: ${p.pain}
- **Insight**: ${p.insight}`,
  )
  .join("\n\n")}

## 3. UX 단계별 액션 (Double Diamond · 5주)

### 🔍 Discover (1주)
| Action | Method | Output |
| --- | --- | --- |
| ${profile.id} 사용자 인터뷰 | 1:1 ×5명 | \`stakeholder_insights.md\` |
| 기존 ${profile.id} 제품 분석 | Heuristic eval | \`competitor_audit.md\` |
| 도메인 표준·규제 | 자료 수집 | \`domain_standards.md\` |

### 📐 Define (1주)
| Action | Method | Output |
| --- | --- | --- |
| 페르소나 확정 | 인사이트 종합 | \`personas.md\` |
| JTBD 도출 | JTBD 인터뷰 | \`jtbd_map.md\` |
| 핵심 시나리오 정의 | state machine | (다음 스킬: user-flow-design) |

### 🎨 Design (2주)
| Action | Method | Output |
| --- | --- | --- |
| UI Foundation 적용 | 디자인 토큰 | (UI 트랙 산출물) |
| 와이어프레임 → 비주얼 | Figma | (UI 트랙 산출물) |
| 인터랙션 명세 | timing + easing | \`motion_spec.md\` |

### ✅ Validate (1주)
| Action | Method | Output |
| --- | --- | --- |
| 사용성 테스트 | task ×5, 사용자 ×5 | \`usability_test_report.md\` |
| A11y 검증 | WCAG 2.1 AA | \`a11y_audit.md\` |
| 도메인 fit 검증 | 키워드 카운트 | \`domain_fit_report.md\` |

## 4. 핵심 시나리오 (다음 스킬에서 user flow로)

${profile.userFlows
  .map((f, i) => `### Scenario ${i + 1}: ${f.name}`)
  .join("\n")}

---
다음 단계: \`user-flow-design\` 스킬이 위 시나리오를 state-based flow로 작성한다.
`;
}
