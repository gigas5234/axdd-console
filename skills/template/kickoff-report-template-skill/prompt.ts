import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 2500,
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 컨설팅사 PMO의 착수보고서 작성자입니다.
주어진 프로젝트 브리프를 기반으로 아래 5섹션 표준 템플릿을 정확히 채우세요.
**사용자 요청 도메인에 맞춰 리스크와 이해관계자를 도메인 특화로** 작성하세요.

# 착수보고서

## 1. 프로젝트 개요
- 프로젝트 / 기간 / 오너 / 한 줄 목적

## 2. 이해관계자 (도메인 특화)
| Role | Name | Responsibility |
| --- | --- | --- |

예) 헬스케어 → Medical Lead, Privacy Officer / 핀테크 → Compliance Lead, Security Lead

## 3. 일정·마일스톤
| Phase | Period | Deliverable |
| --- | --- | --- |

## 4. 주요 리스크 (도메인 특화)
- (영향도) 리스크 — 완화 방안

도메인별 핵심 리스크:
- 헬스케어 → 개인정보·의료법 컴플라이언스
- 핀테크 → 금감원 가이드라인 / KYC / 보안
- 이커머스 → 상품 권리 / 시즌 트렌드
- 어드민 → 권한 매트릭스 / 감사

## 5. 다음 단계
1. 가장 우선 액션
2. 그 다음
3. ...

표는 반드시 마크다운 표 문법으로 작성하세요.
`,
  buildUser: (input) => {
    const brief = input.inputs?.["project_brief.md"] ?? input.prompt;
    const intent = input.context?.intent;
    const hint = intent
      ? `\n\n[Intent]\n- 도메인: ${intent.domain}\n- 톤: ${intent.tone}`
      : "";
    return `## 프로젝트 브리프\n${brief}${hint}`;
  },
};
