/**
 * Enterprise Skill Repository Export — Phase 7 신규.
 *
 * 사용자(전사 내부 디자이너/PM)가 동일한 스킬셋을 뽑아 쓸 수 있도록
 * AxDD-SKILLS reference 호환 zip을 생성한다.
 *
 * 출력 구조:
 *   axdd-skills-enterprise/
 *   ├── README.md
 *   ├── CATALOG.md
 *   ├── AGENT_CREATION_GUIDE.md
 *   ├── skills/<skill-name>/SKILL.md          (flat — T-type은 CATALOG에서 분류)
 *   ├── work-units/<kit>/workunit.yaml         (composite kit)
 *   ├── governance-lite/                       (ACCEPTANCE_RULES / OWNER_TABLE / PR_CHECKLIST)
 *   ├── validation/axe_check.py                (reference에서 정적 복사)
 *   └── examples/
 *
 * 원칙:
 *   - 폴더 nesting으로 T-type 표현 안 함 (flat skills/)
 *   - SKILL.md frontmatter는 표준 (name+description) + AXDD metadata
 *   - 신규 validator 만들지 않음, axe_check.py 그대로
 */

import { promises as fs } from "fs";
import path from "path";
import JSZip from "jszip";
import type { Skill, WorkUnit } from "./types";
import { buildAxddFrontmatter, buildCompositeFrontmatter } from "./frontmatter-builder";
import { buildRootCatalog } from "./catalog-generator";
import { buildUxuiContent } from "./uxui-content";

const REFERENCE_DIR = "reference/axdd-skills";

export interface EnterpriseExportOptions {
  /** 포함할 워크유닛 (선택) — 미지정 시 모든 워크유닛 */
  workUnitIds?: string[];
  /** 추가로 포함할 atomic skill (워크유닛에 없어도) */
  extraSkillIds?: string[];
  /** 생성될 composite kit (work-unit 형태로 export) */
  compositeKits?: CompositeKit[];
}

export interface CompositeKit {
  id: string; // 예: axdd-ux-ui-standard-kit
  name: string;
  description: string;
  requiredSkillIds: string[];
  outputs?: string[];
  category?: string;
}

/* ────────────────────────────────────────────────────────────
 *  메인 — buildEnterpriseRepository
 * ──────────────────────────────────────────────────────────── */

