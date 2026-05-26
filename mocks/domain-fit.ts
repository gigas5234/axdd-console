/**
 * MOCK: Governance용 도메인 fit 통계.
 * 실제 운영 시 runs 테이블 + validation 로그에서 집계.
 *
 * Validation 4-state:
 *   - passed              : 자동 검증 + 휴먼 리뷰 모두 OK (드물게 reviewRequired=false 인 시스템 산출물)
 *   - passed-with-review  : 자동 검증 OK, 휴먼 리뷰만 남음 (대부분의 정상 케이스)
 *   - needs-review        : warning (도메인 누출 등) — 의미 점검 필요
 *   - failed              : error (필수 섹션 누락, 도메인 키워드 부족 등)
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
    runId: "run-005",
    domain: "헬스케어",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "신규 헬스케어 SaaS 환자 대시보드",
    domainHits: 107,
    otherDomainHits: 0,
    validationStatus: "passed-with-review",
    timestamp: "2026-05-27T11:30:00+09:00",
  },
  {
    runId: "run-006",
    domain: "이커머스",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "패션 이커머스 모바일 앱 리디자인",
    domainHits: 108,
    otherDomainHits: 2,
    validationStatus: "passed-with-review",
    timestamp: "2026-05-27T10:18:00+09:00",
  },
  {
    runId: "run-007",
    domain: "핀테크",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "핀테크 신규 KYC + 송금",
    domainHits: 95,
    otherDomainHits: 3,
    validationStatus: "needs-review",
    timestamp: "2026-05-27T09:45:00+09:00",
  },
  {
    runId: "run-008",
    domain: "어드민",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "엔터프라이즈 어드민 리디자인",
    domainHits: 66,
    otherDomainHits: 1,
    validationStatus: "passed-with-review",
    timestamp: "2026-05-26T17:22:00+09:00",
  },
  {
    runId: "run-009",
    domain: "unknown",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "디자인해줘",
    domainHits: 0,
    otherDomainHits: 0,
    validationStatus: "failed",
    timestamp: "2026-05-26T14:05:00+09:00",
  },
  {
    runId: "run-010",
    domain: "헬스케어",
    workUnit: "ux-ui-planning-workunit",
    promptSnippet: "헬스케어 의료진 전용 진료 기록 화면",
    domainHits: 134,
    otherDomainHits: 0,
    validationStatus: "passed",
    timestamp: "2026-05-26T11:08:00+09:00",
  },
];
