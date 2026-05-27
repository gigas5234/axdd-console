/**
 * MOCK: Kickoff Report 산출물.
 * Phase 6 재정의: AXDD 4-Case 컨텍스트별 리스크/이해관계자/일정 반영.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildKickoffReport(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);
  const userPrompt = input.prompt?.trim() ?? "";

  // 컨텍스트별 특화 리스크
  const contextRisks: Record<string, string[]> = {
    "axdd-internal": [
      "(중간) 기존 AXDD DS 토큰과의 충돌 — 완화: 신규 토큰 제안 시 alias 검사",
      "(중간) 사내 다른 프로젝트와 컴포넌트 중복 — 완화: 카탈로그 사전 검색",
      "(낮음) 컨트리뷰션 가이드 미준수 — 완화: PR 템플릿 자동 체크",
    ],
    "customer-project": [
      "(높음) 고객사 가이드 변경 — 완화: 변경 알림 자동화",
      "(높음) 검수 일정·납기 — 완화: PM이 W0에 마일스톤 잠금",
      "(중간) 고객사 DS 누락 영역 — 완화: AXDD DS 폴백 정책 명시",
    ],
    "ds-bootstrap": [
      "(높음) 토큰 결정 지연 — 완화: 디자인팀 의사결정 미팅 W1 고정",
      "(중간) 부트스트랩 초안의 자기 일관성 — 완화: Human Gate 단계별 승인",
      "(중간) 향후 마이그레이션 리스크 — 완화: v0.x.x 시멘틱 버전 명시",
    ],
    generic: [
      "(중간) 프로젝트 컨텍스트 미확정 — 완화: clarifying 질문 진행",
      "(중간) 이해관계자 의사결정 지연 — 완화: PM이 W0에 일정 잠금",
      "(낮음) 산출물 검증 자동화 미완 — 완화: validation-skill 1차 자동화",
    ],
  };

  const risks = contextRisks[profile.id] ?? contextRisks.generic;

  // 컨텍스트별 이해관계자
  const contextStakeholders: Record<string, [string, string][]> = {
    "axdd-internal": [
      ["PMO Lead", "사내 일정·우선순위 조정"],
      ["Design Lead", "AXDD DS 일관성 검토"],
      ["Tech Lead", "사내 코드베이스 통합"],
    ],
    "customer-project": [
      ["고객사 의사결정자", "최종 승인·검수"],
      ["AXDD 프로젝트 리드", "프로젝트 진행·납기"],
      ["AXDD 디자이너", "고객사 DS 차용·핸드오프"],
    ],
    "ds-bootstrap": [
      ["DS 설계자", "토큰 구조·네이밍"],
      ["Design Lead", "최종 토큰 확정"],
      ["DS 컨트리뷰터", "리뷰·예시 작성"],
    ],
    generic: [
      ["PM", "일정 · 의사결정"],
      ["Tech Lead", "아키텍처 · 코드 리뷰"],
      ["Product Design Lead", "UX · UI 산출물"],
    ],
  };

  const stakeholders =
    contextStakeholders[profile.id] ?? contextStakeholders.generic;

  return `# 착수보고서 — ${profile.label}

> 원본 요청: "${userPrompt.length > 120 ? `${userPrompt.slice(0, 120)}…` : userPrompt}"
> 컨텍스트: **${profile.label}** · 톤: ${profile.toneDescriptors.join(" · ")}

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
| Discover | W1 | 이해관계자 인터뷰 · 컨텍스트 확정 |
| Define | W2 | IA · User Flow · 요구사항 명세 |
| Design | W3-4 | UI Foundation · 컴포넌트 스펙 · 핸드오프 |
| Build | W5 | MVP 구현 · 통합 |
| Validate | W6 | 사용성 테스트 · AXDD 컨텍스트 fit 검증 |

## 4. 주요 리스크 (${profile.label} 특화)
${risks.map((r) => `- ${r}`).join("\n")}

## 5. 다음 단계
1. 이해관계자 인터뷰 일정 잠금 (W0)
2. ${profile.id === "ds-bootstrap" ? "`design-system-bootstrap-workunit` 실행 → AXDD DS 초안 확보" : "`ui-ux-requirement-extract-skill` 실행 → UI/UX 요구사항 1페이지 요약"}
3. \`ui-foundation-build-skill\` → ${profile.id === "customer-project" ? "고객사 DS 차용" : "AXDD DS 차용"} 토큰 정의
4. \`handoff-merge-skill\` → 마스터 핸드오프 문서
5. \`output-validation-skill\` → AXDD 컨텍스트 fit 검증 + 휴먼 리뷰 진입
`;
}
