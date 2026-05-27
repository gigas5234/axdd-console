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
  root.file(
    "AGENT_CREATION_GUIDE.md",
    await tryReadOrFallback(
      path.join(cwd, REFERENCE_DIR, "AGENT_CREATION_GUIDE.md"),
      "# Agent Creation Guide\n\n(reference 자산 미존재)",
    ),
  );

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

  // ─── 4. governance-lite/ (reference에서 정적 복사) ───
  const govFolder = root.folder("governance-lite");
  if (govFolder) {
    const govSrcDir = path.join(cwd, REFERENCE_DIR, "governance-lite");
    await copyDir(govFolder, govSrcDir);
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

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
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

      // 3차: 스켈레톤 자동 생성 (회의록 정합)
      if (content === null) {
        content = buildSkeletonContent(sub, basename, skill);
      }

      subFolder.file(basename, content);
    }
  }
}

/**
 * imaginary path에 대해 자립적으로 동작 가능한 스켈레톤 컨텐츠 생성.
 * Claude Code가 zip을 풀어 사용할 때 "파일이 없어 못 읽음" 상황 회피.
 */
function buildSkeletonContent(
  sub: "references" | "assets" | "scripts" | "tests",
  basename: string,
  skill: Skill,
): string {
  const header = `<!--
  Skeleton file auto-generated by AXDD SkillOps Console.

  실제 자료가 채워질 자리입니다. 디자인팀/QA팀이 이 파일을 직접 편집해
  자료를 채우거나, 다른 reference로 교체하세요.

  Skill: ${skill.id}
  File:  ${sub}/${basename}
-->

`;

  switch (sub) {
    case "references":
      return header + buildReferenceSkeleton(basename, skill);
    case "assets":
      return header + buildAssetSkeleton(basename, skill);
    case "scripts":
      return header + buildScriptSkeleton(basename, skill);
    case "tests":
      return header + buildTestSkeleton(basename, skill);
  }
}

function buildReferenceSkeleton(basename: string, skill: Skill): string {
  // 파일명별로 의미 있는 스켈레톤 분기
  if (/design-system/i.test(basename)) {
    return `# Design System Reference (Scaffold)

> 상태: **scaffold** — 디자인팀이 실제 자료를 채워야 합니다.
> 참조 스킬: \`${skill.id}\`

## 1. Color Tokens

<!-- TODO: 디자인팀에서 토큰 채우기 -->

| Token | Hex | Usage |
|---|---|---|
| \`color/brand/primary\` | \`#__TODO__\` | 메인 액션 |
| \`color/brand/accent\` | \`#__TODO__\` | 강조 액션 |
| \`color/surface/base\` | \`#__TODO__\` | 페이지 배경 |
| \`color/surface/elevated\` | \`#__TODO__\` | 카드 배경 |
| \`color/ink/primary\` | \`#__TODO__\` | 본문 텍스트 |
| \`color/ink/secondary\` | \`#__TODO__\` | 보조 텍스트 |
| \`color/border/default\` | \`#__TODO__\` | 기본 보더 |
| \`color/status/success\` | \`#__TODO__\` | 성공 |
| \`color/status/warning\` | \`#__TODO__\` | 경고 |
| \`color/status/error\` | \`#__TODO__\` | 에러 |

## 2. Typography

| Scale | Size | Line-height | Usage |
|---|---|---|---|
| \`text/h1\` | \`__TODO__\` | \`__TODO__\` | 페이지 헤더 |
| \`text/h2\` | \`__TODO__\` | \`__TODO__\` | 섹션 |
| \`text/body\` | \`__TODO__\` | \`__TODO__\` | 본문 |
| \`text/caption\` | \`__TODO__\` | \`__TODO__\` | 캡션 |

## 3. Spacing (4의 배수)

| Token | Value |
|---|---|
| \`space/xs\` | \`4px\` |
| \`space/sm\` | \`8px\` |
| \`space/md\` | \`12px\` |
| \`space/lg\` | \`16px\` |
| \`space/xl\` | \`24px\` |

## 4. Components (이름만 — 상세는 component-spec-write-skill 산출물 참조)

- Button (primary / secondary / ghost)
- Card (default / elevated)
- Input (text / search / number)
- Modal (sm / md / lg)
- Toast (success / warning / error / info)
`;
  }
  if (/keyword|categoriz|patterns/i.test(basename)) {
    return `# ${basename.replace(/\.md$/, "").replace(/-/g, " ")}

> 상태: **scaffold**
> 참조 스킬: \`${skill.id}\`

## 분류 룰 (TODO: 실제 룰 채우기)

| 카테고리 | 키워드 / 패턴 | 비고 |
|---|---|---|
| (TODO) | (TODO) | (TODO) |

## 예시

(TODO)
`;
  }
  if (/method|process|guide/i.test(basename)) {
    return `# ${basename.replace(/\.md$/, "").replace(/-/g, " ")}

> 상태: **scaffold**
> 참조 스킬: \`${skill.id}\`

## 방법론 / 가이드 (TODO)

(이 파일은 reference 자료로 진행 시 필요할 룰·가이드를 담는 자리입니다.)
`;
  }
  return `# ${basename.replace(/\.md$/, "").replace(/-/g, " ")} (Scaffold)

> 상태: **scaffold** — 실제 자료가 채워질 자리입니다.
> 참조 스킬: \`${skill.id}\`

## TODO

이 파일에 채워질 내용:
- (TODO: 채워주세요)

## 사용 시점

스킬 \`${skill.id}\`이 이 reference를 참조합니다. 상세는 상위 SKILL.md 참조.
`;
}

