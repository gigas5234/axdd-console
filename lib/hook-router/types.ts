/**
 * Hook Router — 사용자 입력을 어떤 Work Unit으로 보낼지 결정하는 계층.
 *
 * 두 가지 구현이 공존한다:
 *   - KeywordHookRouter (현재 활성) — data/hooks.json의 키워드 매칭
 *   - LlmHookRouter (스텁)        — Claude Haiku 분류기. ANTHROPIC_API_KEY 도입 후 활성
 *
 * 라우팅 결과는 confidence 점수와 함께 top-N 후보를 반환한다.
 * UI는 신뢰도가 낮으면 사용자 확인을 받을 수 있다.
 */

export interface HookMatch {
  hookId: string;
  workUnitId: string;
  /** 0~1. 임계값(보통 0.7) 미만이면 "확실하지 않음"으로 표시. */
  confidence: number;
  /** UI에 표시할 매칭 근거. "키워드 X" 또는 "LLM 분류". */
  reason: string;
  /** 키워드 라우터 전용 — 매칭된 키워드 원본. */
  matchedKeyword?: string;
}

export interface HookRouter {
  /** 식별자 — UI에서 어떤 라우터가 동작하는지 표시. */
  name: "keyword" | "llm";
  /**
   * 입력을 받아 후보 목록을 반환한다.
   * 동기 구현(키워드)도 Promise로 감싸 시그니처를 통일한다.
   */
  route(prompt: string): Promise<HookMatch[]>;
}
