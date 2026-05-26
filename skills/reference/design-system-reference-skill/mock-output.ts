/**
 * MOCK: Design System Reference 산출물.
 *
 * intent.domain을 받아 도메인별로 다른 토큰·타이포·모션 가이드를 반환한다.
 * 헬스케어 = 청록·신뢰 / 핀테크 = 짙은청·골드 / 이커머스 = 코랄·임팩트 / ...
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildDesignSystemReference(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);

  const colorRows = profile.colorTokens
    .map((t) => `| \`${t.name}\` | ${t.hex} | ${t.usage} |`)
    .join("\n");

  return `# UI Foundation — ${profile.label}

> 도메인: **${profile.id}** · 톤: ${profile.toneDescriptors.join(", ")}
> 브랜드 정체성: ${profile.brandShort}

## 1. Color Tokens
| Token | Hex | Usage |
| --- | --- | --- |
${colorRows}

## 2. Typography
${profile.typographyPersonality}

| Token | Size / Weight / Line | Usage |
| --- | --- | --- |
| \`display\` | 28 / 700 / 1.20 | 페이지 타이틀 |
| \`h1\` | 24 / 700 / 1.25 | 섹션 제목 |
| \`h2\` | 18 / 600 / 1.30 | 카드 제목 |
| \`h3\` | 14 / 600 / 1.40 | 패널 제목 |
| \`body\` | 14 / 400 / 1.55 | 본문 |
| \`body-sm\` | 13 / 400 / 1.50 | 카드 본문 · 설명 |
| \`caption\` | 11 / 500 / 1.40 | 레이블 · 타임스탬프 |
| \`code\` | 12 / 500 / 1.50 (mono) | 파일 경로 · 토큰명 |

## 3. Spacing Scale (4의 배수)
| Token | Value | Usage |
| --- | --- | --- |
| \`xs\` | 4 | 아이콘-텍스트 간격 |
| \`sm\` | 8 | 인라인 요소 간격 |
| \`md\` | 12 | 컴포넌트 내부 padding |
| \`lg\` | 16 | 카드 padding |
| \`xl\` | 20 | 섹션 간격 |
| \`2xl\` | 24 | 큰 섹션 간격 |
| \`3xl\` | 32 | 페이지 상하 여백 |

## 4. Radius · Shadow · Motion
| Token | Value | Usage |
| --- | --- | --- |
| \`radius/sm\` | 6 | 작은 버튼 · 배지 |
| \`radius/md\` | 10 | Input · 일반 버튼 |
| \`radius/lg\` | 16 | 카드 |
| \`radius/xl\` | 24 | 모달 · 슬라이드 패널 |
| \`shadow/sm\` | 0 1 2 rgba(0,0,0,0.04) | 미세 elevation |
| \`shadow/md\` | 0 8 32 rgba(15,23,42,0.08) | 카드 떠있는 느낌 |
| \`shadow/lg\` | 0 20 60 rgba(15,23,42,0.12) | hover · 모달 |

**Motion 가이드**: ${profile.motionGuide}

## 5. Domain-Specific Components
${profile.id} 도메인에 필요한 핵심 컴포넌트(공용 Button/Card/Input 외 추가):

${profile.domainComponents
  .map(
    (c) =>
      `- **${c.name}** — ${c.purpose} (variants: ${c.variants.join(", ")} · states: ${c.states.join(", ")})`,
  )
  .join("\n")}

## 6. Component → Token Mapping
| Component | Tokens used |
| --- | --- |
| Button | \`radius/md\` · \`motion/snap\` · variant별 \`primary|status/*\` |
| Card | \`radius/lg\` · \`shadow/md\` · 도메인 배경 |
| Input | \`radius/md\` · focus ring \`${profile.colorTokens[0]?.name}/30\` |
| Modal | \`radius/xl\` · \`shadow/lg\` · \`motion/smooth\` |
${profile.domainComponents
  .slice(0, 3)
  .map(
    (c) =>
      `| ${c.name} | \`${profile.colorTokens[0]?.name}\` · \`radius/lg\` · 도메인 특화 |`,
  )
  .join("\n")}

## 7. Do / Don't
- ✅ **도메인 일관성 우선**: ${profile.id === "unknown" ? "도메인 미지정 시 generic 사용" : `모든 산출물에 ${profile.id} 도메인 키워드/맥락 유지`}
- ✅ Color 토큰 이름은 kebab-case + slash 표기
- ✅ Spacing은 4의 배수만
- ✅ Radius는 정의된 4종 외 사용 금지
- ❌ 임의 hex 값 인라인 사용 금지
- ❌ **다른 도메인 예시 (예: AXDD SkillOps Console 등 내부 카탈로그) 토큰을 그대로 가져오지 말 것**
- ❌ 임의 spacing (5, 7, 9 등) 사용 금지

---
다음 단계: \`ux-process-asset-skill\`이 위 토큰을 기반으로 ${profile.id === "unknown" ? "generic" : profile.id} UX 프로세스 플랜을 만든다.
`;
}