export async function buildEnterpriseRepository(opts: {
  skills: Skill[];
  workUnits: WorkUnit[];
  options?: EnterpriseExportOptions;
}): Promise<Uint8Array> {
  const { skills: allSkills, workUnits: allWorkUnits, options = {} } = opts;
  const cwd = process.cwd();

  // 포함할 워크유닛 결정
  const selectedWorkUnits = options.workUnitIds
    ? allWorkUnits.filter((w) => options.workUnitIds!.includes(w.id))
    : allWorkUnits;

  // 포함할 atomic skill ID 집합 (워크유닛이 참조하는 스킬 + extraSkillIds)
  const includedSkillIds = new Set<string>();
  for (const wu of selectedWorkUnits) {
    for (const sid of wu.skills) includedSkillIds.add(sid);
  }
  for (const sid of options.extraSkillIds ?? []) includedSkillIds.add(sid);

  const includedSkills = allSkills.filter((s) => includedSkillIds.has(s.id));

  // Composite kits — 기본 UX/UI Standard Kit
  const compositeKits: CompositeKit[] =
    options.compositeKits ?? defaultCompositeKits(selectedWorkUnits);

  const zip = new JSZip();
  const root = zip.folder("axdd-skills-enterprise");
  if (!root) throw new Error("zip root failed");

  // ─── 1. Root 문서 ───
  root.file("README.md", buildReadme(includedSkills, compositeKits));
  root.file(
    "CATALOG.md",
    buildRootCatalog(
      includedSkills,
      compositeKits.map((k) => ({
        id: k.id,
        name: k.name,
        requiredSkills: k.requiredSkillIds,
      })),
    ),
  );
  // Phase 7-F: AGENT_CREATION_GUIDE는 Enterprise Lite 구조에 맞춰 동적 생성
  // (reference 원본은 skill-creator-agent / docs/ / t1~t8 폴더를 참조하지만 Lite에는 없음)
  root.file("AGENT_CREATION_GUIDE.md", buildAgentCreationGuide(includedSkills));

  // Phase 7-G: 운영 하네스 레이어 — Claude Code / Cursor 자동 라우팅
  root.file("CLAUDE.md", buildClaudeMd(includedSkills, compositeKits));
  root.file("AGENTS.md", buildAgentsMd(includedSkills, compositeKits));

  // .cursor/agents/axdd-ux-ui-router.md
  const cursorFolder = root.folder(".cursor");
  if (cursorFolder) {
    const agentsFolder = cursorFolder.folder("agents");
    if (agentsFolder) {
      agentsFolder.file("axdd-ux-ui-router.md", buildCursorAgent());
    }
  }

  // routing/routing-rules.md
  const routingFolder = root.folder("routing");
  if (routingFolder) {
    routingFolder.file("routing-rules.md", buildRoutingRules());
  }

  // ─── 2. skills/<skill-name>/SKILL.md (flat) ───
  const skillsFolder = root.folder("skills");
  if (skillsFolder) {
    for (const skill of includedSkills) {
      const skillFolder = skillsFolder.folder(skill.id);
      if (!skillFolder) continue;

      // SKILL.md — frontmatter + 본문
      const sourceBody = await readSkillBody(skill, cwd);
      const frontmatter = buildAxddFrontmatter(skill, "ux-ui");
      skillFolder.file("SKILL.md", `${frontmatter}\n\n${sourceBody}\n`);

      // references/ assets/ scripts/ tests/ 컨텐츠 복사 (있을 때만)
      await copySkillSubdirs(skillFolder, skill, cwd);
    }
  }

  // ─── 3. work-units/<kit>/ ───
  const workUnitsFolder = root.folder("work-units");
  if (workUnitsFolder) {
    for (const kit of compositeKits) {
      const kitFolder = workUnitsFolder.folder(kit.id);
      if (!kitFolder) continue;

      // workunit.yaml
      kitFolder.file("workunit.yaml", buildWorkUnitYaml(kit));

      // SKILL.md (composite kit도 SKILL.md 가짐 — Claude Code에서 인식 가능)
      kitFolder.file(
        "SKILL.md",
        `${buildCompositeFrontmatter({
          id: kit.id,
          name: kit.name,
          description: kit.description,
          version: "0.1.0",
          owner: "Product Design",
          status: "Draft",
          category: kit.category ?? "ux-ui",
          tags: ["composite", "kit", "work-unit"],
          dependsOnSkills: kit.requiredSkillIds,
          outputs: kit.outputs ?? [],
        })}\n\n${buildCompositeBody(kit)}\n`,
      );

      // CATALOG.md (kit 내부)
      kitFolder.file("CATALOG.md", buildKitCatalog(kit, includedSkills));
      kitFolder.file("README.md", buildKitReadme(kit));
    }
  }

  // ─── 4. governance-lite/ (reference에서 정적 복사 + Phase 7-F 정규화) ───
  const govFolder = root.folder("governance-lite");
  if (govFolder) {
    const govSrcDir = path.join(cwd, REFERENCE_DIR, "governance-lite");
    await copyDirWithRename(govFolder, govSrcDir, {
      // PR_REVIEW_CHECKLIST.md → PR_CHECKLIST.md (사용자 피드백 정규화)
      "PR_REVIEW_CHECKLIST.md": "PR_CHECKLIST.md",
    });
  }

  // ─── 5. validation/ ───
  const valFolder = root.folder("validation");
  if (valFolder) {
    const axeCheck = await tryReadOrFallback(
      path.join(cwd, REFERENCE_DIR, "axe_check.py"),
      "# axe_check.py — reference 자산 미존재",
    );
    valFolder.file("axe_check.py", axeCheck);
    valFolder.file("validation-log-template.md", VALIDATION_LOG_TEMPLATE);
  }

  // ─── 6. examples/ ───
  const examplesFolder = root.folder("examples");
  if (examplesFolder) {
    examplesFolder.file("README.md", EXAMPLES_README);
  }

  // ─── 7. Quality Check (Phase 7-F) ───
  // 모든 생성된 파일을 스캔해 scaffold 마커가 남았는지 확인.
  // 결과는 quality-report.md로 examples/ 에 첨부.
  const qualityReport = await runQualityCheck(zip);
  if (examplesFolder) {
    examplesFolder.file("quality-report.md", qualityReport);
  }

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

/**
 * Phase 7-F: zip 안의 모든 텍스트 파일을 스캔해 scaffold 마커 검출.
 *
 * 검출되면 quality-report.md에 기록.
 * 실패가 아닌 informational warn — 디자인팀이 추후 채울 여지.
 */
async function runQualityCheck(zip: JSZip): Promise<string> {
  const SCAFFOLD_MARKERS = [
    "Skeleton file auto-generated",
    "실제 자료가 채워질 자리입니다",
    "상태: scaffold",
    "TODO:",
    "__TODO__",
  ];

  const findings: { path: string; markers: string[] }[] = [];
  let scannedCount = 0;

  // zip.files는 모든 파일 (full path) 기준
  for (const [filePath, file] of Object.entries(zip.files)) {
    if (file.dir) continue;
    if (!/\.(md|txt|yaml|yml)$/.test(filePath)) continue;
    // quality-report 자체는 제외
    if (filePath.endsWith("quality-report.md")) continue;

    scannedCount++;
    try {
      const content = await file.async("string");
      const matched: string[] = [];
      for (const marker of SCAFFOLD_MARKERS) {
        if (content.includes(marker)) matched.push(marker);
      }
      if (matched.length > 0) {
        findings.push({ path: filePath, markers: matched });
      }
    } catch {
      // skip
    }
  }

  const lines: string[] = [
    "# Quality Report — Enterprise Export",
    "",
    `> Generated: ${new Date().toISOString()}`,
    `> Files scanned: ${scannedCount}`,
    `> Files with scaffold markers: ${findings.length}`,
    "",
    "## Scaffold marker policy",
    "",
    "이 보고서는 zip 안의 텍스트 파일에서 scaffold 잔재 마커를 검출한 결과입니다.",
    "검출 ≠ 실패. Enterprise Lite는 일부 placeholder (예: TODO, __TODO__)를 허용해",
    "디자인팀이 추후 실제 값을 채울 수 있는 여지를 둡니다.",
    "",
    "그러나 다음 마커는 **반드시 제거** 권장:",
    "",
    "- `Skeleton file auto-generated`",
    "- `실제 자료가 채워질 자리입니다`",
    "- `상태: scaffold`",
    "",
    "## Findings",
    "",
  ];

  if (findings.length === 0) {
    lines.push("✅ **No scaffold markers detected.** 모든 파일이 실제 컨텐츠로 채워져 있습니다.");
  } else {
    lines.push("| File | Markers found |");
    lines.push("|------|---------------|");
    for (const f of findings) {
      lines.push(`| \`${f.path}\` | ${f.markers.join(", ")} |`);
    }
    lines.push("");
    lines.push("### 권장 조치");
    lines.push("");
    lines.push("- `TODO:` / `__TODO__` 마커: 디자인팀이 실제 값으로 교체 (의도된 placeholder)");
    lines.push("- `Skeleton file auto-generated`: 실제 컨텐츠로 교체 필수");
    lines.push("- `상태: scaffold`: 실제 자료 작성 후 메타 제거");
  }

  lines.push("");
  lines.push("## 다음 단계");
  lines.push("");
  lines.push("1. 디자인팀이 references/ 자료를 사내 표준에 맞춰 보강");
  lines.push("2. `axe_check.py validate-skill skills/<name>` 으로 frontmatter 검증");
  lines.push("3. `axe_check.py validate-workunit work-units/axdd-ux-ui-standard-kit --lite` 으로 워크유닛 검증");
  lines.push("4. PR로 사내 GitHub에 머지");
  lines.push("5. governance-lite/ACCEPTANCE_RULE 따라 Draft → Accepted 승급");

  return lines.join("\n") + "\n";
}

/* ────────────────────────────────────────────────────────────
 *  Helpers
 * ──────────────────────────────────────────────────────────── */

async function tryReadOrFallback(
  absPath: string,
  fallback: string,
): Promise<string> {
  try {
    return await fs.readFile(absPath, "utf-8");
  } catch {
    return fallback;
  }
}

async function readSkillBody(skill: Skill, cwd: string): Promise<string> {
  const skillMdPath = path.join(cwd, skill.files.skill);
  try {
    const raw = await fs.readFile(skillMdPath, "utf-8");
    // 기존 frontmatter 제거 — 우리가 새로 박은 표준 frontmatter만 남김
    if (raw.startsWith("---\n")) {
      const end = raw.indexOf("\n---\n", 4);
      if (end > 0) return raw.slice(end + 5).trim();
    }
    return raw;
  } catch {
    return `# ${skill.name}\n\n${skill.description}\n`;
  }
}

/**
 * 스킬의 references/assets/scripts/tests 자료를 복사한다.
 *
 * **Phase 7-E 보강**: skills.catalog.json의 `files.references/assets/scripts/tests` 경로가
 * imaginary (실제 파일 없음)인 경우 → 자동으로 스켈레톤 .md 생성.
 *
 * 회의록 정합:
 *   "지금 가람님은 MD 안에 어떤 내용이 들어가야 될지는 상상을 하고 계시잖아요.
 *    그 내용이 폴더 자체로 가지고 있어도 돼요" — 폴더 실체화 의무.
 */
async function copySkillSubdirs(
  skillFolder: JSZip,
  skill: Skill,
  cwd: string,
): Promise<void> {
  const skillBaseDir = path.dirname(skill.files.skill);
  const groups: Array<{
    sub: "references" | "assets" | "scripts" | "tests";
    files: string[];
  }> = [
    { sub: "references", files: skill.files.references },
    { sub: "assets", files: skill.files.assets },
    { sub: "scripts", files: skill.files.scripts },
    { sub: "tests", files: skill.files.tests },
  ];

  for (const { sub, files } of groups) {
    if (files.length === 0) continue;

    const subFolder = skillFolder.folder(sub);
    if (!subFolder) continue;

    for (const filePath of files) {
      // filePath는 보통 "references/foo.md" 형태 — basename만 추출
      const basename = path.basename(filePath);

      // 1차: 스킬 폴더 안의 실제 파일 찾기
      const localPath = path.join(cwd, skillBaseDir, filePath);
      let content: string | null = null;
      try {
        content = await fs.readFile(localPath, "utf-8");
      } catch {
        content = null;
      }

      // 2차: 다른 경로 (절대 경로 등)
      if (content === null) {
        try {
          content = await fs.readFile(path.join(cwd, filePath), "utf-8");
        } catch {
          content = null;
        }
      }

      // 2.5차: KT 디자인 시스템 어댑터 (Phase 7-H) — basename이 kt-*면 reference/kt-design-system/ 시도
      if (content === null && /^kt-/.test(basename)) {
        try {
          content = await fs.readFile(
            path.join(cwd, "reference", "kt-design-system", basename),
            "utf-8",
          );
        } catch {
          content = null;
        }
      }

      // 3차: 실제 UX/UI 컨텐츠 자동 생성 (Phase 7-F)
      // scaffold placeholder 사용 X — 실제 사용 가능한 컨텐츠
      if (content === null) {
        content = buildUxuiContent(sub, basename, skill);
      }

      subFolder.file(basename, content);
    }
  }
}


async function copyDir(zipFolder: JSZip, srcDir: string): Promise<void> {
  try {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const filePath = path.join(srcDir, ent.name);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        zipFolder.file(ent.name, content);
      } catch {
        // skip
      }
    }
  } catch {
    // skip
  }
}

