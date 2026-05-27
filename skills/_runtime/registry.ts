/**
 * Skill Registry — id → SkillRunner 매핑.
 *
 * Phase 5 (atomic skill 재구성) → Phase 7-G (DS ingest 추가) 완료 상태:
 *   - UX/UI 워크유닛: 11개 atomic skill로 분해됨 (design-system-ingest-skill 포함)
 *   - 다른 워크유닛: 기존 스킬 유지 (simple-summary, output-validation 등 공유)
 */

import type { SkillRunner, SkillRunInput, SkillRunOutput } from "./types";

// 공통 스킬
import simpleSummary from "../simple/simple-summary-skill/runner";
import outputValidation from "../test/output-validation-skill/runner";

// UX/UI Planning Workunit — 11개 atomic skill (Phase 7-G: design-system-ingest 추가)
import uiUxRequirementExtract from "../simple/ui-ux-requirement-extract-skill/runner";
import uiElementExtract from "../reference/ui-element-extract-skill/runner";
import designSystemIngest from "../reference/design-system-ingest-skill/runner";
import uiFoundationBuild from "../reference/ui-foundation-build-skill/runner";
import componentSpecWrite from "../asset/component-spec-write-skill/runner";
import sampleScreenDesign from "../asset/sample-screen-design-skill/runner";
import uxProcessDefine from "../asset/ux-process-define-skill/runner";
import userFlowDesign from "../template/user-flow-design-skill/runner";
import iaBuild from "../template/ia-build-skill/runner";
import handoffMerge from "../fullstep/handoff-merge-skill/runner";
import figmaPromptBuild from "../template/figma-prompt-build-skill/runner";

// 다른 워크유닛 (kickoff / cicd)
import kickoffReportTemplate from "../template/kickoff-report-template-skill/runner";
import htmlMilestoneGenerator from "../script/html-milestone-generator-skill/runner";
import assetMetadataSearch from "../metadata/asset-metadata-search-skill/runner";

const RUNNERS: SkillRunner[] = [
  // 공통
  simpleSummary,
  outputValidation,
  // UX/UI 11 atomic
  uiUxRequirementExtract,
  uiElementExtract,
  designSystemIngest,
  uiFoundationBuild,
  componentSpecWrite,
  sampleScreenDesign,
  uxProcessDefine,
  userFlowDesign,
  iaBuild,
  handoffMerge,
  figmaPromptBuild,
  // 기타
  kickoffReportTemplate,
  htmlMilestoneGenerator,
  assetMetadataSearch,
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
