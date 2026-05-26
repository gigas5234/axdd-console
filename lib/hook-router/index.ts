/**
 * Hook Router 진입점.
 *
 * 라우팅 전략 (우선순위):
 *   1. KeywordHookRouter — data/hooks.json 키워드 매칭
 *   2. Intent-scope fallback — intent.scope에서 작업 시그널 감지 → 해당 워크유닛
 *   3. Domain fallback — 도메인이 명시되어 있으면 UX/UI 기본 워크유닛
 *
 * 이렇게 함으로써 사용자가 명시적 키워드("UX 기획", "kickoff" 등)를 안 써도,
 * clarifying 답변에서 도메인이나 작업 범위가 드러나면 자동 매칭된다.
 *
 * LLM 도입 시 LlmHookRouter로 교체하면 자연어 분류까지 가능.
 */

import { extractIntent } from "@/skills/_runtime/intent";
import { KeywordHookRouter } from "./keyword-router";
import { LlmHookRouter } from "./llm-router";
import type { HookRouter, HookMatch } from "./types";

export * from "./types";
export { KeywordHookRouter, LlmHookRouter };

/**
 * 활성 라우터 — LLM 도입 시 여기만 변경.
 */
export const activeRouter: HookRouter = new KeywordHookRouter();

/** 활성 라우터로 매칭 후보 전체 반환. */
export async function route(prompt: string): Promise<HookMatch[]> {
  return activeRouter.route(prompt);
}

/**
 * 가장 confident한 매칭 1개 반환. 키워드 실패 시 intent 기반 fallback 동작.
 *
 * 반환 우선순위:
 *   1. 키워드 매칭 (confidence ≥ threshold)
 *   2. intent.scope 기반 fallback (특정 작업 시그널 → 워크유닛)
 *   3. intent.domain 기반 fallback (도메인 명시 → UX/UI 기본)
 *   4. null (매칭 불가)
 */
export async function routeBest(
  prompt: string,
  threshold = 0.5,
): Promise<HookMatch | null> {
  // 1) 키워드 매칭 시도
  const candidates = await route(prompt);
  const top = candidates[0];
  if (top && top.confidence >= threshold) return top;

  // 2) Intent 기반 fallback
  const intent = extractIntent(prompt);

  // UX/UI 시그널 → ux-ui-planning-workunit
  const uxUiSignal =
    intent.scope.needsDesignSystem ||
    intent.scope.needsIA ||
    intent.scope.needsUserFlow ||
    intent.scope.needsComponentSpec ||
    intent.scope.needsHandoff;

  if (uxUiSignal) {
    return {
      hookId: "ux-ui-planning-hook",
      workUnitId: "ux-ui-planning-workunit",
      confidence: 0.65,
      reason: "intent.scope에서 UX/UI 신호 감지 (fallback)",
    };
  }

  if (intent.scope.needsKickoffReport) {
    return {
      hookId: "kickoff-report-hook",
      workUnitId: "kickoff-report-workunit",
      confidence: 0.65,
      reason: "intent.scope에서 Kickoff 신호 감지 (fallback)",
    };
  }

  if (intent.scope.needsCICD) {
    return {
      hookId: "cicd-setup-hook",
      workUnitId: "cicd-setup-workunit",
      confidence: 0.65,
      reason: "intent.scope에서 CI/CD 신호 감지 (fallback)",
    };
  }

  // 3) 도메인이 명시되어 있으면 UX/UI 기본 워크유닛으로 라우팅
  //    (대부분의 프로덕트 도메인 요청은 UX/UI 기획이 시작점)
  if (intent.domain !== "unknown") {
    return {
      hookId: "ux-ui-planning-hook",
      workUnitId: "ux-ui-planning-workunit",
      confidence: 0.55,
      reason: `도메인 "${intent.domain}" 감지 → UX/UI Planning 기본 매칭 (fallback)`,
    };
  }

  // 4) 매칭 불가
  return null;
}