/**
 * copyDir + 파일명 매핑. renameMap[원본명] = 목적지명.
 */
async function copyDirWithRename(
  zipFolder: JSZip,
  srcDir: string,
  renameMap: Record<string, string>,
): Promise<void> {
  try {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const filePath = path.join(srcDir, ent.name);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const targetName = renameMap[ent.name] ?? ent.name;
        zipFolder.file(targetName, content);
      } catch {
        // skip
      }
    }
  } catch {
    // skip
  }
}

function defaultCompositeKits(workUnits: WorkUnit[]): CompositeKit[] {
  const uxui = workUnits.find((w) => w.id === "ux-ui-planning-workunit");
  if (!uxui) return [];
  return [
    {
      id: "axdd-ux-ui-standard-kit",
      name: "AXDD UX/UI Standard Kit",
      description:
        "AXDD 전사 내부 프로젝트에서 UX/UI 표준 산출물 세트를 한 번에 뽑는 composite kit. 11개 atomic skill 순차 실행 후 마스터 핸드오프 + Figma 프롬프트까지 생성.",
      requiredSkillIds: uxui.skills,
      outputs: uxui.output,
      category: "ux-ui",
    },
  ];
}

function buildWorkUnitYaml(kit: CompositeKit): string {
  // AxDD-SKILLS reference의 workunit.yaml + Enterprise Lite 확장.
  // axe_check.py validate-workunit (--lite) 호환.
  const artifacts = kit.outputs ?? [];
  const lines = [
    "apiVersion: axdd/v1alpha1",
    "kind: WorkUnit",
    "metadata:",
    `  name: ${kit.id}`,
    `  version: "0.1.0"`,
    `  owner: workunit-owner`,
    `  status: Draft`,
    `spec:`,
    `  description: ${JSON.stringify(kit.description)}`,
    `  category: ${kit.category ?? "ux-ui"}`,
    `  # Enterprise Lite: role packs / handoffs는 placeholder. axe_check.py --lite로 검증.`,
    `  requiredRolePacks:`,
    `    - ux-ui-designer`,
    `  requiredHandoffs:`,
    `    - ux-ui-standard-handoff`,
    `  requiredArtifacts:`,
    ...artifacts.map((a) => `    - ${a}`),
    `  requiredSkills:`,
    ...kit.requiredSkillIds.map((s) => `    - ${s}`),
    `  outputs:`,
    ...artifacts.map((o) => `    - ${o}`),
    `  closureCriteria:`,
    `    - required_skills_exist`,
    `    - required_artifacts_exist`,
    `    - catalog_entries_exist`,
    `    - frontmatter_valid`,
    `    - no_secret_patterns`,
  ];
  return lines.join("\n") + "\n";
}

