/**
 * MOCK: Governance 페이지 Decision Log용 정적 데이터.
 * 실제 운영 시 Notion/Linear/Confluence/자체 DB 등으로 교체.
 *
 * @see mocks/README.md
 */

export interface DecisionItem {
  date: string;
  title: string;
  who: string;
}

export const MOCK_DECISIONS: DecisionItem[] = [
  {
    date: "2026-05-27",
    title: "디자인 톤 = 엔터프라이즈 + 절제된 글래스모피즘으로 확정",
    who: "Product Design / Operations",
  },
  {
    date: "2026-05-26",
    title: "Figma 연동은 MCP + AI 프롬프트 듀얼 트랙 운영",
    who: "Engineering",
  },
  {
    date: "2026-05-25",
    title: "MVP 페이지 7개 모두 우선 구현 (Skill Library가 1순위)",
    who: "Operations",
  },
];
