# CLAUDE.md

## Project: AXDD SkillOps Console

AXDD SkillOps Console은 AXDD 프로젝트의 스킬, 에이전트, 하네스 룰, 워크 유닛, 자산 레포지토리, 검증/거버넌스를 시각화하고 실행 가능한 형태로 관리하는 웹 콘솔이다.

현재 개발자들이 스킬/에이전트/코드 구조를 만들고 있지만, 기획자와 UX/UI 디자이너가 보기에는 실체가 명확하지 않다.  
이 프로젝트의 목표는 흩어진 AXDD 개념을 실제 화면과 데이터 구조로 연결하여, 개발자가 각 영역에 코드를 넣으면 동작할 수 있는 MVP 콘솔을 만드는 것이다.

---

## 1. Core Goal

이 프로젝트는 단순 문서 사이트가 아니다.

사용자 요청을 받아서:

1. Hook이 요청 조건을 감지하고
2. Work Unit이 선택되며
3. 필요한 Skills가 조합되고
4. 결과 산출물이 생성되고
5. Validation Skill이 결과를 검증하고
6. Human Review를 거쳐
7. Asset Repository 또는 GitHub/Vercel/Figma/Miro로 연결되는

AI 업무 운영 콘솔이다.

핵심 목표는 다음과 같다.

```txt
업무 요청
→ Hook 감지
→ Work Unit 선택
→ Skill 조합
→ Output 생성
→ Validation
→ Human Review
→ Asset Repository 등록
→ Release / Publish
```

---

## 2. Product Name

기본 제품명은 다음으로 사용한다.

```txt
AXDD SkillOps Console
```

대체 이름은 참고용으로만 둔다.

```txt
AXDD Workflow Builder
AXDD Skill Harness Console
AXDD Agent Workbench
```

실제 UI에서는 `AXDD SkillOps Console`을 우선 사용한다.

---

## 3. User Role

주요 사용자는 다음과 같다.

### Product Designer / UX Designer

- 스킬 구조를 화면으로 이해한다.
- 업무 요청이 어떤 스킬 조합으로 실행되는지 확인한다.
- Work Unit 흐름을 설계한다.
- 생성된 MD 산출물을 Figma 작업지시서로 활용한다.
- 검증 상태와 승인 상태를 관리한다.

### Developer

- 각 Skill 폴더에 `SKILL.md`, scripts, references, assets, tests를 넣는다.
- JSON 데이터 구조를 기반으로 UI와 실행 로직을 연결한다.
- Hook, Work Unit, Skill Runner, Validation Runner를 구현한다.

### Operator / PM

- 진행 상황, 리스크, 산출물, 검증 결과, 릴리즈 상태를 확인한다.
- Miro, GitHub, Vercel, Figma 연동 상태를 관리한다.

---

## 4. Main Information Architecture

좌측 사이드바 기준으로 다음 메뉴를 만든다.

```txt
1. Overview
2. Skill Library
   - All Skills
   - Simple Skills
   - Reference Skills
   - Template Skills
   - Script Skills
   - Asset Skills
   - Full-step Skills
   - Metadata Skills
   - Test Skills

3. Work Units
   - Work Unit List
   - Work Unit Builder
   - Hook Mapping

4. Asset Repository
   - Inbox
   - References
   - Templates
   - Scripts
   - Outputs
   - Duplicates
   - Migration Candidates

5. Sandbox
   - Prompt Test
   - Hook Match Result
   - Run Log
   - Output Preview
   - Validation Result

6. Governance
   - Review Queue
   - Approval Rules
   - Release Status
   - Risk / Backlog
   - Decision Log

7. Docs
   - Standard Kit
   - Agent Creation Guide
   - Playbook
   - WBS
```

---

## 5. Required Screens

### 5.1 Overview

목적: 전체 AXDD SkillOps 현황을 한눈에 보여준다.

필수 구성:

- Total Skills
- Verified Skills
- Unverified Skills
- Work Units
- Pending Reviews
- Release Candidates
- Recent Runs
- Risk / Backlog Summary
- Integration Status
  - GitHub
  - Vercel
  - Miro
  - Figma
  - Local Harness

중앙에는 전체 실행 흐름을 시각화한다.

```txt
Input
→ Hook
→ Work Unit
→ Skills
→ Output
→ Validation
→ Human Review
→ Release
```

---

### 5.2 Skill Library

목적: 8개 스킬 카테고리를 탐색하고 선택할 수 있게 한다.

좌측 필터:

```txt
All
Simple
Reference
Template
Script
Asset
Full-step
Metadata
Test
```

스킬 카드 필수 정보:

- Skill Name
- Category
- Description
- Input
- Output
- Status
- Owner
- Version
- Required Files
- Last Updated

카드 클릭 시 오른쪽 Detail Panel을 연다.

---

### 5.3 Skill Detail

목적: 하나의 스킬이 무엇을 입력받고, 무엇을 출력하고, 어떤 파일을 사용하는지 보여준다.

필수 섹션:

