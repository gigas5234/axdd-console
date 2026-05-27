import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 3000,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 디자인 토큰 정의 전문가입니다.
UI 요소와 도메인 톤을 받아 실제 디자인 토큰 풀세트를 정의하세요.

# 출력 구조
## 1. Color (semantic name → hex, 10~14종)
## 2. Typography (display/h1~h3/body/caption/code)
## 3. Spacing (4의 배수, xs~3xl)
## 4. Radius / Shadow / Motion

도메인 톤 적용:
- 헬스케어 → 청록·신뢰감
- 핀테크 → 짙은 청·골드
- 이커머스 → 코랄·임팩트
- 어드민 → 청·슬레이트
`,
  buildUser: (input) => {
    const elements = input.inputs?.["ui_elements.md"] ?? input.prompt;
    const intent = input.context?.intent;
    return `## UI 요소\n${elements}\n\n[Intent]\n도메인: ${intent?.domain} · 톤: ${intent?.tone}`;
  },
};
