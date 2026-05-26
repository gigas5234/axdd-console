/**
 * MOCK: Kickoff Report 산출물.
 * intent.domain을 받아 도메인 특화 리스크/이해관계자/일정을 반영.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildKickoffReport(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);
  const userPrompt = input.prompt?.trim() ?? "";

  // 도메인별 특화 리스크
  const domainRisks: Record<string, string[]> = {
    헬스케어: [
      "(높음) 개인정보·의료법 컴플라이언스 — 완화: Legal 사전 검토 필수",
      "(중간) 의료진/환자 인터뷰 일정 잡기 어려움 — 완화: PM이 W0 사전 협의",
      "(중간) 의료 용어 일관성 — 완화: 의료팀 검수 단계 추가",
    ],
    핀테크: [
      "(높음) 금융감독원 가이드라인 준수 — 완화: 컴플라이언스 사전 체크",
      "(높음) KYC / 보안 / 2FA 모든 화면에서 일관성 유지",
      "(중간) 실시간 환율·시세 API 신뢰성 — 완화: 폴백 데이터 정책",
    ],
    이커머스: [
      "(중간) 상품 이미지 권리 / 셀러 컨텐츠 검수",
      "(중간) 시즌 트렌드에 따른 큐레이션 업데이트 주기",
      "(낮음) 결제 모듈 통합 (PG 다중 채널)",
    ],
    어드민: [
      "(높음) 권한 매트릭스 복잡도 — 완화: 역할 템플릿 사전 정의",
      "(중간) 대용량 데이터 테이블 성능 — 완화: virtualization 적용",
      "(중간) 감사 로그 영속성 — 완화: 별도 storage 정책",
    ],
  };

  const risks = domainRisks[profile.id] ?? [
    "(중간) 디자인 시스템 부재 — 완화: Reference 스킬로 사전 토큰 확보",
    "(중간) 이해관계자 의사결정 지연 — 완화: PM이 W0에 일정 잠금",
    "(낮음) 산출물 검증 자동화 미완 — 완화: validation-skill 1차 자동화",
  ];

  // 도메인별 이해관계자
  const domainStakeholders: Record<string, [string, string][]> = {
    헬스케어: [
      ["Medical Lead", "의료 정확성 · 용어 검수"],
      ["Privacy Officer", "민감정보 처리 검수"],
      ["UX Lead", "환자/보호자 인터뷰 · 산출물"],
    ],
    핀테크: [
      ["Compliance Lead", "금감원 가이드라인 검수"],
      ["Security Lead", "KYC · 2FA · 위협 모델링"],
      ["Product Manager", "핵심 사용자 시나리오"],
    ],
    이커머스: [
      ["Merchandising Lead", "큐레이션 · 시즌 전략"],
      ["Seller Ops", "셀러 입점 / 컨텐츠 검수"],
      ["UX Lead", "MZ 사용자 인터뷰"],
    ],
    어드민: [
      ["Platform Lead", "권한 · 인프라"],
      ["Operations", "감사 로그 · SLO"],
      ["UX Lead", "데이터 분석가 / 운영자 워크플로우"],
    ],
  };

  const stakeholders = domainStakeholders[profile.id] ?? [
    ["PM", "일정 · 의사결정"],
    ["Tech Lead", "아키텍처 · 코드 리뷰"],
    ["Product Design Lead", "UX · UI 산출물"],
  ];

  return `# 착수보고서 — ${profile.label}

> 원본 요청: "${userPrompt.length > 120 ? `${userPrompt.slice(0, 120)}…` : userPrompt}"
> 도메인: **${profile.id}** · 톤: ${profile.toneDescriptors.join(" · ")}

## 1. 프로젝트 개요
- **프로젝트명**: ${profile.label}
- **기간**: 6주 (예시)
- **오너**: Operations
- **한 줄 목적**: ${profile.brandShort}

## 2. 이해관계자
| Role | Responsibility |
| --- | --- |
${stakeholders.map(([r, p]) => `| ${r} | ${p} |`).join("\n")}
| QA Lead | 검증 · 릴리즈 게이트 |

## 3. 일정 · 마일스톤
| Phase | Period | Deliverable |
| --- | --- | --- |
| Discover | W1 | ${profile.id} 사용자 인터뷰 · 도메인 표준 분석 |
| Define | W2 | IA · User Flow · 요구사항 명세 |
| Design | W3-4 | UI Foundation · 컴포넌트 스펙 · 핸드오프 |
| Build | W5 | MVP 구현 · 통합 |
| Validate | W6 | 사용성 테스트 · 도메인 fit 검증 |

## 4. 주요 리스크 (${profile.id} 도메인 특화)
${risks.map((r) => `- ${r}`).join("\n")}

## 5. 다음 단계
1. 이해관계자 인터뷰 일정 잠금 (W0)
2. \`design-system-reference-skill\` 실행 → ${profile.id} 도메인 토큰 확보
3. \`ux-process-asset-skill\` → 5주 UX 프로세스 플랜
4. \`ux-ui-handoff-fullstep-skill\` → 마스터 핸드오프 문서
5. \`output-validation-skill\` → 도메인 fit 검증 + 휴먼 리뷰 진입
`;
}
