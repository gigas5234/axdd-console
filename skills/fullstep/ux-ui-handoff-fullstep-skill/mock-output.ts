/**
 * MOCK: UX/UI Handoff Full-step — 마스터 핸드오프 문서.
 *
 * 도메인별 프로필을 받아 10섹션 핸드오프를 동적으로 구성한다.
 * 이전 정적 mock의 가장 큰 문제(AXDD 콘솔로 anchoring)를 완전히 해결.
 *
 * 입력 우선순위:
 *   1. input.context.intent.domain → DomainProfile 선택
 *   2. domain이 없으면 generic profile
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUxUiHandoff(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);
  const userPrompt = input.prompt?.trim() || "";

  // ─── Section 1: Project Overview ─────────────────────────────
  const section1 = `## 1. Project Overview
- **프로젝트**: ${profile.label}
- **원본 요청**: "${userPrompt.length > 140 ? `${userPrompt.slice(0, 140)}…` : userPrompt}"
- **브랜드 정체성**: ${profile.brandShort}
- **톤**: ${profile.toneDescriptors.join(" · ")}
- **핵심 사용자**: ${profile.personas
    .slice(0, 2)
    .map((p) => p.role)
    .join(" / ")}
- **성공 지표 3개**
${profile.successMetrics.map((m, i) => `  ${i + 1}. ${m}`).join("\n")}`;

  // ─── Section 2: IA ──────────────────────────────────────────
  const section2 = `## 2. Information Architecture
\`\`\`
${profile.iaTree}
\`\`\``;

  // ─── Section 3: User Flow ───────────────────────────────────
  const section3 = `## 3. User Flow

${profile.userFlows
  .map(
    (f, i) => `> **Flow ${i + 1}: 〈${f.name}〉**
${f.steps.map((s, j) => `> ${j + 1}. ${s}`).join("\n")}`,
  )
  .join("\n\n")}`;

  // ─── Section 4: Design Tokens ───────────────────────────────
  const colorRows = profile.colorTokens
    .map((t) => `| \`${t.name}\` | ${t.hex} | ${t.usage} |`)
    .join("\n");

  const section4 = `## 4. Design Tokens

### Color
| Token | Hex | Usage |
| --- | --- | --- |
${colorRows}

### Typography
${profile.typographyPersonality}

| Token | Size / Weight / Line | Usage |
| --- | --- | --- |
| \`display\` | 28 / 700 / 1.20 | 페이지 타이틀 |
| \`h1\` | 24 / 700 / 1.25 | 섹션 제목 |
| \`h2\` | 18 / 600 / 1.30 | 카드 제목 |
| \`body\` | 14 / 400 / 1.55 | 본문 |
| \`body-sm\` | 13 / 400 / 1.50 | 카드 본문 |
| \`caption\` | 11 / 500 / 1.40 | 레이블 · 타임스탬프 |

### Spacing (4의 배수)
| Token | Value | Usage |
| --- | --- | --- |
| \`xs\` | 4 | 아이콘-텍스트 간격 |
| \`sm\` | 8 | 인라인 요소 간격 |
| \`md\` | 12 | 컴포넌트 내부 padding |
| \`lg\` | 16 | 카드 padding |
| \`xl\` | 20 | 섹션 간격 |
| \`2xl\` | 24 | 큰 섹션 간격 |
| \`3xl\` | 32 | 페이지 상하 여백 |

### Radius / Shadow / Motion
| Token | Value | Usage |
| --- | --- | --- |
| \`radius/sm\` | 6 | 작은 버튼 · 배지 |
| \`radius/md\` | 10 | Input · 일반 버튼 |
| \`radius/lg\` | 16 | 카드 |
| \`radius/xl\` | 24 | 모달 · 슬라이드 패널 |
| \`shadow/sm\` | 0 1 2 rgba(0,0,0,0.04) | 미세 elevation |
| \`shadow/md\` | 0 8 32 rgba(15,23,42,0.08) | 카드 떠 있는 느낌 |
| \`shadow/lg\` | 0 20 60 rgba(15,23,42,0.12) | hover · 모달 |

**Motion 가이드**: ${profile.motionGuide}`;

  // ─── Section 5: Component Spec ──────────────────────────────
  const commonComponents = `### Button
- **Variants**: primary / secondary / ghost / outline
- **States**: default / hover / focus-visible / disabled / loading
- **Token mapping**: \`radius/md\` · \`motion/snap\` · primary는 \`${profile.colorTokens[0]?.name}\`

### Card
- **Variants**: default / interactive
- **States**: default / hover (interactive only)
- **Token mapping**: \`radius/lg\` · \`shadow/md\``;

  const domainComponentSections = profile.domainComponents
    .map(
      (c) => `### ${c.name} *(${profile.id} 도메인 특화)*
- **Purpose**: ${c.purpose}
- **Variants**: ${c.variants.join(" / ")}
- **States**: ${c.states.join(" / ")}`,
    )
    .join("\n\n");

  const section5 = `## 5. Component Spec

${commonComponents}

${domainComponentSections}`;

  // ─── Section 6: Sample Screens ──────────────────────────────
  const section6 = `## 6. Sample Screens (${profile.sampleScreens.length}개)

${profile.sampleScreens
  .map(
    (s, i) =>
      `### Screen ${String.fromCharCode(65 + i)}: ${s.name}
${s.description}

\`\`\`
${s.wireframe}
\`\`\``,
  )
  .join("\n\n")}`;

  // ─── Section 7: Interaction & Motion ────────────────────────
  const section7 = `## 7. Interaction & Motion

| Trigger | Animation | Duration | Easing |
| --- | --- | --- | --- |
${profile.interactions
  .map(
    (i) => `| ${i.trigger} | ${i.animation} | ${i.duration} | ${i.easing} |`,
  )
  .join("\n")}`;

  // ─── Section 8: A11y ────────────────────────────────────────
  const section8 = `## 8. Accessibility Checklist (WCAG 2.1 AA + ${profile.id} 도메인 특화)
${profile.a11yChecklist.map((c) => `- [x] ${c}`).join("\n")}`;

  // ─── Section 9: QA Matrix ───────────────────────────────────
  const section9 = `## 9. QA Matrix

| Browser | Mobile (sm) | Tablet (md) | Laptop (lg) | Desktop (xl) |
| --- | --- | --- | --- | --- |
| Chrome 최신 | ✅ | ✅ | ✅ | ✅ |
| Safari 최신 | ✅ | ✅ | ✅ | ✅ |
| Firefox 최신 | — | — | ✅ | ✅ |
| Edge 최신 | — | — | ✅ | ✅ |

**Breakpoints**: sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536

검증 항목:
- 사이드바·헤더 반응형 동작
- ${profile.domainComponents[0]?.name ?? "주요 컴포넌트"} grid 모바일→데스크탑 전환
- 도메인 핵심 화면(${profile.sampleScreens[0]?.name})이 sm에서도 사용 가능`;

  // ─── Section 10: Figma AI Prompt ────────────────────────────
  const figmaPrompt = `프로젝트: ${profile.label}
원본 요청: "${userPrompt.length > 120 ? `${userPrompt.slice(0, 120)}…` : userPrompt}"
브랜드: ${profile.brandShort}

다음 화면 셋을 ${profile.label}용으로 만들어줘:
${profile.figmaFrames.map((f, i) => `${i + 1}. ${f}`).join("\n")}

규칙:
- 위 4번 토큰만 사용 (임의 색 추가 금지)
- 카드는 radius 16, padding 16
- Auto Layout 사용, gap은 4의 배수만
- Sample Screen은 desktop xl 1280px 폭 기준
- **사용자 요청 도메인 (${profile.id})을 모든 화면에서 일관되게 반영**
- 다른 도메인 예시 (예: 일반 SaaS 콘솔 화면 등)으로 변형하지 말 것`;

  const section10 = `## 10. Figma AI Prompt

> 아래 코드블록을 그대로 Figma 내장 AI (Make Designs) 또는 Figma First Draft에 붙여 넣으세요.

\`\`\`
${figmaPrompt}
\`\`\``;

  // ─── 최종 조립 ──────────────────────────────────────────────
  return `# UX/UI Master Handoff — ${profile.label}

> 이 문서는 사용자 요청 "${userPrompt.length > 80 ? `${userPrompt.slice(0, 80)}…` : userPrompt}"를 기반으로,
> **${profile.id}** 도메인에 맞춰 작성된 핸드오프 문서입니다.
> 디자이너가 즉시 Figma 작업을 시작할 수 있는 수준의 10섹션 풀세트.

---

${section1}

${section2}

${section3}

${section4}

${section5}

${section6}

${section7}

${section8}

${section9}

${section10}

---

**검증 메모**: \`output-validation-skill\`이 10섹션 존재 + ${profile.id} 도메인 키워드 등장 빈도를 자동 검증합니다.
`;
}

// 레거시 호환: 기존 import (ENHANCED_UX_UI_HANDOFF_MOCK)를 쓰던 곳을 위해.
// mocks/sample-outputs.ts에서 사용 중.
export const ENHANCED_UX_UI_HANDOFF_MOCK = buildUxUiHandoff({
  prompt: "(no prompt — legacy default)",
  inputs: {},
  context: {},
});
