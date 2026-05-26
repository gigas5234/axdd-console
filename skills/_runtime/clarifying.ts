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
    question: "어떤 도메인의 제품인가요?",
    priority: 1,
    options: [
      { value: "헬스케어 SaaS", label: "헬스케어" },
      { value: "이커머스", label: "이커머스" },
      { value: "핀테크", label: "핀테크" },
      { value: "엔터프라이즈 어드민", label: "어드민/B2B" },
      { value: "교육 LMS", label: "교육" },
    ],
  },
  tone: {
    field: "tone",
    question: "어떤 톤·무드를 원하세요?",
    priority: 2,
    options: [
      { value: "엔터프라이즈, 차분", label: "엔터프라이즈" },
      { value: "MZ타겟, 인스타그램스러운", label: "MZ" },
      { value: "미니멀, 깔끔", label: "미니멀" },
      { value: "전문성·신뢰", label: "전문성" },
    ],
  },
  platform: {
    field: "platform",
    question: "어떤 플랫폼 우선인가요?",
    priority: 3,
    options: [
      { value: "데스크탑 우선", label: "데스크탑" },
      { value: "모바일 우선", label: "모바일" },
      { value: "데스크탑·모바일 모두", label: "반응형 둘 다" },
    ],
  },
  "target-persona": {
    field: "target-persona",
    question: "주요 타겟 사용자는?",
    priority: 4,
    options: [
      { value: "20-30대 일반 사용자", label: "MZ 일반" },
      { value: "40대 이상 전문가/관리자", label: "시니어 전문가" },
      { value: "다양한 연령대", label: "범용" },
    ],
  },
  "existing-design-system": {
    field: "existing-design-system",
    question: "기존 디자인 시스템이 있나요?",
    priority: 5,
    options: [
      { value: "기존 디자인 시스템 있음 (확장)", label: "있음" },
      { value: "처음부터 새로 정의", label: "없음" },
      { value: "기존 시스템 있지만 리뉴얼", label: "리뉴얼 중" },
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
      { value: "Figma 핸드오프 풀세트", label: "풀세트" },
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