function buildCompositeBody(kit: CompositeKit): string {
  return `# ${kit.name}

${kit.description}

## When to use

전사 내부 프로젝트에서 UX/UI 표준 산출물을 한 번에 뽑고 싶을 때.

## Required atomic skills

${kit.requiredSkillIds.map((s, i) => `${i + 1}. \`${s}\``).join("\n")}

## Outputs

${(kit.outputs ?? []).map((o) => `- \`${o}\``).join("\n")}

## Closure criteria

- \`required_skills_exist\` — 위 atomic skill 모두 skills/ 에 존재
- \`catalog_entries_exist\` — CATALOG.md에 모두 등록
- \`frontmatter_valid\` — \`python3 validation/axe_check.py validate-skill\` 통과
- \`no_secret_patterns\` — \`python3 validation/axe_check.py scan-secrets\` 통과

## 실행 방법

\`\`\`bash
# Claude Code / Cursor에 zip 풀어 설치
cp -r ${kit.id}/ ~/.claude/skills/    # 또는 .cursor/skills/

# 자연어 호출
"AXDD UX/UI Standard Kit으로 신규 화면 풀세트 만들어줘"
\`\`\`
`;
}

function buildKitCatalog(kit: CompositeKit, allSkills: Skill[]): string {
  const lines = [
    `# ${kit.name} — Internal Catalog`,
    "",
    "| Step | Skill | Path |",
    "|------|-------|------|",
  ];
  kit.requiredSkillIds.forEach((sid, i) => {
    const s = allSkills.find((x) => x.id === sid);
    lines.push(
      `| ${i + 1} | ${s?.name ?? sid} | \`../../skills/${sid}/SKILL.md\` |`,
    );
  });
  return lines.join("\n") + "\n";
}

function buildKitReadme(kit: CompositeKit): string {
  return `# ${kit.name}

> ${kit.description}

자세한 사용법은 [\`SKILL.md\`](SKILL.md) 참조.

## Required skills

${kit.requiredSkillIds.map((s) => `- \`../skills/${s}/\``).join("\n")}
`;
}

function buildReadme(
  includedSkills: Skill[],
  compositeKits: CompositeKit[],
): string {
  return `# AXDD Skills — Enterprise Repository

> 전사 내부 프로젝트에서 동일한 스킬을 뽑아 쓰기 위한 표준 레포.
> AxDD-SKILLS reference 호환 (agentskills.io spec).

## 빠른 시작

> **권장 사용법**: 이 폴더(\`axdd-skills-enterprise/\`) **루트 자체**를 Claude Code / Cursor 에서 열어
> 작업 공간으로 사용하세요. \`CLAUDE.md\` / \`AGENTS.md\` / \`.cursor/agents\` 가 루트에 들어 있어,
> 에이전트가 자동으로 라우팅 룰 + 11개 atomic skill + composite kit + KT Design System 어댑터를
> 모두 인식합니다.
>
> 아래의 개별 복사 명령은 **다른 레포에 부분 통합**할 때만 사용하세요. workunit 폴더만 따로 떼어
> 복사하면 atomic skill 의존성 / KT 어댑터 / routing-rules 가 깨집니다.

### Claude Code — 권장 (루트로 열기)

\`\`\`bash
cd path/to/axdd-skills-enterprise/
# Claude Code 가 CLAUDE.md / AGENTS.md / .cursor/agents 를 자동 인식
\`\`\`

### Cursor — 권장 (루트로 열기)

\`\`\`bash
cd path/to/axdd-skills-enterprise/
# .cursor/agents 의 라우팅 룰이 활성화됨
\`\`\`

### (선택) 다른 레포에 통합할 때만 복사

\`\`\`bash
# 전체 스킬을 ~/.claude/skills/ 에 복사 (atomic 단위로 호출 가능)
cp -r skills/* ~/.claude/skills/

# Cursor symlink
ln -s "$(pwd)/skills" ~/.cursor/skills/axdd-skills
\`\`\`

> ⚠️ **workunit 폴더만 단독 복사하지 마세요.** \`work-units/axdd-ux-ui-standard-kit/\` 은
> \`skills/\` 의 11개 atomic skill 을 \`requiredSkills\` 로 참조하므로, 루트 통째로 가져가야
> 동작합니다.

### 검증

\`\`\`bash
for d in skills/*; do
  python3 validation/axe_check.py validate-skill "$d"
done

for d in work-units/*; do
  python3 validation/axe_check.py validate-workunit "$d" --lite
done
\`\`\`

## 포함된 자산

- **Atomic Skills** (${includedSkills.length}개) — \`skills/\`
- **Composite Kits** (${compositeKits.length}개) — \`work-units/\`
- **Governance Rules** — \`governance-lite/\` (ACCEPTANCE_RULE / OWNER_TABLE / PR_CHECKLIST / VERSION_RULE)
- **Validation Script** — \`validation/axe_check.py\`
- **Agent Creation Guide** — \`AGENT_CREATION_GUIDE.md\`

전체 인덱스는 [CATALOG.md](CATALOG.md) 참조.

## 구조

\`\`\`
axdd-skills-enterprise/
├── README.md                          (이 파일)
├── CATALOG.md                         (T1~T8 + AXDD Extension 그루핑)
├── AGENT_CREATION_GUIDE.md
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md                   (표준 frontmatter + AXDD metadata)
│       ├── references/   (있을 때)
│       ├── assets/       (있을 때)
│       ├── scripts/      (있을 때)
│       └── tests/        (있을 때)
├── work-units/
│   └── <kit>/
│       ├── workunit.yaml
│       ├── SKILL.md
│       ├── CATALOG.md
│       └── README.md
├── governance-lite/
├── validation/
└── examples/
\`\`\`

## Frontmatter 표준

모든 SKILL.md는 agentskills.io spec 호환:

- **필수**: \`name\` (kebab-case, 디렉토리명과 일치) / \`description\` (1~1024자)
- **선택**: \`metadata\` (string→string 매핑)

AXDD 확장 필드는 모두 \`metadata:\` 안에:

\`\`\`yaml
metadata:
  axdd.title: "..."
  axdd.version: "0.1.0"
  axdd.type: "T2-reference-heavy"   # T1~T8 또는 AXDD-validation
  axdd.category: "ux-ui"
  axdd.owner: "Product Design"
  axdd.status: "Draft"               # Draft | Accepted
  axdd.tags: "ux,ui,reference"       # 콤마 구분
  axdd.inputs: "..."
  axdd.outputs: "..."
  axdd.dependencies.files: "..."
  axdd.dependencies.skills: ""        # composite kit 한정
\`\`\`

---

Generated by AXDD SkillOps Console.
`;
}

