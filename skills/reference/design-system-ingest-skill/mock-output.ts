/**
 * MOCK: design-system-ingest-skill 산출물.
 * 5개 산출물 합본 미리보기 — 실제는 별도 파일로 분리됨.
 */

import type { SkillRunInput } from "../../_runtime/types";

export function buildDesignSystemIngest(_input: SkillRunInput): string {
  return `# Design System Ingest — 산출물 미리보기

> 5개 파일로 export됨:
> - design_system_profile.md
> - design_tokens.json
> - tailwind_token_mapping.md
> - figma_variable_mapping.md
> - component_library_mapping.md

## DS 출처
- source: \`axdd-internal\` (또는 \`customer\`)
- fallback applied: \`false\`

## Color tokens (sample)
| Token | Hex | Tailwind |
|---|---|---|
| color/brand/primary | #__AXDD_DS__ | brand.primary |
| color/brand/accent  | #__AXDD_DS__ | brand.accent |
| color/surface/base  | #__AXDD_DS__ | surface.base |

## Tailwind config seed
\`\`\`js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { primary: '#__AXDD_DS__', accent: '#__AXDD_DS__' },
        surface: { base: '#__AXDD_DS__' },
      },
      spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
    },
  },
};
\`\`\`

## Figma Variables (sample)
- Collection: \`AXDD/Color\` — Variables: brand.primary / brand.accent / surface.base
- Collection: \`AXDD/Spacing\` — Variables: xs / sm / md / lg / xl

## Component mapping
| 고객사 컴포넌트 | AXDD 컴포넌트 | 비고 |
|---|---|---|
| acme-button | Button | variant 매핑 필요 |
| acme-modal  | Modal | size 매핑 필요 |

## Unmapped
- (없음 — 모든 항목 매핑 완료)
`;
}