```txt
1. Summary
2. When to Use
3. Input Schema
4. Output Schema
5. Files
   - SKILL.md
   - references/
   - scripts/
   - assets/
   - tests/
6. Example Prompt
7. Expected Output
8. Validation Rule
9. Related Work Units
10. GitHub Path
```

---

### 5.4 Work Unit Builder

목적: 여러 스킬을 조합해 하나의 업무 실행 단위를 만든다.

예시 Work Unit:

```txt
UX/UI Planning Work Unit

1. Requirement Summary Skill
2. User Flow Generator Skill
3. IA Generator Skill
4. UI Foundation Skill
5. Review Checklist Skill
6. Handoff MD Generator Skill
```

UI 표현:

```txt
[Input]
  ↓
[Requirement Summary]
  ↓
[UX Foundation]
  ↓
[UI Foundation]
  ↓
[Review]
  ↓
[Handoff Output]
```

필수 기능:

- Work Unit 생성
- Skill 추가/삭제
- Skill 순서 변경
- Hook 연결
- Output 정의
- Validation Skill 연결
- Owner 지정
- Status 지정

---

### 5.5 Hook Rule Editor

목적: 어떤 조건에서 어떤 Work Unit을 실행할지 정의한다.

사용자에게는 JSON 대신 자연어 기반 룰 빌더처럼 보여준다.

UI 예시:

```txt
WHEN
사용자 입력에 "착수보고서"가 포함되면

RUN
Kickoff Report Work Unit 실행

USE SKILLS
- Requirement Summary
- Stakeholder Map
- Risk Checklist
- Report Template
- Report Validation

OUTPUT
kickoff_report.md
```

내부 데이터는 JSON으로 저장한다.

---

### 5.6 Sandbox Runner

목적: 입력 프롬프트를 넣고 Hook, Work Unit, Skills, Output, Validation 흐름을 테스트한다.

필수 구성:

- Prompt Input
- Matched Hook
- Selected Work Unit
- Selected Skills
- Execution Steps
- Run Log
- Output Preview
- Validation Result
- Cost / Time Mock
- Export Output

MVP에서는 실제 실행 없이 mock 실행 결과로 구현해도 된다.

---

### 5.7 Asset Repository

목적: 흩어진 산출물을 취합, 분류, 중복 제거, 이관 후보화한다.

필수 탭:

```txt
Inbox
References
Templates
Scripts
Outputs
Duplicates
Migration Candidates
```

각 Asset Card 정보:

- Asset Name
- Type
- Category
- Source
- Related Skill
- Related Work Unit
- Status
- Duplicate Risk
- Migration Candidate 여부

---

### 5.8 Governance

목적: 검증, 승인, 릴리즈, 리스크/백로그를 관리한다.

상태값:

```txt
Draft
Ready for Test
Tested
Needs Review
Approved
Release Candidate
Released
Deprecated
```

필수 구성:

- Review Queue
- Validation Result
- Human Review Status
- Approval Rule
- Release Status
- Risk Log
- Decision Log
- Next Step

---

## 6. Skill Categories

스킬 카테고리는 반드시 아래 8개로 고정한다.

### 6.1 Simple Skill

`SKILL.md`만 가지고 있는 단순 작업 스킬.

예:

```txt
문서 요약
간단한 체크리스트 생성
단순 변환
```

### 6.2 Reference Skill

특정 MD 파일, 코드 레퍼런스, 디자인 시스템 문서 등을 참조하는 스킬.

예:

```txt
디자인 시스템 MD를 참고해서 UI Foundation 생성
코드 레퍼런스를 참고해서 컴포넌트 규칙 작성
```

### 6.3 Template Skill

정해진 템플릿 구조에 맞춰 산출물을 생성하는 스킬.

예:

```txt
착수보고서 템플릿
리스크 로그 템플릿
UI 리뷰 템플릿
```

### 6.4 Script Skill

Python, JSON, CLI, shell script 등을 실행하거나 사용하는 스킬.

예:

```txt
CSV 변환
HTML 마일스톤 생성
JSON 카탈로그 업데이트
```

### 6.5 Asset Skill

하나의 작업 단위에 필요한 프로세스, 룰, 테스트 방법, 요약 정보를 포함하는 자산형 스킬.

Reference Skill과의 차이:

```txt
Reference Skill = 특정 자료를 참고하라는 의미
Asset Skill = 특정 작업 단위에 필요한 자산 풀셋을 사용한다는 의미
```

### 6.6 Full-step Skill

Asset, Reference, Script를 모두 포함하는 완성형 스킬.

예:

```txt
UX/UI Handoff Full-step Skill
Design System Setup Full-step Skill
POC Report Generation Full-step Skill
```

### 6.7 Metadata Skill

자산 레포지토리의 메타데이터를 기반으로 필요한 자료를 탐색하거나 생성하는 스킬.

예:

```txt
관련 템플릿 찾기
유사 산출물 찾기
중복 자산 후보 찾기
```

### 6.8 Test Skill

검증 전용 스킬.

예:

```txt
산출물 누락 검증
템플릿 준수 검증
SKILL.md 품질 검증
Work Unit 실행 결과 검증
```

---

