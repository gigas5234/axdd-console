/**
 * 키워드 기반 Hook 라우터.
 *
 * data/hooks.json의 keywords 배열을 lowercase로 비교한다.
 * 매칭된 키워드 길이를 confidence로 환산해 우선순위를 정한다 —
 * "UX 기획"(5자)보다 "디자인 파운데이션"(9자)이 더 명확한 의도라는 가정.
 *
 * LLM 라우터로 교체할 때 이 파일은 그대로 두고 lib/hook-router/index.ts의
 * activeRouter만 LlmHookRouter로 바꾸면 된다.
 */

import { hooks } from "@/lib/data";
import type { HookRouter, HookMatch } from "./types";

const MIN_CONFIDENCE = 0.5;
const MAX_CONFIDENCE = 0.95;

function confidenceFor(keywordLength: number): number {
  // 짧은 키워드는 confidence 낮게, 긴 키워드일수록 높게 (의도가 더 명확).
  const score = MIN_CONFIDENCE + keywordLength / 30;
  return Math.min(MAX_CONFIDENCE, Math.max(MIN_CONFIDENCE, score));
}

export class KeywordHookRouter implements HookRouter {
  name = "keyword" as const;

  async route(prompt: string): Promise<HookMatch[]> {
    const p = prompt.trim().toLowerCase();
    if (!p) return [];

    const matches: HookMatch[] = [];

    for (const h of hooks) {
      if (!h.enabled) continue;

      // 모든 매칭 키워드 중 가장 긴 것을 대표로 채택
      const matchedKeywords = h.conditions.keywords.filter((k) =>
        p.includes(k.toLowerCase()),
      );
      if (matchedKeywords.length === 0) continue;

      const longest = matchedKeywords.reduce((a, b) =>
        b.length > a.length ? b : a,
      );

      matches.push({
        hookId: h.id,
        workUnitId: h.targetWorkUnit,
        confidence: confidenceFor(longest.length),
        reason: `키워드 "${longest}" 매칭`,
        matchedKeyword: longest,
      });
    }

    // confidence 높은 순서대로 정렬
    return matches.sort((a, b) => b.confidence - a.confidence);
  }
}
