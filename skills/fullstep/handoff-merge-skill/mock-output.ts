/**
 * MOCK: 마스터 핸드오프 — UI 트랙 + UX 트랙을 8섹션으로 통합.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildHandoffMerge(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);
  const userPrompt = input.prompt?.trim() ?? "";
  const primaryToken = profile.colorTokens[0]?.name ?? "primary";

  return `# Master Handoff — ${profile.label}

> 원본 요청: "${userPrompt.length > 80 ? userPrompt.slice(0, 80) + "…" : userPrompt}"
> UI 트랙 (Foundation·Component·Screen) + UX 트랙 (Process·Flow·IA) 통합.

---

## 1. Project Overview
- **프로젝트**: ${profile.label}
- **브랜드 정체성**: ${profile.brandShort}
- **톤**: ${profile.toneDescriptors.join(" · ")}
- **핵심 사용자**: ${profile.personas.slice(0, 2).map((p) => p.role).join(" / ")}
- **성공 지표**:
${profile.successMetrics.map((m, i) => `  ${i + 1}. ${m}`).join("\n")}

## 2. Information Architecture
\`\`\`
${profile.iaTree}
\`\`\`

## 3. User Flow

${profile.userFlows
  .map(
    (f, i) =>
      `### Flow ${i + 1}: ${f.name}
${f.steps.map((s, j) => `${j + 1}. ${s}`).join("\n")}`,
  )
  .join("\n\n")}

## 4. Design Tokens (요약 — 자세히는 \`ui_foundation.md\` 참조)

### Color (대표 6종)
| Token | Hex | Usage |
| --- | --- | --- |
${profile.colorTokens.slice(0, 6).map((t) => `| \`${t.name}\` | ${t.hex} | ${t.usage} |`).join("\n")}

### Typography
${profile.typographyPersonality}

### Spacing
4의 배수 (xs 4 / sm 8 / md 12 / lg 16 / xl 20 / 2xl 24 / 3xl 32)

### Motion
${profile.motionGuide}

## 5. Component Spec
공용 5종 (Button/Card/Input/Modal/Toast) + 프로젝트 특화 ${profile.domainComponents.length}종.

${profile.domainComponents
  .map((c) => `- **${c.name}** — ${c.purpose}`)
  .join("\n")}

자세한 스펙은 \`component_spec.md\` 참조.

## 6. Sample Screens (${profile.sampleScreens.length}개)

${profile.sampleScreens
  .map(
    (s, i) =>
      `### Screen ${String.fromCharCode(65 + i)}: ${s.name}
${s.description}

\`\`\`
${s.wireframe}
\`\`\``,
  )
  .join("\n\n")}

## 7. Interaction & Motion

| Trigger | Animation | Duration | Easing |
| --- | --- | --- | --- |
${profile.interactions
  .map((i) => `| ${i.trigger} | ${i.animation} | ${i.duration} | ${i.easing} |`)
  .join("\n")}

## 8. A11y · QA Matrix

### Accessibility (WCAG 2.1 AA + ${profile.id} 프로젝트 특화)
${profile.a11yChecklist.map((c) => `- [x] ${c}`).join("\n")}

### QA Matrix
| Browser | Mobile (sm) | Tablet (md) | Laptop (lg) | Desktop (xl) |
| --- | --- | --- | --- | --- |
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ | ✅ |
| Firefox | — | — | ✅ | ✅ |
| Edge | — | — | ✅ | ✅ |

Breakpoints: sm 640 / md 768 / lg 1024 / xl 1280

---

다음 단계: \`figma-prompt-build\` 스킬이 이 핸드오프를 Figma AI 프롬프트로 변환한다.
컨텍스트 키워드 ${profile.domainKeywords.length}종 자동 반영.
`;
}
