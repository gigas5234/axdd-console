/**
 * Clarifying Question Catalog — 사용자에게 추가 정보를 받기 위한 질문 카탈로그.
 *
 * 설계 원칙:
 *   · 정적 매핑 (LLM 호출 없음)
 *   · 디자이너가 카피를 미리 검수 가능
 *   · 같은 unknowns → 항상 같은 질문 (결정적)
 *   · 한 번에 최대 3개만 노출 (사용자 피로 방지)
 */

import type { UnknownField, RunIntent } from "./intent";

export interface ClarifyingQuestion {
  field: UnknownField;
  question: string;
  /** 빠른 선택 옵션 (사용자가 input 안 치고 클릭만 해도 됨) */
  options: { value: string; label: string }[];
  /** 우선순위 — 낮을수록 먼저 노출 */
  priority: number;
}

const CATALOG: Record<UnknownField, ClarifyingQuestion> = {
  domain: {
    field: "domain",
    question: "어떤 컨텍스트의 작업인가요? (AXDD 4-Case)",
    priority: 1,
    options: [
      { value: "AXDD 사내 자체 자산 만들기 (Case B)", label: "AXDD 내부" },
      { value: "외부 고객사 프로젝트 (Case C)", label: "고객사" },
      { value: "AXDD 자체 디자인 시스템 초안 만들기 (Case A)", label: "DS Bootstrap" },
      { value: "요구사항부터 정리 (Case D)", label: "요구사항만" },
    ],
  },
  tone: {
    field: "tone",
    question: "어떤 톤·무드를 원하세요?",
    priority: 2,
    options: [
      { value: "엔터프라이즈, 차분", label: "엔터프라이즈" },
      { value: "효율·운영 (어드민·내부 툴)", label: "효율" },
      { value: "미니멀, 깔끔", label: "미니멀" },
      { value: "전문성·신뢰", label: "전문성" },
    ],
  },
  platform: {
    field: "platform",
    question: "어떤 플랫폼 우선인가요?",
    priority: 3,
    options: [
      { value: "데스크탑 우선 (사내 어드민·툴)", label: "데스크탑" },
      { value: "모바일 우선", label: "모바일" },
      { value: "데스크탑·모바일 모두", label: "반응형 둘 다" },
    ],
  },
  "target-persona": {
    field: "target-persona",
    question: "주요 타겟 사용자는?",
    priority: 4,
    options: [
      { value: "사내 디자이너·프론트엔드·PM", label: "사내 팀" },
      { value: "DS 컨트리뷰터·Design Lead", label: "DS 팀" },
      { value: "고객사 의사결정자·AXDD 프로젝트 리드", label: "고객사 프로젝트" },
    ],
  },
  "existing-design-system": {
    field: "existing-design-system",
    question: "AXDD 디자인 시스템 상태는?",
    priority: 5,
    options: [
      { value: "AXDD DS 있음 (확장·차용)", label: "있음" },
      { value: "AXDD DS 없음 — 새로 정의 (Bootstrap)", label: "없음" },
      { value: "고객사 DS 입력 예정 — AXDD DS는 폴백", label: "고객사 DS 우선" },
    ],
  },
  timeline: {
    field: "timeline",
    question: "일정은 얼마나 되나요?",
    priority: 6,
    options: [
      { value: "2주 이내", label: "2주" },
      { value: "1개월", label: "1개월" },
      { value: "2~3개월", label: "2-3개월" },
      { value: "유동적", label: "유동적" },
    ],
  },
  "team-size": {
    field: "team-size",
    question: "팀 규모는?",
    priority: 7,
    options: [
      { value: "1~2명", label: "1-2명" },
      { value: "3~5명", label: "3-5명" },
      { value: "6명 이상", label: "6명+" },
    ],
  },
  "scope-specifics": {
    field: "scope-specifics",
    question: "어디까지 만들어야 하나요?",
    priority: 8,
    options: [
      { value: "UX 흐름 + IA만", label: "기획만" },
      { value: "디자인 파운데이션 + 컴포넌트", label: "디자인 시스템" },
      { value: "Figma 핸드오프 풀세트 (UI + UX 트랙 모두)", label: "풀세트" },
      { value: "AXDD DS 부트스트랩 (Case A)", label: "DS Bootstrap" },
    ],
  },
};

/**
 * Intent를 받아 어떤 질문을 사용자에게 던질지 결정.
 * 우선순위 + 최대 3개 제한.
 */
export function getClarifyingQuestions(intent: RunIntent): ClarifyingQuestion[] {
  if (intent.confidence >= 0.7) return []; // 충분히 확실하면 묻지 않음

  return intent.unknowns
    .map((u) => CATALOG[u])
    .filter(Boolean)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
}

/**
 * 사용자가 clarifying 답변을 선택하면 그것을 prompt에 합쳐 새 prompt 생성.
 */
export function applyClarifyingAnswers(
  originalPrompt: string,
  answers: Record<UnknownField, string>,
): string {
  const parts = [originalPrompt.trim()];
  const extras = Object.values(answers).filter(Boolean);
  if (extras.length > 0) {
    parts.push("\n[추가 정보]");
    parts.push(...extras.map((a) => `- ${a}`));
  }
  return parts.join("\n");
}