/**
 * Phase 7-F: Enterprise Lite 호환 AGENT_CREATION_GUIDE 동적 생성.
 *
 * reference 원본은 skill-creator-agent / t1-t8 / docs/ 를 참조해 broken link 발생.
 * 이 함수는 Enterprise zip 안의 실제 파일만 참조하는 가이드를 만든다.
 */
function buildAgentCreationGuide(includedSkills: Skill[]): string {
  const skillList = includedSkills
    .map((s) => `- [\`skills/${s.id}/SKILL.md\`](skills/${s.id}/SKILL.md) — ${s.name}`)
    .join("\n");

  return `# AGENT_CREATION_GUIDE — AXDD Enterprise Lite

> 이 가이드는 **AxDD-SKILLS Enterprise Lite zip** 안의 실제 구조만 참조합니다.
> Generic AxDD-SKILLS reference의 skill-creator-agent / t1-t8 sample / docs/ 폴더는
> 이 zip에 포함되지 않으므로 본 가이드에서 다루지 않습니다.

## 1. 이 zip의 구조

\`\`\`
axdd-skills-enterprise/
├── README.md                       (시작 문서)
├── CATALOG.md                      (T1~T8 + AXDD Extensions 인덱스)
├── AGENT_CREATION_GUIDE.md         (이 문서)
├── skills/                         (flat — 11개 UX/UI atomic skill)
│   └── <skill-name>/
│       ├── SKILL.md                (표준 frontmatter + AXDD metadata)
│       ├── references/             (있을 때)
│       ├── assets/                 (있을 때)
│       └── tests/                  (있을 때)
├── work-units/                     (composite kit)
│   └── axdd-ux-ui-standard-kit/
│       ├── workunit.yaml
│       ├── SKILL.md
│       └── CATALOG.md
├── governance-lite/                (운영 룰)
├── validation/                     (axe_check.py + log template)
└── examples/
\`\`\`

## 2. 포함된 UX/UI atomic skill

${skillList}

## 3. 새 UX/UI atomic skill 만들기

### 3.1 디렉토리 생성

\`\`\`bash
mkdir -p skills/<new-skill-name>
cd skills/<new-skill-name>
\`\`\`

규칙:
- 폴더명 = kebab-case + \`-skill\` suffix (선택)
- \`SKILL.md\` 1개 필수
- \`references/\` / \`assets/\` / \`tests/\` 는 선택 — 필요할 때만 폴더 생성

### 3.2 SKILL.md frontmatter

\`\`\`yaml
---
name: my-new-skill
description: Use this skill when ... and produce ... output.
metadata:
  axdd.title: "My New Skill"
  axdd.version: "0.1.0"
  axdd.type: "T2-reference-heavy"     # T1~T8 또는 AXDD-validation
  axdd.category: "ux-ui"
  axdd.owner: "Product Design"
  axdd.status: "Draft"
  axdd.tags: "tag1,tag2,tag3"
  axdd.inputs: "input_a.md,input_b.md"
  axdd.outputs: "output.md"
  axdd.dependencies.files: "references/foo.md,assets/bar.md"
  axdd.dependencies.skills: ""
---
\`\`\`

규칙:
- **name** : 디렉토리명과 일치, kebab-case, ≤64자
- **description** : 1~1024자, *what* + *when* 모두 포함
- **metadata** : 모든 값 string (YAML array / nested object 금지)
- AXDD 확장 필드는 \`metadata\` 안에만 (top-level 금지)

### 3.3 SKILL.md 본문 (권장 섹션)

\`\`\`md
# {{Skill Name}}

## 🎯 Purpose
한 문장으로 이 스킬이 무엇을 하는지.

## 📥 Input Slots
| 슬롯 | 형식 | 필수 | 소스 |
|---|---|---|---|
| ... | ... | ... | ... |

## 📤 Output
- \`output.md\` — 한 줄 설명

## 🔧 동작
1. 단계
2. 단계

## ✅ Validation
- 검증 기준 ...

## 📚 References
- \`references/foo.md\` — 설명
\`\`\`

### 3.4 references/assets/tests 배치

| 폴더 | 용도 | 예시 |
|---|---|---|
| references/ | 도메인 자료·룰·가이드 (참고) | \`axdd-design-system.md\` |
| assets/ | 산출물 템플릿 | \`component-spec-template.md\` |
| tests/ | 검증 체크리스트 | \`my-skill-check.md\` |
| scripts/ | 실행 스크립트 (선택) | \`process.py\` |

규칙:
- 한 level 깊이만 (\`references/sub/foo.md\` 금지)
- 모든 파일은 SKILL.md의 \`axdd.dependencies.files\`에 등재되어야 함

## 4. CATALOG.md 업데이트

루트 \`CATALOG.md\`의 해당 T-type 섹션에 추가:

\`\`\`md
## T2 — Reference-heavy
| Skill | Path | Purpose |
|---|---|---|
| My New Skill | \`skills/my-new-skill/\` | (one-line) |
\`\`\`

Index 표에도 추가.

## 5. 검증

\`\`\`bash
# 새 skill frontmatter 검증
python3 validation/axe_check.py validate-skill skills/my-new-skill

# 모든 skill 일괄 검증
for d in skills/*; do python3 validation/axe_check.py validate-skill "$d"; done

# Secret 패턴 스캔
python3 validation/axe_check.py scan-secrets skills

# Work Unit 검증 (Lite mode)
python3 validation/axe_check.py validate-workunit work-units/axdd-ux-ui-standard-kit --lite
\`\`\`

## 6. Work Unit에 skill 추가하기

\`work-units/<kit>/workunit.yaml\` 의 \`spec.requiredSkills\` 에 새 skill ID 추가:

\`\`\`yaml
spec:
  requiredSkills:
    - existing-skill-1
    - my-new-skill        # 추가
\`\`\`

\`spec.requiredArtifacts\` 에 새 skill의 출력 파일명도 등재.

## 7. Anti-patterns (피해야 할 것)

- ❌ 500+줄 SKILL.md 본문 → \`references/\`로 분리
- ❌ 중첩 폴더 (\`references/sub/topic.md\`) → 한 단계만
- ❌ 인라인 hex 값 (\`#FF0000\`) → 토큰 사용
- ❌ description 1024자 초과 → 줄이거나 \`references/\` 활용
- ❌ external URL 직접 노출 → reference 파일로 정리
- ❌ metadata 값에 YAML array / object → 콤마 구분 string 사용

## 8. 도움말

- 표준 spec: https://agentskills.io/specification
- Validation 로그 양식: \`validation/validation-log-template.md\`
- 운영 룰: \`governance-lite/\`

---

Generated by AXDD SkillOps Console — Enterprise Lite Export.
`;
}