## 7. Data Structure

MVP에서는 백엔드 없이 JSON 파일 기반으로 시작한다.

### 7.1 skills.catalog.json

```json
[
  {
    "id": "ux-foundation-generator",
    "name": "UX Foundation Generator",
    "category": "reference",
    "description": "요구사항과 디자인 시스템 레퍼런스를 기반으로 UX Foundation 문서를 생성한다.",
    "input": ["requirements.md", "design-system-reference.md"],
    "output": ["ux_foundation.md"],
    "files": {
      "skill": "skills/reference/ux-foundation-generator/SKILL.md",
      "references": ["references/design-system.md"],
      "scripts": [],
      "assets": [],
      "tests": ["tests/ux-foundation-checklist.md"]
    },
    "owner": "Product Design",
    "version": "0.1.0",
    "status": "verified",
    "relatedWorkUnits": ["ux-ui-planning-workunit"],
    "tags": ["ux", "design-system", "foundation"]
  }
]
```

### 7.2 work-units.json

```json
[
  {
    "id": "ux-ui-planning-workunit",
    "name": "UX/UI Planning Work Unit",
    "description": "요구사항을 기반으로 UX 구조, IA, UI Foundation, Handoff 문서를 생성한다.",
    "triggerHooks": ["ux-ui-planning-hook"],
    "skills": [
      "requirement-summary",
      "user-flow-generator",
      "ia-generator",
      "ux-foundation-generator",
      "ui-foundation-generator",
      "handoff-md-generator",
      "ux-ui-review-checklist"
    ],
    "input": ["raw_requirement.md"],
    "output": [
      "requirement_summary.md",
      "user_flow.md",
      "ia.md",
      "ux_foundation.md",
      "ui_foundation.md",
      "handoff.md",
      "review_checklist.md"
    ],
    "validationSkill": "ux-ui-review-checklist",
    "owner": "Product Design",
    "status": "draft"
  }
]
```

### 7.3 hooks.json

```json
[
  {
    "id": "kickoff-report-hook",
    "name": "Kickoff Report Hook",
    "description": "사용자 입력에 착수보고서 관련 키워드가 포함되면 착수보고서 Work Unit을 실행한다.",
    "conditions": {
      "keywords": ["착수보고서", "프로젝트 시작", "kickoff", "제안서", "보고서"]
    },
    "targetWorkUnit": "kickoff-report-workunit",
    "priority": 1,
    "enabled": true
  }
]
```

### 7.4 assets.json

```json
[
  {
    "id": "design-system-reference-md",
    "name": "Design System Reference MD",
    "type": "reference",
    "category": "design-system",
    "source": "uploaded-md",
    "path": "references/design-system.md",
    "relatedSkills": ["ux-foundation-generator", "ui-foundation-generator"],
    "status": "active",
    "duplicateRisk": "low",
    "migrationCandidate": true
  }
]
```

### 7.5 runs.json

```json
[
  {
    "id": "run-001",
    "prompt": "신규 AXDD 프로젝트 착수보고서 만들어줘",
    "matchedHook": "kickoff-report-hook",
    "selectedWorkUnit": "kickoff-report-workunit",
    "selectedSkills": [
      "requirement-summary",
      "stakeholder-map",
      "risk-checklist",
      "kickoff-report-template",
      "report-validation"
    ],
    "status": "completed",
    "outputs": ["kickoff_report.md", "risk_log.md", "next_step.md"],
    "validation": {
      "status": "passed",
      "issues": []
    },
    "createdAt": "2026-05-27T09:00:00+09:00"
  }
]
```

---

## 8. Recommended Tech Stack

우선 MVP 기준으로 구현한다.

```txt
Framework: Next.js
Language: TypeScript
Styling: Tailwind CSS
UI: shadcn/ui
Icons: lucide-react
Flow View: React Flow
Data: Local JSON
Markdown Preview: react-markdown
Deployment: Vercel
Repository: GitHub
```

백엔드는 MVP 이후에 붙인다.

초기에는 `/data/*.json`을 읽어서 UI를 렌더링한다.

---

## 9. Folder Structure (현재 구현 반영 — MVP 완성본)

