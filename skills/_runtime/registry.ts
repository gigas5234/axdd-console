/**
 * Skill Registry — id → SkillRunner 매핑.
 *
 * 새 스킬을 추가할 때:
 *   1. skills/<category>/<skill-id>/ 폴더 만들기
 *   2. SKILL.md / prompt.ts / runner.ts 작성
 *   3. 이 파일에 import + registry 등록
 *
 * `run(skillId, input)`이 하나의 진입점이다.
 */

import type { SkillRunner, SkillRunInput, SkillRunOutput } from "./types";

// 8개 카테고리 × 최소 1개씩
import simpleSummary from "../simple/simple-summary-skill/runner";
import designSystemReference from "../reference/design-system-reference-skill/runner";
import kickoffReportTemplate from "../template/kickoff-report-template-skill/runner";
import htmlMilestoneGenerator from "../script/html-milestone-generator-skill/runner";
import uxProcessAsset from "../asset/ux-process-asset-skill/runner";
import uxUiHandoffFullstep from "../fullstep/ux-ui-handoff-fullstep-skill/runner";
import assetMetadataSearch from "../metadata/asset-metadata-search-skill/runner";
import outputValidation from "../test/output-validation-skill/runner";

const RUNNERS: SkillRunner[] = [
  simpleSummary,
  designSystemReference,
  kickoffReportTemplate,
  htmlMilestoneGenerator,
  uxProcessAsset,
  uxUiHandoffFullstep,
  assetMetadataSearch,
  outputValidation,
];

const REGISTRY: Record<string, SkillRunner> = Object.fromEntries(
  RUNNERS.map((r) => [r.id, r]),
);

export function getSkillRunner(id: string): SkillRunner | null {
  return REGISTRY[id] ?? null;
}

export function listSkillRunners(): SkillRunner[] {
  return RUNNERS;
}

export async function runSkill(
  id: string,
  input: SkillRunInput,
): Promise<SkillRunOutput> {
  const runner = getSkillRunner(id);
  if (!runner) {
    throw new Error(`Skill not registered: ${id}`);
  }
  const start = Date.now();
  const out = await runner.run(input);
  return { ...out, durationMs: Date.now() - start };
}
