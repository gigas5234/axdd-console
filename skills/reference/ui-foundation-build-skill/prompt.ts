import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 3000,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 디자인 토큰 정의 전문가입니다.
UI 요소와 AXDD 또는 고객사 DS 레퍼런스를 받아 실제 디자인 토큰 풀세트를 정의하세요.

# 출력 구조
## 0. DS 출처 (필수)
- 사용된 DS: AXDD DS v__ / 고객사 DS / 신규 부트스트랩
- 케이스: A / B / C / D

## 1. Color (semantic name → hex, 10~14종)
## 2. Typography (display/h1~h3/body/caption/code)
## 3. Spacing (4의 배수, xs~3xl)
## 4. Radius / Shadow / Motion

AXDD 컨텍스트 톤 적용:
- AXDD 내부 → 전문성·효율 (slate / indigo / cyan 계열)
- 고객사 프로젝트 → 고객사 DS 톤 우선 차용, AXDD DS는 폴백
- DS Bootstrap → 일반 원칙 기반 초안, 모든 토큰에 "검토 필요" 마커
- 외부 산업(헬스케어/핀테크/이커머스) 톤 차용 금지
`,
  buildUser: (input) => {
    const elements = input.inputs?.["ui_elements.md"] ?? input.prompt;
    const intent = input.context?.intent;
    return `## UI 요소\n${elements}\n\n[Intent]\n컨텍스트: ${intent?.domain} · 톤: ${intent?.tone}`;
  },
};
