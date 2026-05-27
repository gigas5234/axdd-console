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

/**
 * 인풋 상태 — Phase 6에서 도입. 가람씨 회의록의 "if 문 들어가야 됨" 요구사항 반영.
 *
 * 모든 스킬 인풋(고객 요구사항·AXDD DS·고객사 DS 등)이 있느냐 없느냐에 따라
 * 워크유닛 내부에서 스킬을 skip하거나 인풋 소스를 재배치한다.
 */
export interface InputState {
  /** 정리된 고객 요구사항 MD 보유 여부 */
  hasRequirement: boolean;
  /** AXDD 자체 디자인 시스템 카탈로그 보유 여부 */
  hasAxddDs: boolean;
  /** 고객사 디자인 시스템 자료 보유 여부 (URL/MD/폴더) */
  hasCustomerDs: boolean;
  /** UX 어셋 (프로세스/체크리스트 폴더) 보유 여부 */
  hasUxAssets: boolean;
}

/**
 * 4-Case 매트릭스 — 인풋 상태 조합. SKILL.md와 UI 라벨에 사용.
 *
 * - case-a · DS 부트스트랩: 요구사항만 있고 DS는 없음 → DS Bootstrap 워크유닛 권유
 * - case-b · AXDD 내부 신규: 요구사항 + AXDD DS 있음 → AXDD DS 기반 신규 화면/컴포넌트
 * - case-c · 고객사 프로젝트: 요구사항 + 고객사 DS 있음 → 고객사 DS 우선, AXDD DS 폴백
 * - case-d · 요구사항 없음: Step 1 (요구사항 추출) 무조건 먼저
 */
export type InputCase = "case-a" | "case-b" | "case-c" | "case-d";

/** 스킬이 받는 인풋 슬롯 정의 */
export interface SkillInputSlot {
  /** 슬롯 이름. 예: "customer_requirement" / "design_system_ref" */
  name: string;
  /** 인풋 형식 */
  type: "md" | "folder" | "url" | "json";
  /** 필수 여부. false면 없을 때 skip 또는 fallback */
  required: boolean;
  /** 어디서 인풋을 받나 */
  source:
    | "user-input" /* 사용자가 런타임에 입력 */
    | "previous-skill" /* 이전 스킬 산출물 */
    | "fixed-asset" /* skills/<id>/references/ 또는 assets/ 폴더 */
    | "axdd-ds-catalog" /* data/our-design-system.md (콘솔 전역 자산) */
    | "customer-ds-input" /* 사용자가 업로드한 고객사 DS */;
  /** 없을 때 대체 경로 (다른 슬롯명 또는 "skip") */
  fallback?: string;
}

/**
 * 스킬별 분기 메타 — work-units.json의 skillBranches 에서 사용.
 *
 * 받는 사람이 SKILL.md만 보고 어느 케이스에 동작하는지 알 수 있게,
 * SKILL.md 본문에도 동일한 정보를 표로 박는다.
 */
export interface SkillBranch {
  /** 이 스킬이 실행되는 조건 (모두 만족 시 실행). 미지정 시 항상 실행 */
  runWhen?: Partial<InputState>;
  /** 인풋 슬롯 정의 (없을 때 어떻게 처리할지 명시) */
  inputs?: SkillInputSlot[];
  /** skip 시 다음 스킬에 전달할 폴백 메시지 */
  onSkip?: string;
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
  /**
   * 스킬별 분기 메타 — Phase 6 신규.
   * key = skill id, value = 분기 정의.
   * 정의되지 않은 스킬은 모든 케이스에서 무조건 실행된다.
   */
  skillBranches?: Record<string, SkillBranch>;
  /** 이 워크유닛이 어느 케이스를 지원하는지 — UI/UX 시각화용 */
  supportedCases?: InputCase[];
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