```txt
axdd-skillops-console/
├── app/
│   ├── layout.tsx               ← Sidebar + overflow-x-hidden 격리
│   ├── page.tsx                 ← Overview + Architecture Status + KPI
│   ├── skills/page.tsx          ← Skill Library + Detail Panel + zip
│   ├── work-units/page.tsx      ← Work Unit + Bundle 다운로드
│   ├── assets/page.tsx          ← Asset Repo + Detail Panel
│   ├── sandbox/page.tsx         ← Prompt → Intent → Hook → Skills → Bundle
│   ├── governance/page.tsx      ← Pipeline + Review Queue + Domain Fit
│   ├── docs/page.tsx            ← MD 슬라이드 패널
│   └── api/
│       ├── run/route.ts                       ← POST: 워크유닛 실행
│       ├── debug-route/route.ts               ← POST: routeBest 디버깅
│       ├── skills/[id]/skill-md/route.ts      ← GET: SKILL.md
│       ├── skills/[id]/package/route.ts       ← GET: 개별 스킬 zip
│       └── work-units/[id]/bundle/route.ts    ← GET/POST: Work Unit Bundle
│
├── components/
│   ├── layout/        (app-sidebar, app-header)
│   ├── overview/      (workflow-overview)
│   ├── skills/        (skill-card, skill-detail-panel, skill-category-filter)
│   ├── work-units/    (workunit-flow)
│   ├── sandbox/       (prompt-runner, preset-gallery, intent-card,
│   │                   clarifying-card, figma-export-panel)
│   ├── assets/        (asset-card, asset-detail-panel)
│   ├── governance/    (release-pipeline)
│   └── ui/            (card, badge, button, input, markdown-view)
│
├── data/                       ← 시드 카탈로그 (백엔드 응답 형태와 동일)
│   ├── skills.catalog.json
│   ├── work-units.json
│   ├── hooks.json
│   ├── assets.json
│   └── runs.json
│
├── mocks/                      ← MVP 가짜 데이터·동작 격리 (모두 // MOCK: 마커)
│   ├── README.md               ← LLM 교체 시 제거 절차
│   ├── index.ts
│   ├── execution.ts            ← 가짜 step 실행기 (자연 지연)
│   ├── validation.ts           ← 4-state + 도메인 fit 검증
│   ├── sample-outputs.ts       ← 워크유닛별 폴백 (대부분 동적 mock 사용)
│   ├── sandbox-presets.ts      ← 9개 프리셋 (UX/UI 4 · 기타 2 · Edge 3)
│   ├── activity-feed.ts        ← Overview 타임라인
│   ├── domain-fit.ts           ← Governance 도메인 fit 통계
│   ├── integrations.ts         ← GitHub/Vercel/Figma MCP 상태
│   ├── risks.ts / decisions.ts ← Risk/Decision 로그
│   └── docs.ts                 ← Docs 페이지 본문 (Architecture 가이드 포함)
│
├── skills/                     ← 8개 카테고리 × 실행 가능한 코드
│   ├── _runtime/               ← 공유 런타임 (Bundle export 시 self-contained)
│   │   ├── types.ts            ← SkillRunner / Input / Output, SkillCategory
│   │   ├── helpers.ts          ← withLlmOrMock 표준 헬퍼 (alias 의존성 0)
│   │   ├── llm-client.ts       ← Anthropic API (fetch only, SDK 의존성 0)
│   │   ├── registry.ts         ← 8개 카테고리 스킬 등록 (Bundle 시 동적 재생성)
│   │   ├── intent.ts           ← 도메인·productType·tone·scope·unknowns 추출
│   │   ├── clarifying.ts       ← 정보 부족 시 정적 질문 카탈로그
│   │   ├── domain-profiles.ts  ← 5개 도메인 프로필 + countDomainKeywords
│   │   └── system-rules.ts     ← DOMAIN_PRESERVATION_RULE 중앙 관리
│   └── <category>/<skill-id>/
│       ├── SKILL.md            ← frontmatter (name/description/category/version/owner)
│       ├── prompt.ts           ← system prompt + DOMAIN_PRESERVATION_RULE prepend
│       ├── runner.ts           ← withLlmOrMock 호출
│       ├── mock-output.ts      ← intent.domain 기반 동적 출력
│       └── (references/ scripts/ assets/ tests/)
│
├── lib/
│   ├── data.ts                 ← data/*.json 진입점
│   ├── types.ts                ← Skill / WorkUnit / Hook / Run / Asset
│   ├── utils.ts                ← cn, formatRelative
│   ├── skill-export.ts         ← buildSkillMd (frontmatter 자동 추가)
│   ├── result-builders.ts      ← README/intent.md/validation.md 빌더 (공유)
│   ├── result-export.ts        ← 클라이언트 결과 zip
│   ├── workunit-bundle.ts      ← 서버 Bundle zip + 동적 registry
│   ├── figma/                  ← Figma 듀얼 트랙 (MCP + AI 프롬프트)
│   └── hook-router/            ← 3단계 fallback 라우터
│       ├── types.ts
│       ├── keyword-router.ts   ← 키워드 매칭
│       ├── llm-router.ts       ← LLM 슬롯 (스텁)
│       └── index.ts            ← routeBest (키워드 → scope → domain)
│
├── CLAUDE.md
├── TESTING.md                  ← LLM 활성화·테스트 가이드
└── .env.local.example          ← ANTHROPIC_API_KEY 슬롯
```

---

## 10. UI Style Direction

디자인 방향은 엔터프라이즈 AI 운영 콘솔이다.

### Tone

```txt
Clean
Professional
Structured
Technical but readable
Enterprise SaaS
```

### Layout

```txt
좌측 고정 사이드바
상단 헤더
중앙 작업 영역
우측 상세 패널
카드 기반 정보 구조
노드 기반 Work Unit Flow
상태 배지 중심
```

### Visual Keywords

```txt
Skill Map
Workflow Graph
Agent Harness
Validation Pipeline
Asset Repository
Governance Queue
```

### Color Direction

