/**
 * MOCK: 도메인 톤에 맞춘 디자인 토큰 풀세트.
 * Color/Typography/Spacing/Radius/Shadow/Motion 모두 도메인 프로필에서.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUiFoundation(input: SkillRunInput): string {
  const profile = getDomainProfile(input.context?.intent?.domain);

  return `# UI Foundation — ${profile.label}

> 디자인 토큰 풀세트. ${profile.brandShort}.

## 1. Color
| Token | Hex | Usage |
| --- | --- | --- |
${profile.colorTokens.map((t) => `| \`${t.name}\` | ${t.hex} | ${t.usage} |`).join("\n")}

## 2. Typography
${profile.typographyPersonality}

| Token | Size / Weight / Line | Usage |
| --- | --- | --- |
| \`display\` | 28 / 700 / 1.20 | 페이지 타이틀 |
| \`h1\` | 24 / 700 / 1.25 | 섹션 제목 |
| \`h2\` | 18 / 600 / 1.30 | 카드 제목 |
| \`h3\` | 14 / 600 / 1.40 | 패널 제목 |
| \`body\` | 14 / 400 / 1.55 | 본문 |
| \`body-sm\` | 13 / 400 / 1.50 | 보조 본문 |
| \`caption\` | 11 / 500 / 1.40 | 레이블 |

## 3. Spacing (4의 배수)
| Token | Value | Usage |
| --- | --- | --- |
| \`xs\` | 4 | 아이콘-텍스트 |
| \`sm\` | 8 | 인라인 간격 |
| \`md\` | 12 | 컴포넌트 padding |
| \`lg\` | 16 | 카드 padding |
| \`xl\` | 20 | 섹션 간격 |
| \`2xl\` | 24 | 큰 섹션 |
| \`3xl\` | 32 | 페이지 여백 |

## 4. Radius / Shadow / Motion
| Token | Value | Usage |
| --- | --- | --- |
| \`radius/sm\` | 6 | 작은 버튼·배지 |
| \`radius/md\` | 10 | Input·일반 버튼 |
| \`radius/lg\` | 16 | 카드 |
| \`radius/xl\` | 24 | 모달 |
| \`shadow/sm\` | 0 1 2 rgba(0,0,0,0.04) | 미세 elevation |
| \`shadow/md\` | 0 8 32 rgba(15,23,42,0.08) | 카드 떠있는 느낌 |
| \`shadow/lg\` | 0 20 60 rgba(15,23,42,0.12) | hover · 모달 |

**Motion 가이드**: ${profile.motionGuide}

## 5. Do / Don't
- ✅ 도메인 톤 (${profile.toneDescriptors.join(" · ")}) 일관 유지
- ✅ Color 토큰 kebab-case + slash 표기
- ✅ Spacing 4의 배수만
- ❌ 임의 hex 값 인라인 사용 금지
- ❌ 다른 도메인 톤 차용 금지

---
다음 단계: \`component-spec-write\` 스킬이 위 토큰을 적용해 컴포넌트 스펙을 작성한다.
`;
}
