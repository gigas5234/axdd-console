/**
 * Work Unit Bundle 빌더 — 서버사이드.
 *
 * **Anthropic Skills 표준 구조** — Claude Code의 `~/.claude/skills/`에 바로 풀 수 있음.
 *
 * Work Unit을 **단일 Skill로 패키징**한다. 5개 내부 sub-skill은 워크플로 단계가
 * 되어 master SKILL.md에 문서화되고, 각 sub-skill의 references/assets/scripts/tests는
 * 상위 폴더에 통합된다.
 *
 * 구조:
 *   {workunit-id}/                       ← Claude Code skill 폴더명
 *   ├── SKILL.md                          ← Master (frontmatter name·description 필수)
 *   ├── CATALOG.md                        ← 내부 sub-skill / references / assets 인덱스
 *   ├── README.md                         ← 사람 읽는 시작 문서
 *   ├── work-unit.json                    ← 머신 정의
 *   ├── result/                           ← 이번 실행 산출물 (옵션)
 *   ├── references/                       ← 통합 참고자료
 *   ├── scripts/                          ← 통합 실행 스크립트
 *   ├── assets/                           ← 통합 템플릿
 *   ├── tests/                            ← 통합 검증 룰
 *   ├── examples/                         ← 도메인별 샘플 출력 4종
 *   └── _dev/                             ← (옵션) Next.js TS 구현 참조
 *       ├── README.md
 *       ├── _runtime/                     ← 공유 런타임 8개
 *       └── skills/<sub-skill-id>/        ← 원본 sub-skill 폴더 (SKILL.md + ts)
 *
 * 사용:
 *   cp -r ux-ui-planning-workunit/ ~/.claude/skills/
 *   → Claude Code가 SKILL.md frontmatter로 자동 인식
 */

import { promises as fs } from "fs";
import path from "path";
import JSZip from "jszip";
import type { Skill, WorkUnit, Hook } from "./types";
import { hooks } from "./data";
import {
  buildIntentMd,
  buildManifest,
  buildResultReadme,
  buildValidationMd,
  type ResultPayload,
} from "./result-builders";
import { buildHandoffMerge } from "@/skills/fullstep/handoff-merge-skill/mock-output";
import { buildKickoffReport } from "@/skills/template/kickoff-report-template-skill/mock-output";
import { buildUiFoundation } from "@/skills/reference/ui-foundation-build-skill/mock-output";
import { buildUxProcessDefine } from "@/skills/asset/ux-process-define-skill/mock-output";
import type { Domain, RunIntent } from "@/skills/_runtime/intent";

const RUNTIME_FILES = [
  "types.ts",
  "helpers.ts",
  "llm-client.ts",
  "intent.ts",
  "clarifying.ts",
  "domain-profiles.ts",
  "system-rules.ts",
];

const SKILL_CODE_FILES = ["prompt.ts", "runner.ts", "mock-output.ts"];

async function tryRead(absPath: string): Promise<string | null> {
  try {
    return await fs.readFile(absPath, "utf-8");
  } catch {
    return null;
  }
}

/** Workunit별 hook 찾기 (트리거 키워드 표시용) */
function findHook(workUnit: WorkUnit): Hook | undefined {
  const hookId = workUnit.triggerHooks[0];
  return hooks.find((h) => h.id === hookId);
}

/* ────────────────────────────────────────────────────────────
 *  Master SKILL.md — frontmatter + 워크플로 + 참조 인덱스
 * ──────────────────────────────────────────────────────────── */