/* ═══════════════════════════════════════════════════════════════
 * Phase 7-G — 운영 하네스 레이어 (CLAUDE.md / AGENTS.md / Cursor / routing)
 * ═══════════════════════════════════════════════════════════════ */

function buildClaudeMd(skills: Skill[], kits: CompositeKit[]): string {
  const skillBullets = skills
    .map((s) => `- \`skills/${s.id}/\` — ${s.description}`)
    .join("\n");
  const kitBullets = kits
    .map((k) => `- \`work-units/${k.id}/\` — ${k.description}`)
    .join("\n");

  return `# CLAUDE.md — AXDD UX/UI Enterprise Skill Repository

You are working inside an **AXDD UX/UI Enterprise Skill Repository**.
사용자가 skill 이름을 몰라도 자연어로 요청하면 자동으로 적절한 skill을 선택해 실행해야 합니다.

## First actions

UX/UI 요청을 받으면 다음 순서로 진행:

1. **\`CATALOG.md\` 읽기** — 사용 가능한 skill 목록 파악
2. **\`routing/routing-rules.md\` 적용** — 사용자 요청 → skill 매핑
3. **선택된 \`skills/<skill-name>/SKILL.md\` 검사**
4. **광범위·end-to-end 요청이면** \`work-units/axdd-ux-ui-standard-kit/workunit.yaml\` 사용
5. **모호하지 않는 한 사용자에게 skill 선택을 묻지 말 것**

## Response protocol

모든 UX/UI 작업의 응답은 다음 헤더로 시작:

\`\`\`
Selected skill:
Reason:
Referenced files:
Output format:
\`\`\`

그 다음 본 산출물을 produce.

## Routing principles (간단 룰 — 자세한 건 routing/routing-rules.md)

- 화면·대시보드·관리자 UI → \`ui-element-extract-skill\` + \`sample-screen-design-skill\`
- 컴포넌트 spec / props / states → \`component-spec-write-skill\`
- IA·메뉴 구조·navigation → \`ia-build-skill\`
- 워크플로·승인 흐름·상태 전이 → \`user-flow-design-skill\`
- 디자인 토큰·UI Foundation → \`ui-foundation-build-skill\`
- **고객사 DS·브랜드 가이드·token 표** → \`design-system-ingest-skill\` (Phase 7-G 신규)
- Figma AI / 수동 작업 지시서 → \`figma-prompt-build-skill\`
- React / TypeScript / Cursor 핸드오프 → \`handoff-merge-skill\`
- 전체 UX/UI 패키지 → \`work-units/axdd-ux-ui-standard-kit/\`

## Output rules

- ❌ Generic UX advice 금지
- ✅ Enterprise UX/UI 산출물 (states / permissions / validation / error case / handoff note)
- ✅ 디자인 토큰만 사용 (인라인 hex 금지)
- ✅ 고객사 DS 인풋 없으면 **AXDD base design system** 사용 (\`skills/ui-element-extract-skill/references/axdd-design-system.md\`)
- ✅ 고객사 DS 인풋 있으면 **AXDD 토큰으로 매핑** 후 사용 (\`design-system-ingest-skill\`)
- ✅ Figma MCP 미가용 가정 — Figma AI 수동 작업 지시서로 fallback

## 자연어 사용 예시

다음 같이 말해도 자동 라우팅됩니다 — 사용자가 skill ID 알 필요 없음:

- "사내 권한 승인 관리 화면을 설계해줘."
- "운영팀이 쓰는 장애 대응 대시보드를 만들어줘."
- "사내 AI 서비스 비용/사용량 모니터링 화면을 설계해줘."
- "우리 회사 디자인 시스템 기준으로 관리자 화면을 만들어줘."
- "Primary는 deep blue, Card radius 12px, Dense table 지원. 컴포넌트 spec 만들어줘."
- "Figma MCP 막혀있어. Figma AI에 붙여넣을 수 있는 수동 작업 지시서로."
- "React + TypeScript 구현 핸드오프 문서로 정리해줘."

## Available skills (${skills.length}개)

${skillBullets}

## Work Units / Composite kits (${kits.length}개)

${kitBullets}

## 검증 (사용자가 산출물 받은 후)

\`\`\`bash
# 모든 skill frontmatter 검증
for d in skills/*; do python3 validation/axe_check.py validate-skill "$d"; done

# Workunit 검증 (Lite 모드)
python3 validation/axe_check.py validate-workunit work-units/axdd-ux-ui-standard-kit --lite
\`\`\`

---

생성 출처: AXDD SkillOps Console (Phase 7-G)
표준: agentskills.io / AxDD-SKILLS reference 호환
`;
}

