/**
 * MOCK: 워크유닛별 가짜 검증 결과.
 *
 * 두 종류 검증을 한다:
 *   1. **정적 룰** (섹션 존재, 표 구조 등) — 기존
 *   2. **의미 룰** (도메인 fit) — 신규
 *
 * 의미 검증은 산출물에 사용자 요청 도메인 키워드가 충분히 등장하는지,
 * 다른 도메인이 누출되지 않는지를 확인한다.
 *
 * ⚠️ LLM 교체 시: runMockValidation을 /api/run 응답의 validation 필드로 대체.
 *    domain-fit 자체 검증은 항상 유지 (LLM이 헛소리해도 잡아내는 안전망).
 *
 * @see mocks/README.md
 */

import { countDomainKeywords } from "@/skills/_runtime/domain-profiles";
import type { Domain } from "@/skills/_runtime/intent";

export type MockValidationItem = {
  ok: boolean;
  message: string;
  severity?: "info" | "warning" | "error";
};

/**
 * Validation 상태 — 4단계.
 *
 * - `passed`               : 모든 검증 OK + 휴먼 리뷰 불필요 (이론적, 드뭄)
 * - `passed-with-review`   : 자동 검증 모두 OK, 휴먼 리뷰만 남음 ← 운영 콘솔의 기본 OK 상태
 * - `needs-review`         : warning 항목 존재 (도메인 누출 등) — 의미적 점검 필요
 * - `failed`               : error 항목 존재 (필수 섹션 없음, 도메인 키워드 부족 등)
 *
 * passed_with_review를 분리한 이유:
 * - 이전엔 status=passed 그러나 reviewRequired=true 라는 모순이 있었음
 * - 휴먼 리뷰 게이트가 명시적으로 status에 반영되어야 운영 콘솔에서 올바르게 큐잉됨
 */
export interface MockValidationReport {
  status:
    | "passed"
    | "passed-with-review"
    | "needs-review"
    | "failed"
    | "pending";
  items: MockValidationItem[];
  validatedBy: string;
  /** 휴먼 리뷰 필수 여부 — UI 가시화용 (status가 passed-with-review|needs-review|failed면 자동 true) */
  reviewRequired?: boolean;
  /** 도메인 fit 메타 정보 — UI 표시용 */
  domainFit?: {
    domain: Domain;
    domainHits: number;
    otherDomainHits: number;
    leakedDomains: string[];
  };
}

/* ────────────────────────────────────────────────────────────
 * 정적 룰 (의미 무관)
 * ──────────────────────────────────────────────────────────── */

const BASE_BY_WORK_UNIT: Record<string, MockValidationItem[]> = {
  "ux-ui-planning-workunit": [
    { ok: true, message: "10개 H2 섹션 모두 존재", severity: "info" },
    { ok: true, message: "디자인 토큰 표 (color/typography/spacing/radius) 검증", severity: "info" },
    { ok: true, message: "도메인 특화 컴포넌트 3종 이상", severity: "info" },
    { ok: true, message: "Sample Screen 3개 이상", severity: "info" },
    { ok: true, message: "Interaction & Motion 표 5행 이상", severity: "info" },
    { ok: true, message: "WCAG 2.1 AA 체크리스트 10항목 이상", severity: "info" },
    { ok: true, message: "QA Matrix 브라우저 × breakpoint 매트릭스", severity: "info" },
    { ok: true, message: "Figma AI Prompt 코드블록 존재", severity: "info" },
  ],
  "kickoff-report-workunit": [
    { ok: true, message: "5개 표준 섹션 모두 존재" },
    { ok: true, message: "이해관계자 표 구조 검증" },
    { ok: true, message: "일정·마일스톤 표 존재" },
  ],
  "cicd-setup-workunit": [
    { ok: true, message: "GitHub Actions / Vercel 섹션 존재" },
    { ok: true, message: "릴리즈 체크리스트 형식 (체크박스 list)" },
  ],
};

const DEFAULT_BASE: MockValidationItem[] = [
  { ok: true, message: "필수 섹션 존재" },
  { ok: true, message: "템플릿 구조 준수" },
];

/* ────────────────────────────────────────────────────────────
 * 의미 룰 (domain fit)
 * ──────────────────────────────────────────────────────────── */

const DOMAIN_HIT_THRESHOLD = 5;
const OTHER_DOMAIN_LEAK_THRESHOLD = 3;