function buildMasterSkillMd(workUnit: WorkUnit, skills: Skill[]): string {
  const hook = findHook(workUnit);
  const subSkills = workUnit.skills
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => !!s);

  return `---
name: ${workUnit.id}
description: ${workUnit.description}
version: 1.0.0
category: workunit
owner: ${workUnit.owner}
---

# ${workUnit.name}

> ${workUnit.description}

## 🛡 Domain Preservation (최우선 규칙)

사용자 요청에 명시된 도메인·제품 유형·타깃 사용자·톤앤매너를 **모든 산출물에서 일관 유지**하라.

### 금지
- 내부 예시(AXDD SkillOps Console 등 다른 도메인 카탈로그) 컨텍스트를 가져와 산출물 도메인을 덮어쓰는 것
- 사용자 도메인을 일반론으로 흐리는 것

### 5개 지원 도메인
- 헬스케어 (신뢰·차분 / 청록·sky)
- 핀테크 (전문성·정확 / 짙은 청·골드)
- 이커머스 (트렌디·활발 / 코랄·핑크)
- 어드민 (효율·차분 / 청·슬레이트)
- SaaS (미니멀 / 인디고·시안)

자세한 도메인 프로필은 \`references/domain-profiles.md\` 참조.

## When to Use

다음 조건에서 활성화:
${hook ? `- **키워드 매칭**: ${hook.conditions.keywords.map((k) => `\`${k}\``).join(", ")}` : ""}
- **자연어 의도**: 사용자가 도메인 + 작업 범위(IA / 디자인 시스템 / 컴포넌트 / Figma 핸드오프 등)를 언급할 때
- **단독 호출**: \`${workUnit.id}\` 명시 호출

## Workflow — ${subSkills.length}단계

이 스킬은 다음 단계를 순서대로 실행한다.

${subSkills
  .map(
    (s, i) => `### Step ${i + 1}. ${s.name}
${s.description}

- **Input**: ${s.input.map((x) => `\`${x}\``).join(", ")}
- **Output**: ${s.output.map((x) => `\`${x}\``).join(", ")}
- **카테고리**: ${s.category}`,
  )
  .join("\n\n")}

## Input

이 스킬은 다음 입력을 받는다:
${workUnit.input.map((i) => `- \`${i}\``).join("\n")}

자연어 프롬프트로 도메인·톤·범위·일정 등을 자유롭게 입력할 수 있다.

## Output

다음 산출물을 생성한다:
${workUnit.output.map((o) => `- \`${o}\``).join("\n")}

## Validation

${workUnit.validationSkill ? `검증 스킬: \`${workUnit.validationSkill}\`` : ""}

검증은 2단계로 진행된다.

1. **형식 검증**: 필수 섹션 존재, 마크다운 표 구조, 컴포넌트 스펙 5종 이상
2. **의미 검증** (도메인 fit):
   - 사용자 요청 도메인 키워드 ≥ 5회 등장
   - 다른 도메인 누출 ≤ 3회
   - 산출물 상단에 도메인 명시

자세한 룰은 \`tests/\` 폴더 참조.

상태 (4-state):
- \`passed\` — 자동 검증 + 휴먼 리뷰 모두 OK
- \`passed-with-review\` — 자동 검증 OK, 휴먼 리뷰만 남음 (대부분의 정상 케이스)
- \`needs-review\` — warning 존재 (도메인 누출 등)
- \`failed\` — error 존재 (필수 섹션 누락 등)

## Files Index

| 폴더 | 내용 |
|---|---|
| \`references/\` | 디자인 시스템 · 도메인 프로필 · 검증 룰 등 참고자료 |
| \`scripts/\` | 실행 스크립트 (Python) |
| \`assets/\` | 산출물 템플릿 (markdown) |
| \`tests/\` | 검증 룰 정의 |
| \`examples/\` | 도메인별 산출물 샘플 (헬스케어 / 핀테크 / 이커머스 / 어드민) |
| \`_dev/\` | (옵션) Next.js TS 구현 참조 — Claude Code는 무시 |

전체 인덱스는 \`CATALOG.md\` 참조.

## Quick Start

자연어로 호출:
\`\`\`
"신규 헬스케어 SaaS 환자 대시보드를 기획해서 핸드오프 문서까지 만들어줘"
"엔터프라이즈 어드민 데이터 테이블 위주로 UX 기획 + 디자인 시스템 + 컴포넌트 스펙"
"패션 이커머스 모바일 MZ 타겟 풀세트"
\`\`\`

샘플 산출물은 \`examples/\` 폴더에서 확인.

---
패키지: AXDD SkillOps Console
Workunit ID: \`${workUnit.id}\`
`;
}