기본은 뉴트럴 기반으로 한다.

```txt
Background: light neutral
Sidebar: dark navy or charcoal
Primary: blue / indigo
Success: green
Warning: amber
Error: red
Pending: gray
```

다크모드까지 구현하지 않아도 된다. MVP는 라이트 모드 우선.

---

## 11. MVP Implementation Order

반드시 아래 순서로 구현한다.

### Step 1. Project Shell

- Next.js 프로젝트 생성
- Tailwind 설정
- shadcn/ui 설정
- Sidebar Layout 생성
- Header 생성
- 기본 라우팅 구성

### Step 2. Mock Data

다음 JSON 파일을 만든다.

```txt
data/skills.catalog.json
data/work-units.json
data/hooks.json
data/assets.json
data/runs.json
```

각 파일에는 최소 5개 이상의 샘플 데이터를 넣는다.

특히 Skill은 8개 카테고리별 최소 1개씩 넣는다.

### Step 3. Overview

- KPI 카드
- Recent Runs
- Integration Status
- Skill Category Summary
- Workflow Overview Map

### Step 4. Skill Library

- Skill Card List
- Category Filter
- Search
- Detail Panel
- File Map
- Status Badge

### Step 5. Work Unit Builder

- Work Unit List
- Work Unit Detail
- React Flow 기반 Skill Flow
- Hook 연결 정보 표시

### Step 6. Sandbox

- Prompt 입력
- Mock Hook Matching
- Selected Work Unit 표시
- Step-by-step 실행 로그 표시
- Markdown Output Preview
- Validation Result 표시

### Step 7. Asset Repository

- Asset Table
- Asset Card
- Type Filter
- Duplicate Risk 표시
- Migration Candidate 표시

### Step 8. Governance

- Review Queue
- Release Status
- Risk Log
- Decision Log
- Approval Status

---

## 12. Required Sample Skills

초기 샘플 스킬은 반드시 아래를 포함한다.

```txt
1. simple-summary-skill
   Category: simple
   Output: summary.md

2. design-system-reference-skill
   Category: reference
   Output: ui_foundation.md

3. kickoff-report-template-skill
   Category: template
   Output: kickoff_report.md

4. html-milestone-generator-skill
   Category: script
   Output: milestone.html

5. ux-process-asset-skill
   Category: asset
   Output: ux_process_plan.md

6. ux-ui-handoff-fullstep-skill
   Category: fullstep
   Output: handoff.md

7. asset-metadata-search-skill
   Category: metadata
   Output: related_assets.md

8. output-validation-skill
   Category: test
   Output: validation_report.md
```

---

## 13. Required Sample Work Units

초기 Work Unit은 최소 3개 만든다.

### 13.1 Kickoff Report Work Unit

```txt
Trigger:
착수보고서, 프로젝트 시작, kickoff

Skills:
- simple-summary-skill
- kickoff-report-template-skill
- output-validation-skill

Outputs:
- kickoff_report.md
- risk_log.md
- next_step.md
```

### 13.2 UX/UI Planning Work Unit

```txt
Trigger:
UX 기획, UI 화면, 사용자 플로우, IA, 디자인 파운데이션

Skills:
- simple-summary-skill
- design-system-reference-skill
- ux-process-asset-skill
- ux-ui-handoff-fullstep-skill
- output-validation-skill

Outputs:
- requirement_summary.md
- user_flow.md
- ia.md
- ui_foundation.md
- handoff.md
```

### 13.3 CI/CD Setup Work Unit

```txt
Trigger:
CI/CD, 배포 환경, GitHub Actions, Vercel

Skills:
- simple-summary-skill
- html-milestone-generator-skill
- output-validation-skill

Outputs:
- cicd_plan.md
- deployment_checklist.md
- release_note.md
```

---

## 14. Interaction Rules

### 14.1 User Input to Hook

Sandbox에서 사용자가 프롬프트를 입력하면, mock logic으로 keyword matching을 수행한다.

예:

```txt
입력: "신규 프로젝트 착수보고서 만들어줘"
감지 Hook: kickoff-report-hook
선택 Work Unit: Kickoff Report Work Unit
```

실제 LLM 호출은 MVP에서 구현하지 않아도 된다.

### 14.2 Work Unit Execution

MVP에서는 실행 결과를 mock으로 생성한다.

각 단계는 다음처럼 표시한다.

```txt
1. Hook matched
2. Work Unit selected
3. Skills loaded
4. Output generated
5. Validation completed
6. Human review pending
```

### 14.3 Output Preview

Markdown Preview 컴포넌트로 결과물을 보여준다.

샘플 출력은 문자열 또는 `/docs/sample-outputs/*.md` 파일로 둔다.

---

## 15. UX Copy Guidelines

개발 용어를 그대로 노출하지 말고, 이해 가능한 설명을 함께 붙인다.

예:

```txt
Skill
→ 재사용 가능한 작업 능력

Hook
→ 실행 조건

Work Unit
→ 업무 실행 세트

Harness
→ 실행 규칙 엔진

Catalog
→ 스킬 라이브러리

Validation
→ 결과 검증

Governance
→ 승인/배포 관리
```

