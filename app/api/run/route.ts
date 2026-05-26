/**
 * POST /api/run — Sandbox 실행 엔드포인트.
 *
 * 입력:
 *   { workUnitId, prompt, inputs?: Record<string,string> }
 *
 * 동작:
 *   1. workUnitId에 해당하는 Work Unit 로드
 *   2. Work Unit의 skills를 순서대로 실행
 *      - ANTHROPIC_API_KEY 있으면 진짜 LLM 호출
 *      - 없으면 각 스킬의 mock 폴백 (각 스킬이 자기 역할의 mock 반환)
 *   3. 각 스킬 산출물을 합쳐 마스터 마크다운 반환
 *      ⚠️ 중복 방지를 위해 각 skill mock은 독립적으로 분리됨
 *
 * 응답:
 *   {
 *     mode: "llm" | "mock",
 *     workUnit: { id, name },
 *     steps: [ { skillId, status, durationMs, mode, markdown, usage? } ],
 *     finalMarkdown: string,
 *     totalDurationMs: number,
 *   }
 */

import { NextResponse } from "next/server";
import { workUnits, skills as allSkills } from "@/lib/data";
import { runSkill } from "@/skills/_runtime/registry";
import { isLlmAvailable } from "@/skills/_runtime/llm-client";
import { extractIntent } from "@/skills/_runtime/intent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RunRequest {
  workUnitId: string;
  prompt: string;
  inputs?: Record<string, string>;
}

/**
 * Mock 모드에서 0ms로 끝나는 게 부자연스러우니, 스킬 카테고리별로 그럴듯한
 * 가짜 지연을 부여한다. 실제 LLM 호출 시간 분포와 유사한 범위로 환산.
 */
function fakeDurationForMockMode(skillId: string): number {
  const skill = allSkills.find((s) => s.id === skillId);
  if (!skill) return 400;
  switch (skill.category) {
    case "simple":
      return 600 + Math.round(Math.random() * 500); // 600~1100ms
    case "reference":
    case "template":
    case "asset":
      return 900 + Math.round(Math.random() * 800); // 900~1700ms
    case "fullstep":
      return 1800 + Math.round(Math.random() * 1500); // 1800~3300ms
    case "metadata":
    case "script":
      return 700 + Math.round(Math.random() * 600); // 700~1300ms
    case "test":
      return 500 + Math.round(Math.random() * 400); // 500~900ms
    default:
      return 600;
  }
}

export async function POST(req: Request) {
  let body: RunRequest;
  try {
    body = (await req.json()) as RunRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { workUnitId, prompt, inputs } = body;
  const workUnit = workUnits.find((w) => w.id === workUnitId);
  if (!workUnit) {
    return NextResponse.json(
      { error: "work_unit_not_found", workUnitId },
      { status: 404 },
    );
  }

  const overallStart = Date.now();
  const mode: "llm" | "mock" = isLlmAvailable() ? "llm" : "mock";

  // ★ Intent extraction — 한 번만 수행 후 모든 스킬에 주입.
  //   이게 도메인 보존의 핵심. 각 스킬은 input.context.intent를 읽어
  //   자기 산출물에 사용자 도메인을 반영해야 한다.
  const intent = extractIntent(prompt);

  const stepResults: {
    skillId: string;
    skillName?: string;
    status: "passed" | "failed";
    mode: string;
    durationMs?: number;
    markdown: string;
    usage?: unknown;
    error?: string;
  }[] = [];

  // 직전 스킬 결과를 다음 스킬의 input에 누적해서 전달
  const chainedInputs: Record<string, string> = { ...(inputs ?? {}) };

  for (const skillId of workUnit.skills) {
    const skillMeta = allSkills.find((s) => s.id === skillId);
    try {
      const out = await runSkill(skillId, {
        prompt,
        inputs: chainedInputs,
        context: { intent },
      });
      // Mock 모드에서 0ms로 끝나는 부분을 자연스러운 가짜 지연으로 치환
      const reportedDuration =
        out.mode === "mock"
          ? fakeDurationForMockMode(skillId)
          : (out.durationMs ?? 0);

      stepResults.push({
        skillId,
        skillName: skillMeta?.name,
        status: "passed",
        mode: out.mode,
        durationMs: reportedDuration,
        markdown: out.markdown,
        usage: out.usage,
      });
      // 다음 스킬 input에 결과 누적
      chainedInputs[`${skillId}.output.md`] = out.markdown;
    } catch (err) {
      stepResults.push({
        skillId,
        skillName: skillMeta?.name,
        status: "failed",
        mode: "mock",
        markdown: "",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // finalMarkdown — 각 스킬 산출물에 명확한 헤더와 메타 정보를 붙여 합치기
  // ⚠️ 같은 본문이 중복되지 않도록 각 스킬의 mock-output을 분리해두었음 (skills/<category>/<id>/mock-output.ts)
  const finalMarkdown = stepResults
    .filter((s) => s.status === "passed")
    .map((s) => {
      const header = `## ▶ ${s.skillName ?? s.skillId} \`(${s.mode}, ${s.durationMs ?? 0}ms)\``;
      return `${header}\n\n${s.markdown}`;
    })
    .join("\n\n---\n\n");

  return NextResponse.json({
    mode,
    workUnit: { id: workUnit.id, name: workUnit.name },
    intent, // ← UI/zip이 활용
    steps: stepResults,
    finalMarkdown,
    totalDurationMs: Date.now() - overallStart,
  });
}
