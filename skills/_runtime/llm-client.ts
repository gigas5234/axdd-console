/**
 * 최소 LLM 클라이언트. fetch만 사용 — Anthropic SDK 의존성 없이 동작.
 * 진짜 SDK가 필요해지면 이 파일만 교체하면 된다.
 *
 * 환경변수:
 *   ANTHROPIC_API_KEY — 있으면 진짜 호출, 없으면 isLlmAvailable() = false
 *   ANTHROPIC_API_URL — 기본값 https://api.anthropic.com/v1/messages
 */

import type { SkillPromptTemplate, SkillRunInput } from "./types";

export function isLlmAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

export async function callLlm(
  template: SkillPromptTemplate,
  input: SkillRunInput,
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number; model: string } }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY가 설정돼 있지 않습니다. mock 모드로 폴백하세요.");
  }
  const url =
    process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1/messages";
  const model = template.model ?? DEFAULT_MODEL;
  const maxTokens = template.maxTokens ?? 2048;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: template.system,
      messages: [
        {
          role: "user",
          content: template.buildUser(input),
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic ${res.status}: ${body.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text?: string }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const text = data.content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("");

  return {
    text,
    usage: {
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
      model,
    },
  };
}
