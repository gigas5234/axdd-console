/**
 * LLM 기반 Hook 라우터 — 현재는 비활성 스텁.
 *
 * ANTHROPIC_API_KEY가 도입되면 이 클래스를 구현해 lib/hook-router/index.ts의
 * activeRouter를 LlmHookRouter로 교체한다.
 *
 * ─── 구현 가이드 ─────────────────────────────────────────────────
 *
 * 1. 등록된 Work Unit 메타데이터를 prompt에 포함:
 *    const menu = workUnits.map(w => `- ${w.id}: ${w.description}`).join("\n");
 *
 * 2. Haiku에 분류 요청 (skills/_runtime/llm-client.ts의 callLlm 재사용):
 *    system: `
 *      등록된 Work Unit 중 사용자 입력에 가장 적합한 후보 top-3를
 *      confidence(0~1)와 함께 JSON 배열로만 답하시오.
 *      Work Units:
 *      ${menu}
 *    `
 *    user: prompt
 *
 * 3. 응답을 HookMatch[]로 파싱:
 *    [{ workUnitId, confidence, reason }, ...]
 *
 * 4. data/hooks.json의 hook은 그대로 두되, 매칭 로직은 더 이상 keywords에
 *    의존하지 않는다. Hook의 역할은 "이 워크유닛이 라우팅 가능함" 마커.
 *
 * 5. 환경변수로 라우터 선택:
 *    process.env.HOOK_ROUTER === "llm" → LlmHookRouter
 *    else                              → KeywordHookRouter
 *
 * ────────────────────────────────────────────────────────────────
 */

import type { HookRouter, HookMatch } from "./types";

export class LlmHookRouter implements HookRouter {
  name = "llm" as const;

  async route(_prompt: string): Promise<HookMatch[]> {
    // TODO: ANTHROPIC_API_KEY 받은 뒤 구현.
    // 위 가이드 참조.
    throw new Error(
      "LlmHookRouter is not implemented. See lib/hook-router/llm-router.ts comments.",
    );
  }
}
