/**
 * MOCK: Governance 페이지 Risk Log용 정적 데이터.
 * 실제 운영 시 Notion/Linear/자체 DB 등에서 가져오도록 교체.
 *
 * @see mocks/README.md
 */

export type RiskImpact = "high" | "medium" | "low";

export interface RiskItem {
  title: string;
  impact: RiskImpact;
  mitigation: string;
}

export const MOCK_RISKS: RiskItem[] = [
  {
    title: "Figma MCP 보안정책 차단",
    impact: "high",
    mitigation: "AI 프롬프트 추출 폴백 운영 중",
  },
  {
    title: "8개 스킬 카테고리 데이터 부족",
    impact: "medium",
    mitigation: "카테고리별 최소 3개 샘플 확보",
  },
  {
    title: "Validation 자동화 미완",
    impact: "medium",
    mitigation: "output-validation-skill로 1차 자동화",
  },
];

export const RISK_TONE: Record<RiskImpact, string> = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
