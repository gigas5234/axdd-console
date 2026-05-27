/**
 * SKILL.md frontmatter 빌더 — Phase 7 신규.
 *
 * agentskills.io 표준:
 *   - name (required, kebab-case ≤ 64자, 디렉토리명과 일치)
 *   - description (required, 1~1024자, what + when)
 *   - license / compatibility / metadata / allowed-tools (optional)
 *
 * AXDD 확장 필드는 `metadata:` 안에 string→string 매핑으로:
 *   - axdd.title / axdd.version / axdd.type / axdd.category
 *   - axdd.owner / axdd.status / axdd.tags
 *   - axdd.inputs / axdd.outputs
 *   - axdd.dependencies.files / axdd.dependencies.skills
 */

import type { Skill, SkillCategory } from "./types";

/** T1~T8 + AXDD Extension 매핑 */
const CATEGORY_TO_T_TYPE: Record<SkillCategory, string> = {
  simple: "T1-minimal-sop",
  reference: "T2-reference-heavy",
  script: "T3-script-backed",
  "asset-template": "T4-asset-template",
  "full-step": "T5-full-stack",
  "meta-tooling": "T6-meta-tooling",
  integration: "T7-api-integration",
  "frontmatter-overlay": "T8-optional-frontmatter",
  validation: "AXDD-validation",
};

export interface AxddMetadata {
  title: string;
  version: string;
  type: string; // T1~T8 또는 AXDD-validation
  category: string; // 예: "ux-ui"
  owner: string;
  status: string; // Draft | Accepted (governance-lite와 정합)
  tags: string; // 콤마 구분
  inputs: string; // 콤마 구분 파일명
  outputs: string; // 콤마 구분 파일명
  dependenciesFiles: string; // 콤마 구분 경로
  dependenciesSkills: string; // 콤마 구분 skill id (composite kit 한정)
}

/**
 * Skill 객체 + 추가 메타로부터 AXDD frontmatter 블록 생성.
 *
 * 출력 예시:
 *   ---
 *   name: ui-element-extract
 *   description: ...
 *   metadata:
 *     axdd.title: "UI Element Extract"
 *     axdd.version: "0.1.0"
 *     ...
 *   ---
 */
export function buildAxddFrontmatter(
  skill: Skill,
  category: "ux-ui" | "kickoff" | "cicd" | "validation" | "generic" = "ux-ui",
): string {
  // description은 1~1024자 — 짧으면 보강
  const baseDesc = skill.description || `${skill.name} skill.`;
  const description =
    baseDesc.length >= 30
      ? baseDesc
      : `Use this skill when ${baseDesc.toLowerCase()} as part of the AXDD ${category} workflow.`;

  // AXDD 메타 — agentskills.io spec 호환 (string→string)
  const meta: AxddMetadata = {
    title: skill.name,
    version: skill.version || "0.1.0",
    type: CATEGORY_TO_T_TYPE[skill.category] || "T1-minimal-sop",
    category,
    owner: skill.owner || "Product Design",
    status: mapStatusToAxdd(skill.status),
    tags: (skill.tags || []).join(","),
    inputs: (skill.input || []).join(","),
    outputs: (skill.output || []).join(","),
    dependenciesFiles: collectDependencyFiles(skill).join(","),
    dependenciesSkills: "",
  };

  // YAML frontmatter 작성 — 값에 따옴표를 명시적으로 (특수문자 안전)
  const lines = [
    "---",
    `name: ${skill.id}`,
    `description: ${yamlQuote(description)}`,
    `metadata:`,
    `  axdd.title: ${yamlQuote(meta.title)}`,
    `  axdd.version: ${yamlQuote(meta.version)}`,
    `  axdd.type: ${yamlQuote(meta.type)}`,
    `  axdd.category: ${yamlQuote(meta.category)}`,
    `  axdd.owner: ${yamlQuote(meta.owner)}`,
    `  axdd.status: ${yamlQuote(meta.status)}`,
    `  axdd.tags: ${yamlQuote(meta.tags)}`,
    `  axdd.inputs: ${yamlQuote(meta.inputs)}`,
    `  axdd.outputs: ${yamlQuote(meta.outputs)}`,
    `  axdd.dependencies.files: ${yamlQuote(meta.dependenciesFiles)}`,
    `  axdd.dependencies.skills: ${yamlQuote(meta.dependenciesSkills)}`,
    "---",
  ];
  return lines.join("\n");
}

/** Composite kit (work-unit)용 frontmatter — dependencies.skills 채움 */
export function buildCompositeFrontmatter(args: {
  id: string;
  name: string;
  description: string;
  version: string;
  owner: string;
  status: string;
  category: string;
  tags: string[];
  dependsOnSkills: string[];
  outputs: string[];
}): string {
  const desc =
    args.description.length >= 30
      ? args.description
      : `Use this composite kit when ${args.description.toLowerCase()}.`;
  const lines = [
    "---",
    `name: ${args.id}`,
    `description: ${yamlQuote(desc)}`,
    `metadata:`,
    `  axdd.title: ${yamlQuote(args.name)}`,
    `  axdd.version: ${yamlQuote(args.version)}`,
    `  axdd.type: ${yamlQuote("AXDD-composite-kit")}`,
    `  axdd.category: ${yamlQuote(args.category)}`,
    `  axdd.owner: ${yamlQuote(args.owner)}`,
    `  axdd.status: ${yamlQuote(args.status)}`,
    `  axdd.tags: ${yamlQuote(args.tags.join(","))}`,
    `  axdd.inputs: ${yamlQuote("")}`,
    `  axdd.outputs: ${yamlQuote(args.outputs.join(","))}`,
    `  axdd.dependencies.files: ${yamlQuote("")}`,
    `  axdd.dependencies.skills: ${yamlQuote(args.dependsOnSkills.join(","))}`,
    "---",
  ];
  return lines.join("\n");
}

/* ─── Helpers ──────────────────────────────────────────────── */

function yamlQuote(value: string): string {
  // 빈 문자열은 ""로
  if (value === "" || value == null) return '""';
  // 모든 값을 따옴표로 감싸 안전 (콜론·콤마 등 특수문자)
  const escaped = String(value).replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function mapStatusToAxdd(status: string | undefined): string {
  // 콘솔의 13개 status → AXDD Draft/Accepted 2단계로 정규화
  if (!status) return "Draft";
  const acceptedSet = new Set([
    "approved",
    "released",
    "release-candidate",
    "verified",
    "passed",
    "active",
  ]);
  return acceptedSet.has(status) ? "Accepted" : "Draft";
}

function collectDependencyFiles(skill: Skill): string[] {
  const out: string[] = [];
  for (const f of skill.files.references) out.push(f);
  for (const f of skill.files.assets) out.push(f);
  return out;
}
