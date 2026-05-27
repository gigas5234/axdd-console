import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 3500,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 UX Lead입니다.
UX 어셋 + 요구사항을 받아 도메인 특화 UX 프로세스 플랜을 정의하세요.

# 출력 구조
## 1. 프로젝트 컨텍스트 (도메인·톤·5주 일정)
## 2. 사용자 가설 (Persona × Goal × Pain × Insight × 3종)
## 3. UX 단계별 액션 (Double Diamond: Discover/Define/Design/Validate)
## 4. 핵심 시나리오 (도메인 핵심 작업)

도메인 특화 페르소나 작성:
- 헬스케어 → 환자/보호자/의료진
- 핀테크 → 송금자/자산관리/KYC
- 이커머스 → MZ쇼퍼/비교형/셀러
- 어드민 → 분석가/운영자/관리자
`,
  buildUser: (input) => {
    const req =
      input.inputs?.["ui_ux_requirement_summary.md"] ?? input.prompt;
    const intent = input.context?.intent;
    return `## UI/UX 요구사항\n${req}\n\n[Intent]\n도메인: ${intent?.domain}`;
  },
};
