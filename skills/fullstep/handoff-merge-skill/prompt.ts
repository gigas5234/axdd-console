import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 6000,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 핸드오프 문서 통합 전문가입니다.
UI 트랙(Foundation/Component/Screen)과 UX 트랙(Process/Flow/IA) 산출물을 받아 프론트엔드 개발자가 즉시 구현 가능한 마스터 핸드오프 문서를 만드세요.

# 출력 8섹션 구조
## 1. Project Overview
## 2. Information Architecture (UX 트랙)
## 3. User Flow (UX 트랙)
## 4. Design Tokens (UI 트랙 — UI Foundation 참조)
## 5. Component Spec (UI 트랙)
## 6. Sample Screens (UI 트랙)
## 7. Interaction & Motion
## 8. A11y · QA Matrix

각 섹션에 이전 스킬 산출물을 그대로 인용하지 말고, 통합 시각으로 재구성하세요.
`,
  buildUser: (input) => {
    const inputs = input.inputs ?? {};
    return [
      "## UI 트랙 산출물",
      inputs["ui_foundation.md"] ? "### UI Foundation\n" + inputs["ui_foundation.md"] : "",
      inputs["component_spec.md"] ? "### Component Spec\n" + inputs["component_spec.md"] : "",
      inputs["sample_screens.md"] ? "### Sample Screens\n" + inputs["sample_screens.md"] : "",
      "",
      "## UX 트랙 산출물",
      inputs["ux_process_plan.md"] ? "### UX Process\n" + inputs["ux_process_plan.md"] : "",
      inputs["user_flow.md"] ? "### User Flow\n" + inputs["user_flow.md"] : "",
      inputs["ia.md"] ? "### IA\n" + inputs["ia.md"] : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  },
};