/* ────────────────────────────────────────────────────────────
 *  CATALOG.md — 통합 인덱스
 * ──────────────────────────────────────────────────────────── */

function buildCatalogMd(
  workUnit: WorkUnit,
  skills: Skill[],
  collected: { references: string[]; scripts: string[]; assets: string[]; tests: string[] },
): string {
  const subSkills = workUnit.skills
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => !!s);

  return `# Catalog — ${workUnit.name}

이 스킬에 포함된 모든 파일·sub-skill·자원의 인덱스.

## Sub-Skills (워크플로 단계)

이 스킬은 ${subSkills.length}개 sub-skill을 순차 실행해 최종 산출물을 만든다.
각 sub-skill의 원본 폴더는 \`_dev/skills/\`에 있다 (옵션).

| Step | Skill ID | Category | Description |
|---|---|---|---|
${subSkills
  .map(
    (s, i) =>
      `| ${i + 1} | \`${s.id}\` | ${s.category} | ${s.description} |`,
  )
  .join("\n")}

## References (\`references/\`)

산출물 생성 시 참조하는 자료.

${
  collected.references.length === 0
    ? "(없음)"
    : collected.references.map((f) => `- \`${f}\``).join("\n")
}

## Scripts (\`scripts/\`)

실행 스크립트.

${
  collected.scripts.length === 0
    ? "(없음)"
    : collected.scripts.map((f) => `- \`${f}\``).join("\n")
}

## Assets (\`assets/\`)

산출물 템플릿.

${
  collected.assets.length === 0
    ? "(없음)"
    : collected.assets.map((f) => `- \`${f}\``).join("\n")
}

## Tests (\`tests/\`)

검증 룰.

${
  collected.tests.length === 0
    ? "(없음)"
    : collected.tests.map((f) => `- \`${f}\``).join("\n")
}

## Examples (\`examples/\`)

도메인별 산출물 샘플 — Claude Code가 이 스킬을 어떻게 사용해야 하는지 학습하는 데 활용.

- \`healthcare-example.md\` — 헬스케어 SaaS 환자 대시보드
- \`fintech-example.md\` — 핀테크 모바일 앱
- \`ecommerce-example.md\` — 패션 이커머스 모바일
- \`admin-example.md\` — 엔터프라이즈 어드민

## Implementation Reference (\`_dev/\`)

선택사항. Claude Code는 이 폴더를 무시한다.

자신의 Next.js 프로젝트로 옮겨 실행 로직을 재현하려는 개발자만 참조.

- \`_dev/_runtime/\` — 공유 런타임 8개 모듈
- \`_dev/skills/<sub-skill-id>/\` — sub-skill 원본 (SKILL.md + prompt.ts + runner.ts + mock-output.ts)

---
패키지: AXDD SkillOps Console
Workunit ID: \`${workUnit.id}\`
`;
}

/* ────────────────────────────────────────────────────────────
 *  README.md — 첫 인상 (사람용)
 * ──────────────────────────────────────────────────────────── */

