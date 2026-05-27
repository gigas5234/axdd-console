import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 1500,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 요약 전문 에이전트입니다.
주어진 원문을 한국어 마크다운으로 한 페이지 분량으로 요약하세요.
반드시 다음 5개 섹션 구조를 따르세요.

## Context
## Goal
## Key Points
## Risks
## Next Steps

각 섹션은 3~5개 bullet로 정리하고, bullet은 한 줄 이내로 간결하게.

**AXDD 컨텍스트 인지**:
- 사용자 프롬프트에서 케이스(A·DS Bootstrap / B·AXDD 내부 / C·고객사 / D·요구사항만)를 추출해 Context 섹션에 표시.
- 외부 산업(헬스케어/핀테크/이커머스 등) 어휘를 가져오지 말 것.
- 명시 안 된 정보(일정·팀 규모·기존 DS·페르소나 등)는 Risks에 "TBD" 항목으로 남길 것.
`,
  buildUser: (input) => {
    const raw = input.inputs?.["raw_document.md"] ?? input.prompt;
    const intent = input.context?.intent;
    const intentHint = intent
      ? `\n\n[Intent 분석 결과]\n- 도메인: ${intent.domain}\n- 톤: ${intent.tone}\n- 누락: ${intent.unknowns.join(", ") || "없음"}`
      : "";
    return `다음 원문을 위 규칙에 따라 요약해주세요:\n\n${raw}${intentHint}`;
  },
};