function buildAgentsMd(skills: Skill[], kits: CompositeKit[]): string {
  return `# AGENTS.md — AXDD UX/UI Agents

본 저장소의 agent contract. Claude Code / Cursor / Codex 모두 이 contract를 따른다.

## Default Agent

### axdd-ux-ui-router

| | |
|---|---|
| Purpose | 사내 enterprise UX/UI 자연어 요청을 적절한 AXDD skill로 자동 라우팅 |
| Inputs | natural language UX/UI request · optional screen description · optional design system / brand guide · optional handoff target |
| Outputs | Selected skill · Reason · Referenced files · UX/UI artifact |
| Skill ID 노출 | 사용자에게 묻지 않음 — 자동 선택 |
| Generic 자문 | 금지 — enterprise 산출물만 |
| 디자인 토큰 사용 | 필수 (인라인 hex 금지) |

## Available skills (${skills.length}개)

${skills.map((s) => `- \`${s.id}\``).join("\n")}

## Composite kits (${kits.length}개)

${kits.map((k) => `- \`${k.id}\` — ${k.description}`).join("\n")}

## Workunit mode

다음 요청 패턴이면 워크유닛 사용:

- "처음부터 끝까지", "전체 UX/UI 설계", "전체 패키지", "요구사항부터 핸드오프까지"
- "full UX/UI design", "end-to-end process", "complete admin console design package"

대상: \`work-units/axdd-ux-ui-standard-kit/workunit.yaml\`

## Agent behavior contract

1. **자동 선택**: 사용자에게 skill ID 묻지 않음. routing-rules.md 적용.
2. **응답 헤더 필수**: \`Selected skill\` / \`Reason\` / \`Referenced files\` / \`Output format\`
3. **참조 파일 명시**: 사용한 \`references/\`, \`assets/\` 모두 응답에 인용
4. **디자인 시스템 우선**: 고객사 DS 인풋 있으면 \`design-system-ingest-skill\` 먼저
5. **MCP 미가정**: Figma·기타 MCP 사용 가능 가정 금지. 막힌 환경 fallback 우선
6. **출처 명시**: 모든 산출물에 DS 출처 (\`customer\` / \`axdd-internal\` / \`fallback\`)

## Routing priority (자세한 룰)

\`routing/routing-rules.md\` 참조.

## Validation

- \`validation/axe_check.py validate-skill\` — frontmatter 형식
- \`validation/axe_check.py validate-workunit --lite\` — 워크유닛 Lite 호환
- \`validation/axe_check.py scan-secrets\` — secret 패턴

## Tool 어댑터

| Tool | 진입 파일 |
|---|---|
| Claude Code | \`CLAUDE.md\` (이 저장소 루트) |
| Cursor | \`.cursor/agents/axdd-ux-ui-router.md\` |
| Codex | (별도 어댑터 필요 — Phase 7+ 이후) |

---

생성 출처: AXDD SkillOps Console (Phase 7-G)
`;
}

function buildCursorAgent(): string {
  return `# AXDD UX/UI Router Agent

You are a **Cursor agent** for the AXDD UX/UI Enterprise Skill Repository.

## Job

When the user asks for UX/UI work, route the request to the correct skill in \`skills/\`.

## Steps

1. **Read \`CATALOG.md\`** — list of available skills with T1~T8 grouping
2. **Read \`routing/routing-rules.md\`** — intent → skill mapping
3. **Choose the best skill or workunit**
4. **Read the selected \`SKILL.md\`** — purpose, input slots, output, references
5. **Use referenced \`references/\`, \`assets/\`, \`tests/\`** in that skill folder
6. **Produce the requested UX/UI artifact**

## Do not

- ❌ Do not ask the user to choose a skill ID
- ❌ Do not give generic UX advice
- ❌ Do not ignore design system files
- ❌ Do not assume Figma MCP is available
- ❌ Do not use raw color hex if a token exists in \`design_tokens.json\`
- ❌ Do not skip the response header

## Required response header

\`\`\`
Selected skill:
Reason:
Referenced files:
Output:
\`\`\`

## Skill selection cheatsheet

| 사용자 요청 패턴 | 선택할 skill |
|---|---|
| "화면 설계", "대시보드", "관리자 콘솔" | \`ui-element-extract-skill\` + \`sample-screen-design-skill\` |
| "디자인 시스템", "토큰", "브랜드 가이드", "Tailwind config" | \`design-system-ingest-skill\` |
| "컴포넌트 spec", "props", "states", "variants" | \`component-spec-write-skill\` |
| "IA", "메뉴 구조", "사이트맵" | \`ia-build-skill\` |
| "플로우", "승인 흐름", "상태 전이" | \`user-flow-design-skill\` |
| "Figma AI", "수동 작업 지시서" | \`figma-prompt-build-skill\` |
| "개발 핸드오프", "React", "TypeScript" | \`handoff-merge-skill\` |
| "전체 UX/UI 설계", "처음부터 끝까지" | \`work-units/axdd-ux-ui-standard-kit\` |

## 예시 응답

사용자: "사내 권한 승인 관리 화면을 설계해줘"

\`\`\`
Selected skill: ui-element-extract-skill + sample-screen-design-skill
Reason: 사내 운영 화면 설계 요청 — 사용 가능한 UI 요소 추출 후 화면 wireframe 작성
Referenced files:
  - skills/ui-element-extract-skill/references/axdd-design-system.md (AXDD 베이스 DS)
  - skills/ui-element-extract-skill/references/element-categorization.md (요소 분류)
  - skills/sample-screen-design-skill/assets/wireframe-template.md (와이어프레임 양식)
Output: 권한 승인 관리 화면 — ASCII wireframe + 영역별 컴포넌트·토큰 매핑

(아래에 실제 산출물 본문)
\`\`\`

## 검증

산출물 생성 후 사용자에게 안내:

\`\`\`bash
# 새 산출물이 SKILL.md frontmatter 룰을 위반하지 않는지 확인
python3 validation/axe_check.py validate-skill skills/<used-skill>
\`\`\`

---

생성 출처: AXDD SkillOps Console (Phase 7-G)
`;
}