function buildTopReadme(workUnit: WorkUnit, hasResult: boolean): string {
  return `# ${workUnit.name}

> ${workUnit.description}

## 빠른 시작 — Claude Code에 설치하기

\`\`\`bash
# 통째로 ~/.claude/skills/ 아래에 풀기
cp -r ${workUnit.id}/ ~/.claude/skills/

# 또는 압축 푼 폴더 그대로 이동
mv ${workUnit.id} ~/.claude/skills/
\`\`\`

설치 후 Claude Code가 자동으로 \`SKILL.md\`의 frontmatter (\`name\`, \`description\`)로 트리거 매칭한다.

자연어로 호출:
\`\`\`
"신규 헬스케어 SaaS 환자 대시보드 기획해줘"
\`\`\`

## 무엇을 읽어야 하나

순서대로 읽으세요.

1. **\`SKILL.md\`** — Claude Code 진입점. 도메인 보존 규칙·워크플로·사용 시점.
2. **\`CATALOG.md\`** — 폴더 안의 모든 파일 인덱스.
3. **\`examples/\`** — 도메인별 산출물 샘플. Claude Code가 어떻게 동작하는지 시각화.
${
  hasResult
    ? "4. **`result/`** — 이번 Sandbox 실행에서 만들어진 실제 산출물.\n"
    : ""
}

## 도메인 보존 규칙 (가장 중요)

사용자가 요청한 도메인을 모든 산출물에 일관 유지한다.

- ✅ "헬스케어 SaaS" → 환자/의료진/복약/진료 컨텍스트로 작성
- ✅ "핀테크" → 송금/자산/KYC 컨텍스트
- ❌ AXDD SkillOps Console 같은 내부 카탈로그를 사용자 산출물에 가져오지 말 것

자세한 규칙은 \`references/domain-preservation-rule.md\` 또는 \`SKILL.md\` 상단.

## LLM 활성화

기본 모드는 mock (각 도메인별 정적 템플릿).

실제 LLM (Claude API)으로 동적 생성하려면:
1. \`_dev/_runtime/llm-client.ts\` 확인
2. \`ANTHROPIC_API_KEY\` 환경변수 설정
3. \`withLlmOrMock\` 헬퍼가 자동 분기

## Anthropic Skills 표준 준수

이 폴더는 [Anthropic Skills](https://docs.anthropic.com) 표준을 따른다.

- \`SKILL.md\` frontmatter (\`name\`, \`description\`) ✅
- \`references/\` · \`scripts/\` · \`assets/\` · \`tests/\` · \`examples/\` ✅
- 외부 alias 의존성 0 ✅

---
패키지 출처: AXDD SkillOps Console
`;
}

/* ────────────────────────────────────────────────────────────
 *  examples/ — 도메인별 샘플 생성
 * ──────────────────────────────────────────────────────────── */

const EXAMPLE_DOMAINS: Array<{
  domain: Domain;
  productType: RunIntent["productType"];
  tone: RunIntent["tone"];
  prompt: string;
  filename: string;
}> = [
  {
    domain: "ds-bootstrap",
    productType: "design-system",
    tone: "전문성",
    prompt:
      "Case A · AXDD 자체 디자인 시스템 부트스트랩 — 토큰·공용 컴포넌트 초안 풀세트 생성. 결과물은 data/our-design-system.md 후보.",
    filename: "case-a-ds-bootstrap.md",
  },
  {
    domain: "axdd-internal",
    productType: "admin-tool",
    tone: "효율",
    prompt:
      "Case B · 사내 어드민 신규 화면 추가 — AXDD DS 토큰 차용 + IA + 컴포넌트 스펙 + 핸드오프 풀세트.",
    filename: "case-b-axdd-internal.md",
  },
  {
    domain: "customer-project",
    productType: "customer-deliverable",
    tone: "엔터프라이즈",
    prompt:
      "Case C · 외부 고객사 프로젝트 수행 — 고객사 DS 차용 + AXDD 핸드오프 표준 유지.",
    filename: "case-c-customer-project.md",
  },
  {
    domain: "generic",
    productType: "documentation",
    tone: "미니멀",
    prompt:
      "Case D · 요구사항만 정리 — UI/UX 요구사항 1페이지 요약부터 시작 (이후 Case A/B로 전이).",
    filename: "case-d-requirement-only.md",
  },
];

function buildExampleIntent(
  domain: Domain,
  productType: RunIntent["productType"],
  tone: RunIntent["tone"],
  prompt: string,
): RunIntent {
  return {
    domain,
    productType,
    tone,
    scope: {
      needsRequirementSummary: true,
      needsIA: true,
      needsUserFlow: true,
      needsDesignSystem: true,
      needsComponentSpec: true,
      needsHandoff: true,
      needsKickoffReport: false,
      needsCICD: false,
      needsDsBootstrap: domain === "ds-bootstrap",
    },
    unknowns: [],
    rawPrompt: prompt,
    confidence: 0.95,
    detectedKeywords: [],
    mode: "heuristic",
  };
}

