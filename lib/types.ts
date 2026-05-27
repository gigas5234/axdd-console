/**
 * Phase 7: SkillCategory를 AxDD-SKILLS reference의 T1~T8 + AXDD Extension으로 정렬.
 *
 * 이전 (Phase 1~6): simple / reference / template / script / asset / fullstep / metadata / test
 * 지금 (Phase 7):   simple / reference / script / asset-template / full-step / meta-tooling / integration / frontmatter-overlay / validation
 *
 * 마이그레이션:
 *   template + asset → asset-template (T4 통합)
 *   fullstep         → full-step (T5)
 *   metadata         → meta-tooling (T6)
 *   test             → validation (AXDD Extension)
 *   신규: integration (T7), frontmatter-overlay (T8)
 */
export type SkillCategory =
  | "simple" /* T1 Minimal SOP */
  | "reference" /* T2 Reference-heavy */
  | "script" /* T3 Script-backed */
  | "asset-template" /* T4 Asset-template (구 template + asset) */
  | "full-step" /* T5 Full-stack (구 fullstep) */
  | "meta-tooling" /* T6 Meta-tooling (구 metadata) */
  | "integration" /* T7 API / integration */
  | "frontmatter-overlay" /* T8 Optional frontmatter */
  | "validation"; /* AXDD Extension (구 test) */

export type Status =
  | "draft"
  | "ready-for-test"
  | "tested"
  | "needs-review"
  | "approved"
  | "release-candidate"
  | "released"
  | "deprecated"
  | "verified"
  | "unverified"
  | "passed"
  | "passed-with-review"
  | "failed"
  | "pending"
  | "active";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  input: string[];
  output: string[];
  files: {
    skill: string;
    references: string[];
    scripts: string[];
    assets: string[];
    tests: string[];
  };
  owner: string;
  version: string;
  status: Status;
  relatedWorkUnits: string[];
  tags: string[];
}

/**
 * Phase 7 Cleanup: Phase 6의 4-Case 매트릭스 / SkillBranch / InputState 모두 폐기.
 *
 * AxDD-SKILLS reference는 workunit.yaml에서 requiredRolePacks/optionalRolePacks
 * + handoffs로 분기를 표현. 4-Case 같은 콘솔 전용 메타 모델은 폐기.
 */

export interface WorkUnit {
  id: string;
  name: string;
  description: string;
  triggerHooks: string[];
  /** 이 워크유닛이 참조하는 atomic skill id 목록 (순서 의미) */
  skills: string[];
  input: string[];
  output: string[];
  validationSkill?: string;
  owner: string;
  status: Status;
}

export interface Hook {
  id: string;
  name: string;
  description: string;
  conditions: { keywords: string[] };
  targetWorkUnit: string;
  priority: number;
  enabled: boolean;
}

export interface AssetItem {
  id: string;
  name: string;
  type: "reference" | "template" | "script" | "output" | "asset";
  category: string;
  source: string;
  path: string;
  relatedSkills: string[];
  status: Status;
  duplicateRisk: "low" | "medium" | "high";
  migrationCandidate: boolean;
}

export interface Run {
  id: string;
  prompt: string;
  matchedHook: string;
  selectedWorkUnit: string;
  selectedSkills: string[];
  status: Status;
  outputs: string[];
  validation: { status: Status; issues: string[] };
  createdAt: string;
}

export const CATEGORY_LABELS: Record<
  SkillCategory,
  { en: string; ko: string; tType: string }
> = {
  simple: { en: "Simple", ko: "단순", tType: "T1" },
  reference: { en: "Reference", ko: "레퍼런스", tType: "T2" },
  script: { en: "Script", ko: "스크립트", tType: "T3" },
  "asset-template": { en: "Asset-template", ko: "에셋·템플릿", tType: "T4" },
  "full-step": { en: "Full-stack", ko: "풀스텝", tType: "T5" },
  "meta-tooling": { en: "Meta-tooling", ko: "메타툴링", tType: "T6" },
  integration: { en: "Integration", ko: "통합", tType: "T7" },
  "frontmatter-overlay": {
    en: "Frontmatter overlay",
    ko: "프론트매터 오버레이",
    tType: "T8",
  },
  validation: { en: "Validation", ko: "검증", tType: "AXDD-ext" },
};

export const CATEGORY_TONE: Record<SkillCategory, string> = {
  simple: "bg-slate-100 text-slate-700 border-slate-200",
  reference: "bg-sky-50 text-sky-700 border-sky-200",
  script: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "asset-template": "bg-amber-50 text-amber-700 border-amber-200",
  "full-step": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "meta-tooling": "bg-rose-50 text-rose-700 border-rose-200",
  integration: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "frontmatter-overlay": "bg-violet-50 text-violet-700 border-violet-200",
  validation: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};