function buildRoutingRules(): string {
  return `# Routing Rules

> AXDD UX/UI Enterprise Skill Repository — 자연어 요청을 적절한 skill로 라우팅하는 룰.
> \`CLAUDE.md\` / \`AGENTS.md\` / \`.cursor/agents/axdd-ux-ui-router.md\` 모두 이 파일을 참조.

## 룰 형식

각 룰은:
- **Triggers**: 사용자 입력에 등장할 수 있는 키워드·패턴
- **Route**: 매칭 시 실행할 skill ID (단일 또는 다중)

여러 룰이 동시 매칭되면 우선순위는 위에서 아래.

---

## 1. End-to-end (최우선)

### Triggers
- 처음부터 끝까지
- 전체 UX/UI 설계
- 전체 패키지
- 요구사항부터 핸드오프까지
- full UX/UI design
- end-to-end process
- complete admin console design package

### Route
- \`work-units/axdd-ux-ui-standard-kit\`

---

## 2. Design System / Tokens / Brand (Phase 7-G 우선순위 상승)

### Triggers
- 디자인 시스템
- 브랜드 가이드
- 토큰
- token table
- UI Foundation
- 컬러 / 타이포 / spacing
- Tailwind config
- Figma library
- design system ingestion
- 우리 회사 디자인 시스템
- 고객사 디자인 시스템
- Primary color는 ...
- Card radius 12px

### Route
- **1차**: \`design-system-ingest-skill\` (DS 인풋 ingest)
- **2차**: \`ui-foundation-build-skill\` (토큰 풀세트 정의)

---

## 3. Requirement / Brief

### Triggers
- 요구사항
- 화면 목적
- 기능 정리
- 사용자 니즈
- 범위 정리
- PRD
- requirement
- brief

### Route
- \`ui-ux-requirement-extract-skill\`

---

## 4. Screen / Dashboard / Admin UI

### Triggers
- 화면 설계
- 대시보드
- 관리자 콘솔
- 운영 화면
- 목록 / 상세 화면
- admin UI
- monitoring dashboard
- 모니터링 화면
- 비용 / 사용량 모니터링
- 권한 관리 화면
- 장애 대응 대시보드

### Route
- \`ui-element-extract-skill\` (UI 요소 추출)
- \`sample-screen-design-skill\` (와이어프레임)

---

## 5. Component Spec

### Triggers
- 컴포넌트 명세
- props
- states
- variants
- React 컴포넌트
- Tailwind 컴포넌트
- Storybook
- design system 컴포넌트 추가

### Route
- \`component-spec-write-skill\`

---

## 6. User Flow / Workflow

### Triggers
- 플로우
- 사용자 플로우
- 워크플로
- 승인 흐름
- 처리 흐름
- 상태 전이
- 사용자 여정
- approval flow
- ticket flow
- state machine

### Route
- \`user-flow-design-skill\`

---

## 7. Information Architecture (IA)

### Triggers
- IA
- 정보 구조
- 메뉴 구조
- sitemap
- navigation
- 라우트 구조
- 사이드바 메뉴

### Route
- \`ia-build-skill\`

---

## 8. UX Process Definition

### Triggers
- UX 프로세스
- Double Diamond
- 페르소나
- 사용자 인터뷰
- journey map
- 사용자 조사

### Route
- \`ux-process-define-skill\`

---

## 9. Figma Instruction (MCP 미가용 전제)

### Triggers
- Figma
- Figma AI
- Make Designs
- First Draft
- MCP 차단
- MCP 막혀
- 수동 작업 지시서
- 프레임 구성
- Figma Variables

### Route
- \`figma-prompt-build-skill\` (수동 작업 지시서)
- 또는 \`design-system-ingest-skill\` (Figma Variables 매핑 시)

---

## 10. Developer Handoff

### Triggers
- 개발 핸드오프
- 핸드오프
- Cursor 프롬프트
- React + TypeScript
- JSZip
- 구현 문서
- developer notes
- implementation handoff

### Route
- \`handoff-merge-skill\`

---

## 11. Validation (AXDD Extension)

### Triggers
- 산출물 검증
- frontmatter 검사
- axe_check
- workunit 검증
- secret scan

### Route
- \`validation/axe_check.py\` CLI 직접 안내 (skill 아님)

---

## 매칭 모호 시 처리

1. **2개 이상 룰이 동시 매칭** → 위에서 아래 순서 우선
2. **어떤 룰도 매칭 안 됨** → \`ui-ux-requirement-extract-skill\` 부터 시작 (요구사항 정리)
3. **사용자 요청이 매우 광범위** → workunit 사용
4. **DS 인풋 없이 "디자인 시스템" 요청** → \`design-system-ingest-skill\` + AXDD 베이스 폴백

## Routing 응답 contract

라우팅이 성공하면 agent는 다음 형식으로 응답:

\`\`\`
Selected skill: <skill-id>
Reason: <왜 이걸 선택했는지 한 줄>
Referenced files:
  - <reference 파일 경로>
  - <asset 파일 경로>
Output format: <md / json / 등>

(산출물 본문)
\`\`\`

---

생성 출처: AXDD SkillOps Console (Phase 7-G)
`;
}

const VALIDATION_LOG_TEMPLATE = `# Validation Log

| Date | Skill / Work Unit | Command | Result | Reviewer |
|------|-------------------|---------|--------|----------|
| YYYY-MM-DD | <name> | \`validate-skill\` | PASS | <owner> |

## Notes

- 각 PR 머지 전 \`axe_check.py\` 실행 결과를 본 파일에 누적 기록.
- FAIL인 경우 사유 + 재검토 일정 명시.
- 외부 URL 정책(1차 차단)에 의해 reject된 경우 별도 표시.
`;

const EXAMPLES_README = `# Examples

이 폴더는 표준 사용 시나리오 / 도구별 실행 로그 / 산출물 샘플을 모으는 자리입니다.

## 사용 시나리오

1. **AXDD UX/UI Standard Kit 실행**
   - 요구사항 MD 1개 → 11개 atomic skill 순차 실행 → 마스터 핸드오프 풀세트

2. **단일 skill 호출**
   - 예: \`ui-element-extract\` 만으로 화면 1장에서 UI 요소 후보 추출

## 추가 자료

\`work-units/axdd-ux-ui-standard-kit/SKILL.md\` 의 "When to use" 섹션 참조.
`;