function buildExamplesForWorkUnit(workUnit: WorkUnit): Record<string, string> {
  const examples: Record<string, string> = {};

  for (const ex of EXAMPLE_DOMAINS) {
    const intent = buildExampleIntent(
      ex.domain,
      ex.productType,
      ex.tone,
      ex.prompt,
    );
    const input = { prompt: ex.prompt, inputs: {}, context: { intent } };

    let body: string;
    if (workUnit.id === "ux-ui-planning-workunit") {
      // 마스터 핸드오프(common-end의 첫 산출물)만으로도 도메인 fit 시연 충분
      body = buildHandoffMerge(input);
    } else if (workUnit.id === "kickoff-report-workunit") {
      body = buildKickoffReport(input);
    } else {
      // 다른 워크유닛: UI Foundation + UX Process 조합
      body = `# ${ex.domain} 도메인 샘플\n\n## 디자인 시스템 토큰\n${buildUiFoundation(input)}\n\n---\n\n## UX 프로세스\n${buildUxProcessDefine(input)}`;
    }

    const header = `<!-- 도메인: ${ex.domain} · productType: ${ex.productType} · 톤: ${ex.tone} -->
<!-- 프롬프트: "${ex.prompt}" -->

`;
    examples[ex.filename] = header + body;
  }

  // examples/README.md
  examples["README.md"] = `# Examples

도메인별 산출물 샘플 4종.
Claude Code가 이 스킬을 어떻게 사용해야 하는지 학습하는 데 활용한다.

| 파일 | 도메인 | 핵심 |
|---|---|---|
${EXAMPLE_DOMAINS.map((e) => `| \`${e.filename}\` | ${e.domain} | "${e.prompt.slice(0, 60)}..." |`).join("\n")}

각 파일 상단에 사용된 \`intent\` (도메인 / productType / 톤 / 프롬프트)가 주석으로 포함되어 있다.
`;

  return examples;
}

/* ────────────────────────────────────────────────────────────
 *  통합 references/scripts/assets/tests 수집
 *  여러 sub-skill이 같은 파일을 참조해도 한 번만 포함 (중복 제거)
 * ──────────────────────────────────────────────────────────── */

interface CollectedFile {
  basename: string;
  content: string;
  /** 어느 sub-skill에서 왔는지 추적 (디버깅용) */
  origin: string;
}

async function collectFiles(
  workUnit: WorkUnit,
  skills: Skill[],
  cwd: string,
): Promise<{
  references: CollectedFile[];
  scripts: CollectedFile[];
  assets: CollectedFile[];
  tests: CollectedFile[];
}> {
  const result = {
    references: [] as CollectedFile[],
    scripts: [] as CollectedFile[],
    assets: [] as CollectedFile[],
    tests: [] as CollectedFile[],
  };

  // 파일명 중복 추적
  const seen = {
    references: new Set<string>(),
    scripts: new Set<string>(),
    assets: new Set<string>(),
    tests: new Set<string>(),
  };

  for (const skillId of workUnit.skills) {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) continue;

    const groups: Array<[
      keyof typeof result,
      string[],
    ]> = [
      ["references", skill.files.references],
      ["scripts", skill.files.scripts],
      ["assets", skill.files.assets],
      ["tests", skill.files.tests],
    ];

    for (const [group, files] of groups) {
      for (const filePath of files) {
        const basename = path.basename(filePath);
        if (seen[group].has(basename)) continue; // 중복 제거

        const abs = path.join(cwd, filePath);
        const content = await tryRead(abs);
        result[group].push({
          basename,
          content:
            content ?? `// 원본 파일 미작성: ${filePath}\n// from: ${skill.id}\n`,
          origin: skill.id,
        });
        seen[group].add(basename);
      }
    }
  }

  return result;
}

/* ────────────────────────────────────────────────────────────
 *  메인 — buildWorkUnitBundle
 * ──────────────────────────────────────────────────────────── */

