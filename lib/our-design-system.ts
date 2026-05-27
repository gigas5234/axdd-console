/**
 * AXDD Design System 카탈로그 상태 조회.
 *
 * `data/our-design-system.md`는 모든 UX/UI 스킬의 고정 자산.
 * 이 파일이 비어있거나 `__TODO__` 마커가 많이 남아 있으면
 * "스캐폴드" 상태로 간주하고 UI에 안내를 표시한다.
 */

export interface DesignSystemStatus {
  /** 'scaffold' | 'partial' | 'ready' */
  state: "scaffold" | "partial" | "ready";
  /** TODO 마커 개수 (낮을수록 채워진 정도가 높음) */
  todoCount: number;
  /** 토큰 / 컴포넌트 카운트 (TODO 제외 실제 값) */
  filledColorTokens: number;
  filledTypeTokens: number;
  filledComponents: number;
  /** 마지막 업데이트 (frontmatter에서 추출, 없으면 null) */
  lastUpdated: string | null;
  /** UI에 표시할 한 줄 라벨 */
  label: string;
  /** 어떤 케이스가 가능한지 */
  enables: {
    case_a_bootstrap: true; // Case A는 항상 가능
    case_b_axdd_internal: boolean; // AXDD DS ready여야 가능
    case_c_customer_project: boolean;
    case_d_requirement_only: true;
  };
}

const TODO_MARKER = /__TODO__|<!--\s*TODO/i;

/** raw 텍스트로 받는 버전 (테스트용) */
export function analyzeDsCatalog(text: string): DesignSystemStatus {
  const lines = text.split("\n");

  // TODO 마커 카운트
  const todoCount = lines.filter((l) => TODO_MARKER.test(l)).length;

  // Color 섹션 — `color/xxx` 행 중 hex가 채워진 것만 카운트
  const filledColorTokens = lines.filter((l) => {
    const m = l.match(/^\|\s*`color\/[^`]+`\s*\|\s*`(#[0-9a-fA-F]{3,8})`/);
    return !!m;
  }).length;

  // Typography 섹션 — text/xxx 토큰 중 값이 채워진 것
  const filledTypeTokens = lines.filter((l) => {
    const m = l.match(/^\|\s*`text\/[^`]+`\s*\|\s*`([^_`][^`]*)`/);
    return !!m && !TODO_MARKER.test(l);
  }).length;

  // Component — 6.1/6.2 섹션에서 (TODO)가 아닌 행
  const filledComponents = lines.filter((l) => {
    const m = l.match(/^\|\s*[A-Z][a-zA-Z]+\s*\|\s*([^()|]+)\s*\|/);
    return !!m && !/\(TODO\)/.test(l);
  }).length;

  // 상태 판정
  let state: DesignSystemStatus["state"] = "scaffold";
  if (filledColorTokens >= 8 && filledComponents >= 4) state = "ready";
  else if (filledColorTokens > 0 || filledComponents > 0) state = "partial";

  // lastUpdated
  const updatedLine = lines.find((l) => /마지막 업데이트/.test(l));
  const lastUpdated =
    updatedLine && !/미입력/.test(updatedLine)
      ? updatedLine.replace(/.*마지막 업데이트.*?:\s*/, "").trim()
      : null;

  const label =
    state === "ready"
      ? `AXDD DS 활성 · 토큰 ${filledColorTokens}/12 · 컴포넌트 ${filledComponents}`
      : state === "partial"
        ? `AXDD DS 부분 작성 · TODO ${todoCount}건 남음`
        : `AXDD DS 미정의 · DS Bootstrap 워크유닛으로 초안 생성 권장`;

  return {
    state,
    todoCount,
    filledColorTokens,
    filledTypeTokens,
    filledComponents,
    lastUpdated,
    label,
    enables: {
      case_a_bootstrap: true,
      case_b_axdd_internal: state === "ready" || state === "partial",
      case_c_customer_project: true, // 고객사 DS만 있어도 가능
      case_d_requirement_only: true,
    },
  };
}

/** 빈 상태 — 카드 초기 렌더링 시 */
export const EMPTY_DS_STATUS: DesignSystemStatus = {
  state: "scaffold",
  todoCount: 0,
  filledColorTokens: 0,
  filledTypeTokens: 0,
  filledComponents: 0,
  lastUpdated: null,
  label: "로딩 중…",
  enables: {
    case_a_bootstrap: true,
    case_b_axdd_internal: false,
    case_c_customer_project: true,
    case_d_requirement_only: true,
  },
};