UI에는 영어와 한국어를 같이 쓸 수 있다.

예:

```txt
Skill Library / 스킬 라이브러리
Work Unit Builder / 업무 실행 세트 빌더
Sandbox Runner / 실행 테스트
Governance / 검증·승인 관리
```

---

## 16. Acceptance Criteria

MVP 완료 기준은 다음이다.

```txt
[ ] 좌측 사이드바와 주요 라우팅이 동작한다.
[ ] Overview에서 전체 상태가 보인다.
[ ] Skill Library에서 8개 카테고리 필터가 동작한다.
[ ] Skill Detail Panel에서 input/output/files/status가 보인다.
[ ] Work Unit 화면에서 스킬 조합 흐름이 보인다.
[ ] Sandbox에서 입력 → Hook Match → Work Unit → Skills → Output → Validation 흐름이 보인다.
[ ] Asset Repository에서 자산 목록과 상태가 보인다.
[ ] Governance에서 Review Queue와 Release Status가 보인다.
[ ] 모든 데이터는 JSON mock으로 관리된다.
[ ] Vercel 배포가 가능하다.
```

---

## 17. Do Not Do

MVP 단계에서는 하지 않는다.

```txt
- 복잡한 인증 시스템 구현 금지
- 실제 LLM API 연동 금지
- 실제 GitHub write 연동 금지
- 실제 Figma MCP 연동 금지
- DB 설계부터 시작 금지
- 지나치게 복잡한 관리자 권한 구조 금지
- 다크모드 우선 구현 금지
```

우선 목표는 “개념을 화면으로 보이게 만드는 것”이다.

---

## 18. Final Output Expected From Claude

Claude는 이 파일을 기준으로 다음을 수행한다.

1. Next.js + TypeScript + Tailwind 기반 프로젝트를 구성한다.
2. 위 IA에 맞는 페이지와 컴포넌트를 만든다.
3. JSON mock 데이터를 만든다.
4. Overview, Skill Library, Work Units, Sandbox, Assets, Governance 화면을 구현한다.
5. 실제 실행 로직은 mock으로 구현하되, 나중에 API/LLM/GitHub/Figma 연동이 가능하도록 구조를 분리한다.
6. 모든 화면은 기획자와 개발자가 동시에 이해할 수 있게 만든다.
7. 실행 가능한 MVP 수준으로 만든다.

---

## 19. First Command for Claude

프로젝트 루트에서 이 지시를 수행한다.

```txt
CLAUDE.md를 기준으로 AXDD SkillOps Console MVP를 구현해줘.

우선 Next.js + TypeScript + Tailwind + shadcn/ui 구조로 만들고,
JSON mock 데이터를 기반으로 다음 화면을 구현해줘.

1. Overview
2. Skill Library
3. Skill Detail Panel
4. Work Units
5. Sandbox Runner
6. Asset Repository
7. Governance

실제 LLM/API 연동은 하지 말고 mock 실행 흐름으로 구현해.
개발자가 나중에 실제 Skill Runner, Hook Engine, GitHub Sync, Figma Export를 붙일 수 있도록 컴포넌트와 데이터 구조를 분리해서 작성해.
```

---

# ─────────────────────────────────────────────────────────
# §20+ MVP 실구현 이후 추가된 아키텍처 (Phase 4 완료 시점)
# 이 섹션은 MVP 빌드 결과를 반영한 **현재 상태 문서**이다.
# 새로 합류한 개발자는 §1~19로 컨텍스트 이해 후 여기를 본다.
# ─────────────────────────────────────────────────────────

## 20. Domain Preservation Architecture (핵심 원칙)

**모든 산출물은 사용자가 요청한 도메인 안에서만 작성된다.**

§14 Interaction Rules와 §15 UX Copy Guidelines의 상위 규칙. 콘솔 자체의 예시
컨텍스트(예: AXDD SkillOps Console UI)가 사용자 산출물을 덮어쓰면 안 된다.

### 20.1 단일 진실 공급원

[skills/_runtime/system-rules.ts](skills/_runtime/system-rules.ts)의
`DOMAIN_PRESERVATION_RULE` 상수가 도메인 보존 규칙을 중앙 관리한다.

모든 스킬 `prompt.ts`는 system prompt 맨 앞에 이 룰을 prepend한다:

```ts
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  system: `${DOMAIN_PRESERVATION_RULE}

당신은 ...`,
  ...
};
```

### 20.2 5개 도메인 프로필

[skills/_runtime/domain-profiles.ts](skills/_runtime/domain-profiles.ts)에 정의:

| 도메인 | 톤 | 페르소나 (대표) | 색 토큰 (대표) |
|---|---|---|---|
| 헬스케어 | 신뢰·차분 | 환자/보호자/의료진 | teal-600 + sky-500 |
| 핀테크 | 전문성·정확 | 송금자/자산관리/KYC | navy-900 + gold-500 |
| 이커머스 | 트렌디·활발 | MZ쇼퍼/비교형/셀러 | coral-500 + pink-500 |
| 어드민 | 효율·차분 | 분석가/운영자/관리자 | blue-600 + slate-50 |
| SaaS | 미니멀 | 팀리드/파워유저/신규 | indigo-500 + cyan-500 |
| (기타) | generic | 일반 | indigo-500 |

