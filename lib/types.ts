export type SkillCategory =
  | "simple"
  | "reference"
  | "template"
  | "script"
  | "asset"
  | "fullstep"
  | "metadata"
  | "test";

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

export interface WorkUnit {
  id: string;
  name: string;
  description: string;
  triggerHooks: string[];
  skills: string[];
  input: string[];
  output: string[];
  validationSkill?: string;
  owner: string;
  status: Status;
  /** UI 트랙 / UX 트랙 분리 메타 (UX/UI 워크유닛만 사용) */
  tracks?: {
    "common-start"?: string[];
    "ui-track"?: string[];
    "ux-track"?: string[];
    "common-end"?: string[];
  };
  /** 각 스킬 사이에 Human Gate (Approve/Reject) 활성화 여부 */
  humanGate?: boolean;
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

export const CATEGORY_LABELS: Record<SkillCategory, { en: string; ko: string }> = {
  simple: { en: "Simple", ko: "단순" },
  reference: { en: "Reference", ko: "레퍼런스" },
  template: { en: "Template", ko: "템플릿" },
  script: { en: "Script", ko: "스크립트" },
  asset: { en: "Asset", ko: "어셋" },
  fullstep: { en: "Full-step", ko: "풀스텝" },
  metadata: { en: "Metadata", ko: "메타정보" },
  test: { en: "Test", ko: "테스트" },
};

export const CATEGORY_TONE: Record<SkillCategory, string> = {
  simple: "bg-slate-100 text-slate-700 border-slate-200",
  reference: "bg-sky-50 text-sky-700 border-sky-200",
  template: "bg-violet-50 text-violet-700 border-violet-200",
  script: "bg-emerald-50 text-emerald-700 border-emerald-200",
  asset: "bg-amber-50 text-amber-700 border-amber-200",
  fullstep: "bg-indigo-50 text-indigo-700 border-indigo-200",
  metadata: "bg-rose-50 text-rose-700 border-rose-200",
  test: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};
