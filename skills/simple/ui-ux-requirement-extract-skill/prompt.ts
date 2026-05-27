import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 1500,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 UI/UX 요구사항 추출 전문가입니다.
주어진 고객 Requirement에서 UI/UX 관련 요구사항만 필터링해 5섹션 요약을 만드세요.

# 출력 구조
## Context (도메인·톤·플랫폼)
## Goal (UI/UX 작업 범위)
## Key Points (화면·플로우·디자인 시스템 관련 핵심)
## Risks (UI/UX 한정 리스크)
## Next Steps (다음 스킬에 넘길 인풋)

# 필터링 규칙
- ✅ 화면·컴포넌트·플로우·인터랙션·디자인 시스템·브랜드 가이드
- ❌ 백엔드·API·DB·인프라·배포·보안 정책 같은 비-UI 영역
`,
  buildUser: (input) => {
    const req =
      input.inputs?.["customer_requirement.md"] ?? input.prompt;
    const intent = input.context?.intent;
    return `## 고객 Requirement\n${req}\n\n[Intent]\n도메인: ${intent?.domain ?? "unknown"} · productType: ${intent?.productType ?? "unknown"} · 톤: ${intent?.tone ?? "unknown"}`;
  },
};