function buildAssetSkeleton(basename: string, skill: Skill): string {
  // 템플릿 자산 — placeholder 표
  if (/template/i.test(basename)) {
    return `# ${basename.replace(/\.md$/, "").replace(/-/g, " ")} Template

> 상태: **scaffold template**
> 참조 스킬: \`${skill.id}\`

## 사용법

이 템플릿을 복사해 placeholder를 채우세요. \`{{UPPER_SNAKE}}\` 형식.

---

# {{PROJECT_NAME}}

## Overview
{{OVERVIEW}}

## Sections
- {{SECTION_1}}
- {{SECTION_2}}
- {{SECTION_3}}

## Metadata
- Owner: {{OWNER}}
- Status: {{STATUS}}
- Date: {{DATE}}
`;
  }
  return `# ${basename.replace(/\.md$/, "").replace(/-/g, " ")}

> 상태: **scaffold asset**
> 참조 스킬: \`${skill.id}\`

(TODO: 실제 자산 컨텐츠 채우기)
`;
}

function buildScriptSkeleton(basename: string, _skill: Skill): string {
  if (basename.endsWith(".py")) {
    return `#!/usr/bin/env python3
"""${basename} — Scaffold script.

실제 로직이 채워질 자리입니다. 다음 패턴을 따르세요:

  - argparse로 입력 받기
  - JSON으로 출력 (stdout)
  - 실패 시 non-zero exit
  - secret 패턴 금지
"""

import sys


def main() -> int:
    print("TODO: implement", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
`;
  }
  if (basename.endsWith(".html")) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${basename}</title>
</head>
<body>
  <h1>${basename} (Scaffold)</h1>
  <p>TODO: 실제 컨텐츠 채우기</p>
</body>
</html>
`;
  }
  return `# ${basename} (scaffold)\n\n# TODO: 채우기\n`;
}

function buildTestSkeleton(basename: string, skill: Skill): string {
  return `# ${basename.replace(/\.md$/, "").replace(/-/g, " ")}

> 상태: **scaffold test**
> 참조 스킬: \`${skill.id}\`

## 체크리스트

- [ ] (TODO: 검증 항목 1)
- [ ] (TODO: 검증 항목 2)
- [ ] (TODO: 검증 항목 3)

## Pass 기준

- 모든 항목 체크
- \`python3 ../../validation/axe_check.py validate-skill ../\` 통과

## 실패 시 처리

- 사유를 \`validation-log-template.md\` 형식으로 기록
- 해당 산출물 Reject 후 재실행
`;
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

function defaultCompositeKits(workUnits: WorkUnit[]): CompositeKit[] {
  const uxui = workUnits.find((w) => w.id === "ux-ui-planning-workunit");
  if (!uxui) return [];
  return [
    {
      id: "axdd-ux-ui-standard-kit",
      name: "AXDD UX/UI Standard Kit",
      description:
        "AXDD 전사 내부 프로젝트에서 UX/UI 표준 산출물 세트를 한 번에 뽑는 composite kit. 10개 atomic skill 순차 실행 후 마스터 핸드오프 + Figma 프롬프트까지 생성.",
      requiredSkillIds: uxui.skills,
      outputs: uxui.output,
      category: "ux-ui",
    },
  ];
}

function buildWorkUnitYaml(kit: CompositeKit): string {
  // AxDD-SKILLS reference의 workunit.yaml과 호환되는 형태
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
    `  requiredSkills:`,
    ...kit.requiredSkillIds.map((s) => `    - ${s}`),
    `  outputs:`,
    ...(kit.outputs ?? []).map((o) => `    - ${o}`),
    `  closureCriteria:`,
    `    - required_skills_exist`,
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

### Claude Code 설치

\`\`\`bash
# 전체 스킬을 ~/.claude/skills/ 에 복사
cp -r skills/* ~/.claude/skills/

# 또는 특정 work-unit (composite kit) 만
cp -r work-units/axdd-ux-ui-standard-kit/ ~/.claude/skills/
\`\`\`

### Cursor 설치

\`\`\`bash
# .cursor/skills/ 에 복사 또는 symlink
ln -s "$(pwd)/skills" ~/.cursor/skills/axdd-skills
\`\`\`

### 검증

\`\`\`bash
for d in skills/*; do
  python3 validation/axe_check.py validate-skill "$d"
done

for d in work-units/*; do
  python3 validation/axe_check.py validate-workunit "$d"
done
\`\`\`

## 포함된 자산

- **Atomic Skills** (${includedSkills.length}개) — \`skills/\`
- **Composite Kits** (${compositeKits.length}개) — \`work-units/\`
- **Governance Rules** — \`governance-lite/\`
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
   - 요구사항 MD 1개 → 10개 atomic skill 순차 실행 → 마스터 핸드오프 풀세트

2. **단일 skill 호출**
   - 예: \`ui-element-extract\` 만으로 화면 1장에서 UI 요소 후보 추출

## 추가 자료

\`work-units/axdd-ux-ui-standard-kit/SKILL.md\` 의 "When to use" 섹션 참조.
`;
