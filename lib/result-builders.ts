/**
 * 실행 결과 → 마크다운 빌더.
 *
 * 클라이언트(result-export.ts)와 서버(workunit-bundle.ts) 양쪽에서 사용.
 * 모든 함수는 pure (string in, string out).
 */

import type { WorkUnit } from "./types";
import type { MockValidationReport } from "@/mocks/validation";
import type { RunIntent } from "@/skills/_runtime/intent";

export interface ResultPayload {
  workUnit: WorkUnit;
  prompt: string;
  mode: "llm" | "mock" | null;
  output: string;
  validation: MockValidationReport;
  intent?: RunIntent | null;
  figmaPrompt?: string;
}

export function buildResultReadme(input: ResultPayload): string {
  const { workUnit, prompt, mode, validation, intent } = input;
  const ts = new Date().toISOString();
  const lines: (string | null)[] = [
    `# 실행 결과 — ${workUnit.name}`,
    "",
    `- **Work Unit**: \`${workUnit.id}\``,
    `- **실행 시각**: ${ts}`,
    `- **실행 모드**: ${mode === "llm" ? "LLM (실제 호출)" : "Mock (LLM 키 없음)"}`,
    `- **검증 결과**: ${validation.status}`,
    intent
      ? `- **추출된 도메인**: ${intent.domain} (신뢰도 ${Math.round(intent.confidence * 100)}%)`
      : null,
    intent ? `- **톤**: ${intent.tone}` : null,
    "",
    `## 프롬프트`,
    "```",
    prompt,
    "```",
    "",
    intent && intent.unknowns.length > 0
      ? `## ⚠️ 누락 정보\n사용자 프롬프트에 명시되지 않은 항목 (산출물에 TBD로 채워짐):\n${intent.unknowns.map((u) => `- ${u}`).join("\n")}\n`
      : null,
    `## 산출물 목록`,
    ...workUnit.output.map((o) => `- \`${o}\``),
    "",
    `## 실행된 스킬`,
    ...workUnit.skills.map((s) => `- \`${s}\``),
    "",
    `## 검증 항목 (${validation.items.length}개)`,
    ...validation.items.map(
      (i) =>
        `- [${i.ok ? "x" : " "}]${i.severity ? ` *[${i.severity}]*` : ""} ${i.message}`,
    ),
    "",
    "---",
    `생성 출처: AXDD SkillOps Console`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function buildIntentMd(
  intent: RunIntent | null | undefined,
): string | null {
  if (!intent) return null;
  const scopeKeys = (
    Object.keys(intent.scope) as Array<keyof typeof intent.scope>
  ).filter((k) => intent.scope[k]);
  return [
    `# Intent 분석 결과`,
    "",
    `> 원본 프롬프트: "${intent.rawPrompt}"`,
    "",
    `## 분류`,
    `- **도메인**: ${intent.domain}`,
    `- **톤**: ${intent.tone}`,
    `- **신뢰도**: ${Math.round(intent.confidence * 100)}%`,
    `- **추출 모드**: ${intent.mode}`,
    "",
    `## 감지된 작업 범위 (${scopeKeys.length}개)`,
    ...(scopeKeys.length === 0
      ? ["(범위 명시 안 됨)"]
      : scopeKeys.map((k) => `- ${k}`)),
    "",
    `## 누락 정보 (${intent.unknowns.length}개)`,
    intent.unknowns.length === 0
      ? "없음 — 사용자가 충분한 정보 제공"
      : intent.unknowns.map((u) => `- ${u}`).join("\n"),
    "",
    `## 활용`,
    `이 intent 객체는 파이프라인의 모든 스킬에 전달됨. 각 스킬은 \`input.context.intent\`를 읽어 도메인 적합한 출력 생성.`,
    "",
    `## LLM 교체 시`,
    `현재는 휴리스틱 추출. ANTHROPIC_API_KEY 도입 시 \`skills/_runtime/intent.ts\`의 \`extractIntent\`가 LLM 호출로 자동 전환됨.`,
  ].join("\n");
}

export function buildValidationMd(v: MockValidationReport): string {
  const lines: string[] = [
    `# Validation Report`,
    "",
    `- **Status**: ${v.status}`,
    `- **Validated by**: \`${v.validatedBy}\``,
    "",
  ];

  lines.push(`## Items (${v.items.length})`);
  for (const i of v.items) {
    const icon = i.ok ? "x" : " ";
    const sev = i.severity ? ` *[${i.severity}]*` : "";
    lines.push(`- [${icon}]${sev} ${i.message}`);
  }
  return lines.join("\n");
}

export function buildManifest(input: ResultPayload) {
  return {
    workUnit: {
      id: input.workUnit.id,
      name: input.workUnit.name,
      skills: input.workUnit.skills,
      outputs: input.workUnit.output,
    },
    prompt: input.prompt,
    mode: input.mode,
    intent: input.intent
      ? {
          domain: input.intent.domain,
          tone: input.intent.tone,
          scope: input.intent.scope,
          unknowns: input.intent.unknowns,
          confidence: input.intent.confidence,
          mode: input.intent.mode,
        }
      : null,
    validation: input.validation,
    timestamp: new Date().toISOString(),
    generatedBy: "AXDD SkillOps Console",
  };
}