각 프로필은: color 토큰 10~14종, 페르소나 3종, User Flow 2종, Sample Screen 3종 (ASCII 와이어프레임), 도메인 특화 컴포넌트 5종, Interaction 5종, A11y 12항목, Figma 프레임 11종을 포함한다.

### 20.3 검증

[mocks/validation.ts](mocks/validation.ts)의 `runMockValidation(workUnitId, output, domain)`이 산출물 본문을 분석해:
- 도메인 키워드 등장 ≥ 5회 (목표)
- 다른 도메인 누출 ≤ 3회 (임계)

→ 위반 시 `status: "needs-review"` 또는 `"failed"`.

---

## 21. Intent Extraction Pipeline

**자연어 입력 → 구조화된 의도 객체. 모든 스킬이 공유.**

### 21.1 구조

```ts
interface RunIntent {
  domain: "헬스케어" | "핀테크" | "이커머스" | "어드민" | "saas" | "교육" | "엔터테인먼트" | "unknown";
  productType: "saas" | "mobile-app" | "web" | "desktop" | "admin" | "unknown";
  tone: "엔터프라이즈" | "MZ" | "미니멀" | "차분" | "활발" | "전문성" | "unknown";
  scope: {
    needsRequirementSummary, needsIA, needsUserFlow, needsDesignSystem,
    needsComponentSpec, needsHandoff, needsKickoffReport, needsCICD
  };
  unknowns: ("domain"|"tone"|"timeline"|"team-size"|"existing-design-system"|"target-persona"|"scope-specifics"|"platform")[];
  confidence: number;  // 0~1
  mode: "llm" | "heuristic";
  ...
}
```

**중요 분리**: `domain`(비즈니스 도메인)과 `productType`(제품 유형)을 분리. "헬스케어 SaaS"는 `domain="헬스케어"` + `productType="saas"`로 분해되어, SaaS 키워드가 도메인 누출로 오인되지 않게 한다.

### 21.2 흐름

```
사용자 입력
   ↓
[ API: app/api/run/route.ts ]
   ↓
extractIntent(prompt)   ← LLM (Anthropic) 또는 휴리스틱 fallback
   ↓
모든 스킬 runner에 input.context.intent로 전달
   ↓
각 스킬 mock-output / prompt가 intent.domain 기반 분기
```

### 21.3 Clarifying Question (정보 부족 시)

[skills/_runtime/clarifying.ts](skills/_runtime/clarifying.ts)에 8개 unknown 필드 × 질문·옵션 카탈로그를 **정적으로** 정의.

- LLM이 즉흥적으로 질문 생성하지 않음 (UX 일관성·비용)
- 도메인 필수 / 나머지 옵션
- 답변 후 자동으로 prompt에 합쳐져 재실행

---

## 22. Hook Routing — 3단계 fallback

[lib/hook-router/](lib/hook-router/) — 사용자 입력을 어떤 Work Unit으로 보낼지 결정.

### 22.1 routeBest 우선순위

```
1. 키워드 매칭 (data/hooks.json)
   ↓ (실패 시)
2. intent.scope fallback
   needsHandoff || needsDesignSystem || needsIA → ux-ui-planning
   needsKickoffReport → kickoff-report
   needsCICD → cicd-setup
   ↓ (실패 시)
3. intent.domain fallback
   domain !== "unknown" → ux-ui-planning (기본)
   ↓ (실패 시)
4. null (실행 차단)
```

이 덕분에 "디자인해줘" 같이 키워드 없어도 clarifying 답변 후 자동 매칭.

### 22.2 라우터 교체

`activeRouter`를 `KeywordHookRouter` → `LlmHookRouter`로 한 줄 교체하면 LLM 분류기로 업그레이드. [lib/hook-router/index.ts](lib/hook-router/index.ts).

---

## 23. Work Unit Bundle (Claude Code 호환 패키지)

**두 가지 zip을 제공한다 — 사용 목적에 따라.**

### 23.1 결과 zip (산출물 공유용)

[lib/result-export.ts](lib/result-export.ts) — 클라이언트사이드 JSZip.

```
{workunit-id}-{ts}/
├── README.md
├── output.md           ← 5개 스킬 산출물 합본
├── validation.md       ← 4-state + 도메인 fit
├── intent.md
├── manifest.json
└── figma-prompt.md     ← UX/UI 워크유닛만
```

### 23.2 Bundle zip (Claude Code 재실행용)

[lib/workunit-bundle.ts](lib/workunit-bundle.ts) — 서버사이드.

```
{workunit-id}-bundle-{ts}/
├── BUNDLE.md           ← 사용 가이드
├── work-unit.json
├── result/             ← 위 결과 zip 내용 (옵션)
└── skillset/
    ├── _runtime/       ← 8개 공유 모듈
    └── skills/<id>/    ← SKILL.md (frontmatter) + prompt.ts + runner.ts + mock-output.ts
```