function buildDomainFitItems(
  domain: Domain | undefined,
  outputText: string,
): { items: MockValidationItem[]; fit: MockValidationReport["domainFit"] } {
  if (!domain || domain === "unknown" || domain === "generic") {
    return {
      items: [
        {
          ok: false,
          message: "⚠️ AXDD 컨텍스트(Case A/B/C/D)가 미확정 — 휴먼 리뷰 필요",
          severity: "warning",
        },
      ],
      fit: undefined,
    };
  }

  // 다른 AXDD 컨텍스트들과 누출 비교 (외부 산업 X)
  const otherContexts: Domain[] = (
    ["axdd-internal", "customer-project", "ds-bootstrap"] as Domain[]
  ).filter((d) => d !== domain);

  const { targetHits, otherHits, detail } = countDomainKeywords(
    outputText,
    domain,
    otherContexts,
  );

  const items: MockValidationItem[] = [];

  // 1. AXDD 컨텍스트 키워드 충분 등장
  items.push({
    ok: targetHits >= DOMAIN_HIT_THRESHOLD,
    message: `AXDD ${domain} 컨텍스트 키워드 ${targetHits}회 등장 (기준 ≥ ${DOMAIN_HIT_THRESHOLD}회)`,
    severity: targetHits >= DOMAIN_HIT_THRESHOLD ? "info" : "error",
  });

  // 2. 다른 AXDD 컨텍스트 누출 적음
  items.push({
    ok: otherHits <= OTHER_DOMAIN_LEAK_THRESHOLD,
    message:
      otherHits === 0
        ? "다른 AXDD 컨텍스트 누출 없음"
        : `다른 컨텍스트 키워드 ${otherHits}회 등장 (기준 ≤ ${OTHER_DOMAIN_LEAK_THRESHOLD}회) — ${Object.entries(
            detail,
          )
            .map(([d, c]) => `${d}:${c}`)
            .join(", ")}`,
    severity: otherHits <= OTHER_DOMAIN_LEAK_THRESHOLD ? "info" : "warning",
  });

  // 3. 외부 산업 누출 검사 (헬스케어/핀테크/이커머스 같은 단어)
  const FORBIDDEN_INDUSTRY_WORDS = [
    /환자/g,
    /송금자|kyc/gi,
    /mz쇼퍼|패션 *이커머스/gi,
    /헬스케어|핀테크|이커머스/gi,
  ];
  let industryLeak = 0;
  for (const re of FORBIDDEN_INDUSTRY_WORDS) {
    const m = outputText.match(re);
    if (m) industryLeak += m.length;
  }
  items.push({
    ok: industryLeak === 0,
    message:
      industryLeak === 0
        ? "외부 산업(헬스케어/핀테크/이커머스 등) 누출 없음"
        : `⚠️ 외부 산업 단어 ${industryLeak}회 — AXDD 내부 컨텍스트 위반`,
    severity: industryLeak === 0 ? "info" : "warning",
  });

  return {
    items,
    fit: {
      domain,
      domainHits: targetHits,
      otherDomainHits: otherHits + industryLeak,
      leakedDomains: Object.keys(detail).filter((k) => detail[k] > 0),
    },
  };
}

/* ────────────────────────────────────────────────────────────
 * 공개 API
 * ──────────────────────────────────────────────────────────── */

export function runMockValidation(
  workUnitId?: string,
  outputText?: string,
  domain?: Domain,
): MockValidationReport {
  const baseItems = workUnitId
    ? (BASE_BY_WORK_UNIT[workUnitId] ?? DEFAULT_BASE)
    : DEFAULT_BASE;

  const { items: domainFitItems, fit } =
    outputText !== undefined
      ? buildDomainFitItems(domain, outputText)
      : { items: [], fit: undefined };

  // 휴먼 리뷰 항목은 항상 마지막
  const humanReview: MockValidationItem = {
    ok: false,
    message: "휴먼 리뷰: 도메인 톤·정확성 최종 확인 필요",
    severity: "info",
  };

  const allItems = [...baseItems, ...domainFitItems, humanReview];

  // 4단계 상태 결정
  const hasError = allItems.some(
    (i) => i.severity === "error" && !i.ok,
  );
  const hasWarning = allItems.some(
    (i) => i.severity === "warning" && !i.ok,
  );
  // info severity의 미해결 항목 (보통 humanReview)
  const hasUnresolvedInfo = allItems.some(
    (i) => (i.severity === "info" || !i.severity) && !i.ok,
  );

  let status: MockValidationReport["status"];
  if (hasError) status = "failed";
  else if (hasWarning) status = "needs-review";
  else if (hasUnresolvedInfo) status = "passed-with-review";
  else status = "passed";

  return {
    status,
    reviewRequired: status !== "passed",
    validatedBy: "output-validation-skill",
    items: allItems,
    domainFit: fit,
  };
}
