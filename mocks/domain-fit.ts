/**
 * MOCK: Governance용 AXDD 컨텍스트 fit 통계 (Phase 6 재정의).
 * 외부 산업 도메인(헬스케어/핀테크/이커머스) 통계 → AXDD 4-Case 통계로 교체.
 *
 * Validation 4-state:
 *   - passed              : 자동 검증 + 휴먼 리뷰 모두 OK
 *   - passed-with-review  : 자동 검증 OK, 휴먼 리뷰만 남음 (정상 기본값)
 *   - needs-review        : warning (외부 산업 누출 등)
 *   - failed              : error (필수 섹션 누락, 컨텍스트 키워드 부족 등)
 */

export interface DomainFitEntry {
  runId: string;
  domain: string;
  workUnit: string;
  promptSnippet: string;
  domainHits: number;
  otherDomainHits: number;
  validationStatus: "passed" | "passed-with-review" | "needs-review" | "failed";
  timestamp: string;
}

export const MOCK_DOMAIN_FIT: DomainFitEntry[] = [
  {
    runId: "run-101",
    domain: "axdd-internal",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "사내 어드민 신규 화면 추가 — 데이터 테이블 + 권한 매트릭스",
    domainHits: 87,
    otherDomainHits: 1,
    validationStatus: "passed-with-review",
    timestamp: "2026-05-27T11:30:00+09:00",
  },
  {
    runId: "run-102",
    domain: "ds-bootstrap",
    workUnit: "design-system-bootstrap-workunit",
    promptSnippet: "AXDD 자체 디자인 시스템 부트스트랩 초안",
    domainHits: 62,
    otherDomainHits: 0,
    validationStatus: "passed-with-review",
    timestamp: "2026-05-27T10:18:00+09:00",
  },
  {
    runId: "run-103",
    domain: "customer-project",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "외부 고객사 프로젝트 — 고객사 DS 차용 핸드오프",
    domainHits: 78,
    otherDomainHits: 2,
    validationStatus: "passed-with-review",
    timestamp: "2026-05-27T09:45:00+09:00",
  },
  {
    runId: "run-104",
    domain: "axdd-internal",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "사내 Skill Builder UI 추가",
    domainHits: 92,
    otherDomainHits: 0,
    validationStatus: "passed",
    timestamp: "2026-05-26T17:22:00+09:00",
  },
  {
    runId: "run-105",
    domain: "unknown",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "스킬 하나 만들어줘",
    domainHits: 0,
    otherDomainHits: 0,
    validationStatus: "failed",
    timestamp: "2026-05-26T14:05:00+09:00",
  },
  {
    runId: "run-106",
    domain: "customer-project",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "고객사 프로젝트 — AXDD DS 폴백 사용",
    domainHits: 71,
    otherDomainHits: 5,
    validationStatus: "needs-review",
    timestamp: "2026-05-26T11:08:00+09:00",
  },
];