**Bundle 자립성**:
- 외부 alias (`@/...`) 의존성 **0건**
- 카테고리 폴더 없이 `skills/<id>/` 평탄화
- Bundle 전용 `registry.ts`를 **워크유닛 스킬만 import하도록 동적 생성**

→ 압축 풀어 `~/.claude/work-units/<id>/`에 두면 Claude Code가 즉시 인식.

---

## 24. Validation — 4-state + 의미 검증

`runMockValidation`이 반환하는 status:

| Status | 조건 | reviewRequired |
|---|---|---|
| `passed` | 자동 검증 + 휴먼 리뷰 모두 OK (드물게 시스템 산출물) | false |
| `passed-with-review` | 자동 검증 OK, 휴먼 리뷰만 남음 (대부분의 정상 케이스) | true |
| `needs-review` | warning 항목 있음 (도메인 누출 등) | true |
| `failed` | error 항목 있음 (필수 섹션 누락, 도메인 키워드 부족 등) | true |

기존 binary (passed/failed) → 3-state → 4-state로 점진 확장.
`passed`인데 `reviewRequired=true`였던 운영 콘솔 모순 해결 — 휴먼 리뷰 게이트가 명시적으로 status에 반영됨.

### 24.1 의미 검증 (도메인 fit)

[skills/_runtime/domain-profiles.ts](skills/_runtime/domain-profiles.ts)의 `countDomainKeywords`:
- 산출물 본문에서 도메인 키워드 카운트
- 다른 도메인 키워드 누출 카운트 (productType은 제외)

산출물에 사용자 요청 도메인이 일관 등장하는지 자동 검증.

---

## 25. LLM 통합 경로

[skills/_runtime/llm-client.ts](skills/_runtime/llm-client.ts) — Anthropic API 호출 (fetch only, SDK 의존성 0).

`ANTHROPIC_API_KEY` 환경변수 설정만으로 자동 전환:

| 단계 | Mock | LLM (키 있을 때) |
|---|---|---|
| Intent 추출 | 휴리스틱 (regex) | LLM 분류 (1회) |
| Hook 라우팅 | 키워드 + 도메인 fallback | LLM 분류기 |
| Skill 실행 | mock-output 함수 | callLlm → 산출물 |
| Validation | 정적 룰 + 키워드 카운트 | LLM 메타 평가 추가 |

`withLlmOrMock` 헬퍼가 자동 분기. 사용자 코드 변경 없음.

---

## 26. mocks/ 격리 원칙

모든 가짜 데이터·동작은 `mocks/`에 격리.

- 호출 지점마다 `// MOCK:` 주석
- `grep -rn "MOCK:"` 한 번으로 모든 의존성 추적 가능
- 실제 백엔드 붙으면 `mocks/` 통째로 삭제 가능

자세한 제거 절차는 [mocks/README.md](mocks/README.md).

**예외**: `data/*.json`은 mocks가 아닌 시드 카탈로그. 백엔드가 붙어도 동일한 스키마를 따르므로 별도 관리.

---

## 27. 검증된 도메인 시나리오 (E2E)

다음 6개 시나리오가 Sandbox + Bundle export까지 동작 확인됨:

| 입력 | Intent | Hook | 산출물 도메인 키워드 | 다른 도메인 누출 |
|---|---|---|---|---|
| "신규 헬스케어 SaaS 환자 대시보드" | 헬스케어 + saas | ux-ui-planning | 107회 | 0회 |
| "패션 이커머스 모바일 MZ 타겟" | 이커머스 | ux-ui-planning | 119회 | 2회 |
| "핀테크 KYC + 송금" | 핀테크 + saas | ux-ui-planning | 113회 | 2회 |
| "엔터프라이즈 어드민 리디자인" | 어드민 | ux-ui-planning (fallback) | 66회 | 1회 |
| "디자인해줘" (모호) | unknown | **차단** | — | — |
| "강아지 사료" (무관) | unknown | **차단** | — | — |

분석가 외부 평가 점수: 82 → 89 → 93 (예상) 단계 상승.

---

## 28. 다음 단계 (Phase 5 — Production)

§17의 "Do Not Do" 항목 중 다음을 단계적으로 제거 가능:

1. **Anthropic API 연결** — `.env.local`에 `ANTHROPIC_API_KEY=sk-ant-...` 추가만
2. **데이터 저장소** — `lib/data.ts`를 Supabase / Postgres로 교체
3. **인증** — NextAuth 도입 (CLAUDE.md §3 3개 역할 활성화)
4. **작업 큐** — 긴 LLM 체인은 Inngest/QStash로 비동기 처리
5. **파일 스토리지** — Vercel Blob / S3
6. **관찰성** — Sentry + Langfuse (LLM 비용·지연 추적)
7. **Figma MCP** — [lib/figma/mcp-adapter.ts](lib/figma/mcp-adapter.ts)의 `_transport`에 실제 MCP 클라이언트 wiring

각 단계는 독립적으로 도입 가능. 한 번에 다 안 해도 됨.
