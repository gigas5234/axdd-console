/**
 * Phase 7 Cleanup: validation은 이제 Enterprise Export의 frontmatter 정합성 검사로 단순화.
 *
 * 이전 도메인 키워드 누출 검사는 폐기 (Phase 6 외부 산업 도메인 컨텍스트와 함께 삭제).
 * 진짜 validator는 reference의 axe_check.py — 이 모듈은 UI 표시용 mock validator일 뿐.
 */

export type MockValidationItem = {
  ok: boolean;
  message: string;
  severity?: "info" | "warning" | "error";
};

export interface MockValidationReport {
  status:
    | "passed"
    | "passed-with-review"
    | "needs-review"
    | "failed"
    | "pending";
  items: MockValidationItem[];
  validatedBy: string;
  reviewRequired?: boolean;
}

const BASE_BY_WORK_UNIT: Record<string, MockValidationItem[]> = {
  "ux-ui-planning-workunit": [
    { ok: true, message: "필수 SKILL.md frontmatter 존재", severity: "info" },
    { ok: true, message: "디렉토리명·name 일치", severity: "info" },
    { ok: true, message: "metadata 필드 모두 string", severity: "info" },
    { ok: true, message: "외부 URL 1차 정책 준수", severity: "info" },
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

/**
 * 공개 API — 간소화 버전.
 * 도메인 인자는 호환성을 위해 시그니처에 남기지만 사용하지 않음.
 */
export function runMockValidation(
  workUnitId?: string,
  _outputText?: string,
  _domain?: unknown,
): MockValidationReport {
  const baseItems = workUnitId
    ? (BASE_BY_WORK_UNIT[workUnitId] ?? DEFAULT_BASE)
    : DEFAULT_BASE;

  const humanReview: MockValidationItem = {
    ok: false,
    message:
      "휴먼 리뷰: Enterprise Export 후 axe_check.py validate-skill 통과 확인 필요",
    severity: "info",
  };

  const allItems = [...baseItems, humanReview];

  // 단순 4-state — info 미해결 1개 (휴먼 리뷰)만 있을 때 passed-with-review
  const hasError = allItems.some((i) => i.severity === "error" && !i.ok);
  const hasWarning = allItems.some((i) => i.severity === "warning" && !i.ok);
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
    items: allItems,
    validatedBy: "axdd-console (mock — 실제 검증은 axe_check.py)",
    reviewRequired: status !== "passed",
  };
}
