/**
 * Skill Runtime — 8개 카테고리 모든 스킬이 공유하는 실행 계약(contract).
 *
 * 각 스킬은 자기 폴더에 `runner.ts`를 두고 default export로
 * `SkillRunner`를 구현한다. 개발자가 코드를 끼우는 곳은 두 곳:
 *   1. `prompt.ts` — LLM에 보낼 system/user 프롬프트 템플릿
 *   2. `runner.ts` — 실행 로직 (LLM 호출, 스크립트 실행, 템플릿 fill 등)
 *
 * Runtime이 키 없이 돌면 mock-runner.ts가 sample-outputs를 반환한다.
 */

import type { RunIntent } from "./intent";

/**
 * SkillCategory — _runtime 안에 self-contained로 정의.
 * (Bundle export 시 외부 alias 의존성 없도록)
 */
export type SkillCategory =
  | "simple"
  | "reference"
  | "template"
  | "script"
  | "asset"
  | "fullstep"
  | "metadata"
  | "test";

export interface SkillRunInput {
  /** Raw user prompt (Sandbox에서 입력한 문자열) */
  prompt: string;
  /** 직전 스킬의 output, 또는 사용자 업로드 자료 */
  inputs?: Record<string, string>;
  /**
   * Pipeline context — 모든 스킬이 공유.
   * 가장 중요한 필드는 `intent`. API route에서 1회 추출 후 모든 스킬에 주입한다.
   */
  context?: {
    intent?: RunIntent;
    [key: string]: unknown;
  };
}

export interface SkillRunOutput {
  /** 산출물 마크다운 (대부분 스킬의 주요 결과물) */
  markdown: string;
  /** 추가 산출물 (filename → content) */
  files?: Record<string, string>;
  /** LLM 사용 시 토큰/비용 정보 */
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    costUsd?: number;
    model?: string;
  };
  /** 실행에 걸린 시간 (ms) */
  durationMs?: number;
  /** 실행 모드 — 진짜 LLM인지 mock fallback인지 명확히 표시 */
  mode: "llm" | "mock" | "script" | "template";
}

export interface SkillRunner {
  /** 스킬 식별자 — data/skills.catalog.json의 id와 일치해야 함 */
  id: string;
  category: SkillCategory;
  /** 핵심 실행 함수. 슬롯의 진입점. */
  run(input: SkillRunInput): Promise<SkillRunOutput>;
}

export interface SkillPromptTemplate {
  /** Claude/GPT의 system prompt */
  system: string;
  /** user 메시지 빌더. input을 받아 user content를 반환. */
  buildUser(input: SkillRunInput): string;
  /** 권장 모델 (스킬별로 가벼운/무거운 모델 선택 가능) */
  model?: "claude-haiku-4-5-20251001" | "claude-sonnet-4-6" | "claude-opus-4-7";
  /** max_tokens */
  maxTokens?: number;
}