export async function buildWorkUnitBundle(opts: {
  workUnit: WorkUnit;
  skills: Skill[];
  result?: ResultPayload & { figmaPrompt?: string };
}): Promise<Uint8Array> {
  const { workUnit, skills, result } = opts;
  const cwd = process.cwd();

  const zip = new JSZip();
  const root = zip.folder(workUnit.id); // ← Anthropic Skills 표준: skill 이름 = workunit id
  if (!root) throw new Error("zip root folder failed");

  // ─── 1. Top-level metadata ───
  root.file("SKILL.md", buildMasterSkillMd(workUnit, skills));
  root.file("work-unit.json", JSON.stringify(workUnit, null, 2));

  // ─── 2. references/scripts/assets/tests 통합 ───
  const collected = await collectFiles(workUnit, skills, cwd);

  // 시스템 참고자료 (도메인 보존 규칙 + 도메인 프로필 원본) — sub-skill 외 별도로 항상 포함.
  // collected.references에 push해서 CATALOG.md 인덱스에도 자동 반영되게 한다.
  const sysRulesPath = path.join(cwd, "skills", "_runtime", "system-rules.ts");
  const sysRulesContent = await tryRead(sysRulesPath);
  if (sysRulesContent) {
    collected.references.push({
      basename: "domain-preservation-rule.md",
      content: `# Domain Preservation Rule (원본)

> 모든 스킬의 prompt.ts가 system prompt 앞에 prepend하는 도메인 보존 규칙.
> 출처: \`skills/_runtime/system-rules.ts\`

\`\`\`ts
${sysRulesContent}
\`\`\`
`,
      origin: "system",
    });
  }

  const profilesPath = path.join(cwd, "skills", "_runtime", "domain-profiles.ts");
  const profilesContent = await tryRead(profilesPath);
  if (profilesContent) {
    collected.references.push({
      // ⚠️ 파일명을 domain-profiles.md로 통일 (SKILL.md의 참조명과 일치)
      basename: "domain-profiles.md",
      content: `# Domain Profiles (5종, 원본 정의)

> 5개 도메인(헬스케어/핀테크/이커머스/어드민/SaaS)의 디자인 토큰·페르소나·플로우·컴포넌트 정의.
> 출처: \`skills/_runtime/domain-profiles.ts\`

\`\`\`ts
${profilesContent}
\`\`\`
`,
      origin: "system",
    });
  }

  // 통합된 references를 한 번에 zip에 추가 (sub-skill + system 모두 포함)
  if (collected.references.length > 0) {
    const refsFolder = root.folder("references");
    if (refsFolder) {
      for (const f of collected.references) {
        refsFolder.file(f.basename, f.content);
      }
    }
  }
  if (collected.scripts.length > 0) {
    const scriptsFolder = root.folder("scripts");
    if (scriptsFolder) {
      for (const f of collected.scripts) {
        scriptsFolder.file(f.basename, f.content);
      }
    }
  }
  if (collected.assets.length > 0) {
    const assetsFolder = root.folder("assets");
    if (assetsFolder) {
      for (const f of collected.assets) {
        assetsFolder.file(f.basename, f.content);
      }
    }
  }
  if (collected.tests.length > 0) {
    const testsFolder = root.folder("tests");
    if (testsFolder) {
      for (const f of collected.tests) {
        testsFolder.file(f.basename, f.content);
      }
    }
  }

  // ─── 3. examples/ ───
  const examplesFolder = root.folder("examples");
  if (examplesFolder) {
    const examples = buildExamplesForWorkUnit(workUnit);
    for (const [filename, content] of Object.entries(examples)) {
      examplesFolder.file(filename, content);
    }
  }

  // ─── 4. result/ (옵션 — 이번 실행 산출물) ───
  if (result) {
    const resultFolder = root.folder("result");
    if (resultFolder) {
      resultFolder.file("README.md", buildResultReadme(result));
      resultFolder.file("output.md", result.output);
      resultFolder.file("validation.md", buildValidationMd(result.validation));
      const intentMd = buildIntentMd(result.intent);
      if (intentMd) resultFolder.file("intent.md", intentMd);
      if (result.figmaPrompt) {
        resultFolder.file("figma-prompt.md", result.figmaPrompt);
      }
      resultFolder.file(
        "manifest.json",
        JSON.stringify(buildManifest(result), null, 2),
      );
    }
  }

  // ─── 5. CATALOG.md (자료 인덱스) ───
  root.file(
    "CATALOG.md",
    buildCatalogMd(workUnit, skills, {
      references: collected.references.map((f) => f.basename),
      scripts: collected.scripts.map((f) => f.basename),
      assets: collected.assets.map((f) => f.basename),
      tests: collected.tests.map((f) => f.basename),
    }),
  );

  // ─── 6. README.md (사람용 시작 문서) ───
  root.file("README.md", buildTopReadme(workUnit, !!result));

  // ─── 7. _dev/ (옵션, Next.js TS 구현 참조) ───
  const devFolder = root.folder("_dev");
  if (devFolder) {
    devFolder.file(
      "README.md",
      `# _dev — Next.js TypeScript 구현 참조

⚠️ **Claude Code는 이 폴더를 무시합니다.**

이 폴더는 [AXDD SkillOps Console](https://github.com/...)에서 export된
Next.js TypeScript 구현 참조 코드입니다.

자신의 Next.js 프로젝트에서 실행 로직을 재현하려는 개발자만 참조하세요.

## 구조
- \`_runtime/\` — 공유 런타임 8개 모듈
- \`skills/<sub-skill-id>/\` — 5개 sub-skill의 원본 폴더 (SKILL.md + prompt.ts + runner.ts + mock-output.ts)

## 사용
원본 콘솔의 \`skills/\` 폴더에 그대로 복사해 사용 가능.
import 경로 (\`../../_runtime/\`)도 그대로 작동.

## Claude Code에서는?
이 폴더의 \`.ts\` 파일은 Claude Code에서 실행되지 않습니다.
Claude Code는 상위 \`SKILL.md\`만 읽고 동작합니다.
`,
    );

    const runtimeFolder = devFolder.folder("_runtime");
    if (runtimeFolder) {
      for (const file of RUNTIME_FILES) {
        const abs = path.join(cwd, "skills", "_runtime", file);
        const content = await tryRead(abs);
        if (content !== null) runtimeFolder.file(file, content);
      }
      runtimeFolder.file("registry.ts", buildBundleRegistry(workUnit, skills));
    }

    const subSkillsFolder = devFolder.folder("skills");
    if (subSkillsFolder) {
      for (const skillId of workUnit.skills) {
        const skillMeta = skills.find((s) => s.id === skillId);
        if (!skillMeta) continue;
        const skillFolder = subSkillsFolder.folder(skillMeta.id);
        if (!skillFolder) continue;

        const skillMdPath = path.join(cwd, skillMeta.files.skill);
        const skillMdBody = await tryRead(skillMdPath);
        skillFolder.file(
          "SKILL.md",
          skillMdBody ?? `# ${skillMeta.name}\n\n(원본 본문 미작성)`,
        );

        const skillDir = path.dirname(skillMeta.files.skill);
        for (const codeFile of SKILL_CODE_FILES) {
          const codePath = path.join(cwd, skillDir, codeFile);
          const content = await tryRead(codePath);
          if (content !== null) skillFolder.file(codeFile, content);
        }
      }
    }
  }

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

/* ────────────────────────────────────────────────────────────
 *  Bundle 전용 registry.ts — _dev/_runtime/registry.ts 로 들어감
 * ──────────────────────────────────────────────────────────── */

function buildBundleRegistry(workUnit: WorkUnit, skills: Skill[]): string {
  const wuSkills = workUnit.skills
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => !!s);

  const imports = wuSkills
    .map((s, i) => `import skill${i} from "../skills/${s.id}/runner";`)
    .join("\n");
  const list = wuSkills.map((_, i) => `  skill${i},`).join("\n");

  return `/**
 * Bundle Skill Registry — 이 워크유닛에 포함된 스킬만 등록.
 * 원본 콘솔의 registry.ts와 달리 워크유닛 단위로 동적 생성됨.
 */

import type { SkillRunner, SkillRunInput, SkillRunOutput } from "./types";

${imports}

const RUNNERS: SkillRunner[] = [
${list}
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
  if (!runner) throw new Error(\`Skill not registered: \${id}\`);
  const start = Date.now();
  const out = await runner.run(input);
  return { ...out, durationMs: Date.now() - start };
}
`;
}
