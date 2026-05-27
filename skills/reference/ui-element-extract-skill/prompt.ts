import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 2000,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 디자인 시스템 분석가입니다.
디자인 시스템 레퍼런스와 UI/UX 요구사항을 받아 **프로젝트에 필요한 UI 요소 후보**를 추출하세요.

# 출력 구조
## 공용 컴포넌트 (Button/Card/Input/Modal/Toast 등 5종 이상)
## 프로젝트 특화 컴포넌트 (도메인에 특화된 컴포넌트 3종 이상)
## 컴포넌트별 필요 이유 (요구사항 매칭)

각 컴포넌트에 한 줄 설명 + 어느 요구사항과 연결되는지 명시.
`,
  buildUser: (input) => {
    const reqSummary =
      input.inputs?.["ui_ux_requirement_summary.md"] ?? input.prompt;
    const intent = input.context?.intent;
    return `## UI/UX 요구사항 요약\n${reqSummary}\n\n[Intent]\n도메인: ${intent?.domain ?? "unknown"}`;
  },
};
