/**
 * MOCK: Docs 페이지 카드 목록 + 본문.
 * Anthropic Skills 표준 Bundle 구조 기준으로 작성됨.
 */

import type { Status } from "@/lib/types";

export interface DocItem {
  id: string;
  title: string;
  ko: string;
  desc: string;
  status: Status;
  emoji: string;
  body: string;
}

export const MOCK_DOCS: DocItem[] = [
  {
    id: "architecture",
    title: "AXDD Architecture",
    ko: "전체 아키텍처",
    desc: "Intent + Domain Profile + Bundle + 4-state Validation 통합 가이드. 가장 먼저 읽어주세요.",
    status: "approved",
    emoji: "🏛",
    body: `# AXDD SkillOps Console — Architecture

> 자연어 입력 → 도메인 인식 → 스킬 체인 실행 → 도메인 보존 검증 → **Anthropic Skills 표준 Bundle**

## 1. 핵심 원칙 — 도메인 보존

**모든 산출물은 사용자가 요청한 도메인 안에서만 작성된다.**

- 사용자가 "헬스케어 SaaS"를 요청했다면 산출물의 IA, 컴포넌트, 화면, Figma 프롬프트 모두 헬스케어 안에서만
- 내부 카탈로그 예시 (콘솔 자체의 컴포넌트 등)로 덮어쓰지 않음
- 도메인 미지정 시 generic 톤 + "확인 필요" 메모

규칙은 \`skills/_runtime/system-rules.ts\`의 \`DOMAIN_PRESERVATION_RULE\`로 중앙 관리. 모든 스킬 prompt에 자동 prepend.

## 2. Intent Extraction 파이프라인

\`\`\`
사용자 입력
   ↓
extractIntent(prompt)   ← skills/_runtime/intent.ts
   ↓
{
  domain: "헬스케어",
  productType: "saas",    ← 도메인과 분리 (SaaS는 product type)
  tone: "차분",
  scope: { needsIA, needsHandoff, ... },
  unknowns: ["timeline", "team-size"],
  confidence: 0.95
}
   ↓
모든 스킬의 input.context.intent로 전달
\`\`\`

**핵심**: Intent 추출은 LLM (또는 휴리스틱) **1회**. 결과는 모든 스킬이 공유.

## 3. Hook 라우팅 — 3단계 fallback

1. **키워드 매칭** — \`data/hooks.json\` (가장 빠름)
2. **intent.scope fallback** — "디자인 시스템 만들어줘" 같이 scope 신호로 매칭
3. **intent.domain fallback** — 도메인만 있어도 UX/UI Planning에 기본 매칭

이 3단계 덕분에 사용자가 명시적 키워드("UX 기획") 없이도 자연스러운 자연어로 라우팅됨.

## 4. UX/UI Planning — 10단계 Atomic Skill (NEW · Phase 5)

UX/UI Planning Work Unit이 **10개 atomic skill**로 분해됐다. 각 스킬은 SKILL.md만 보면 단독으로 이해 가능한 작은 단위:

\`\`\`
common-start
└─ ① ui-ux-requirement-extract-skill          → ui_ux_requirement_summary.md

ui-track (UI 디자이너 시점)
├─ ② ui-element-extract-skill                 → ui_elements.md
├─ ③ ui-foundation-build-skill                → ui_foundation.md
├─ ④ component-spec-write-skill               → component_spec.md
└─ ⑤ sample-screen-design-skill               → sample_screens.md

ux-track (UX 디자이너 시점)
├─ ⑥ ux-process-define-skill                  → ux_process_plan.md
├─ ⑦ user-flow-design-skill                   → user_flow.md
└─ ⑧ ia-build-skill                           → ia.md

common-end
├─ ⑨ handoff-merge-skill                      → handoff.md (UI + UX 통합 마스터)
└─ ⑩ figma-prompt-build-skill                 → figma_prompt.md
\`\`\`

실행은 **순차** (common-start → UI track 4단계 → UX track 3단계 → common-end 2단계).

### Human Gate (Approve / Reject)

\`work-units.json\`에 \`humanGate: true\`가 설정된 워크유닛은 각 스킬 완료 직후 **사용자 승인을 기다린다**.

- **Approve** → 다음 스킬로 진행
- **Reject** → 워크유닛 중단 + Governance > Review Queue로 자동 등록 (localStorage 기반)

Sandbox UI에서 \`HumanGatePanel\`이 Approve/Reject 버튼을 노출. Reject된 런은 Governance 페이지에서 rose 배경 + "Sandbox Reject" 배지로 표시.

### 트랙 시각화

Work Unit Flow의 각 노드에 **좌측 보더 색**으로 트랙 구분:
- slate = common-start
- sky = ui-track
- violet = ux-track
- emerald = common-end

상단에 \`TrackLegend\` 컴포넌트 — 4개 트랙 chip + 트랙별 done/total 카운트.

## 5. AXDD 컨텍스트 프로필 (Phase 6 재정의)

> ⚠️ 이전 버전의 5개 외부 산업 도메인은 회의록 재분석으로 폐기됨. 현재는 AXDD 전사 내부 컨텍스트만.

\`skills/_runtime/domain-profiles.ts\`의 4개 AXDD 컨텍스트:

| 컨텍스트 | Case | 톤 | 페르소나 예 |
|---|:---:|---|---|
| axdd-internal | B | 전문성·효율 | 사내 디자이너 / 프론트엔드 / PM / 운영자 |
| customer-project | C | 적응적·고객사 톤 차용 | 고객사 의사결정자 / AXDD 프로젝트 리드 |
| ds-bootstrap | A | 초안·체계적 | DS 설계자 / 컨트리뷰터 / Design Lead |
| generic | — | 중립 | 사내 사용자 (clarifying 진행) |

색 토큰은 \`data/our-design-system.md\`에서 가져옴 (현재는 \`__TODO__\` scaffold). 외부 산업 어휘(환자/송금자/MZ쇼퍼) 사용 금지.

각 도메인 프로필은:
- 색 토큰 12종
- 페르소나 3종
- User Flow 2종
- Sample Screen 3종 (ASCII 와이어프레임)
- 도메인 특화 컴포넌트 5종 (예: 헬스케어 → PatientCard, MedicationScheduleRow)
- Interaction 5종
- A11y 12항목
- Figma 프레임 11종

## 6. Validation — 4-state + 의미 검증

\`\`\`
형식 검증 (정적 룰)
   - 필수 섹션 존재
   - 마크다운 표 구조
   - 컴포넌트 스펙 5개 이상

의미 검증 (도메인 fit)
   - 도메인 키워드 ≥ 5회 등장
   - 다른 도메인 누출 ≤ 3회
   - 도메인 명시 제목 존재

→ status (4-state):
   passed              (자동 + 휴먼 리뷰 모두 OK)
   passed-with-review  (자동 OK, 휴먼 리뷰만 남음 — 대부분의 정상 케이스)
   needs-review        (warning 있음 — 도메인 누출 등)
   failed              (error 있음 — 필수 섹션 누락 등)
\`\`\`

이전엔 형식만 검증해서 헬스케어 요청에 콘솔 컴포넌트가 들어가도 통과됐음. 지금은 의미 검증이 잡음.

## 7. Bundle — Anthropic Skills 표준 구조

**Work Unit을 단일 Claude Code Skill로 패키징한다.**

\`\`\`
{workunit-id}/                      ← Anthropic Skills 표준 (폴더명 = skill name)
├── SKILL.md                        ← frontmatter (name/description 필수)
├── CATALOG.md                      ← 파일·sub-skill 인덱스
├── README.md                       ← 사람용 시작 문서
├── work-unit.json                  ← 머신 정의
├── references/                     ← 통합 참고자료 (중복 제거)
├── scripts/                        ← 통합 실행 스크립트
├── assets/                         ← 통합 산출물 템플릿
├── tests/                          ← 검증 룰
├── examples/                       ← 도메인별 산출물 샘플 4종
│   ├── healthcare-example.md
│   ├── fintech-example.md
│   ├── ecommerce-example.md
│   └── admin-example.md
├── result/                         ← (옵션) 이번 실행 산출물
└── _dev/                           ← (옵션) Next.js TS 구현 참조 — Claude Code는 무시
    ├── _runtime/                   ← 공유 런타임 8개 모듈
    └── skills/<sub-skill-id>/      ← 5개 sub-skill 원본 (SKILL.md + prompt.ts + runner.ts + mock-output.ts)
\`\`\`

### Claude Code 설치
\`\`\`bash
cp -r ux-ui-planning-workunit/ ~/.claude/skills/
# 또는
mv ux-ui-planning-workunit ~/.claude/skills/
\`\`\`

설치 후 Claude Code가 SKILL.md의 frontmatter (\`name\`, \`description\`)로 자동 트리거 매칭.

### 두 종류 zip
| Zip | 용도 | 포함 |
|---|---|---|
| **결과 zip** (\`결과만\` 버튼) | 산출물 공유 (디자이너·PM) | output / validation / intent / figma-prompt / README / manifest |
| **Bundle zip** (\`Bundle\` 버튼) | Claude Code 재실행 | SKILL.md + CATALOG.md + 7개 폴더 (Anthropic Skills 표준) |

## 8. LLM 통합 경로

ANTHROPIC_API_KEY 환경변수 설정만으로 자동 전환:

| 단계 | Mock | LLM |
|---|---|---|
| Intent 추출 | 휴리스틱 (regex) | LLM 분류 (1회) |
| Hook 라우팅 | 키워드 + 도메인 fallback | LLM 분류기 |
| Skill 실행 | mock-output 함수 (도메인 프로필 기반) | callLlm() — Anthropic API |
| Validation | 정적 룰 + 키워드 카운트 | LLM 메타 평가 추가 |

\`skills/_runtime/llm-client.ts\` — Anthropic API 호출 (fetch only, SDK 의존성 0).
\`skills/_runtime/helpers.ts\` — \`withLlmOrMock()\` 표준 헬퍼.

## 9. 파일 책임 매트릭스

| 파일 | 책임 |
|---|---|
| \`skills/_runtime/intent.ts\` | 도메인·productType·tone·scope·unknowns 추출 |
| \`skills/_runtime/clarifying.ts\` | 정보 부족 시 정적 질문 카탈로그 |
| \`skills/_runtime/domain-profiles.ts\` | 5개 도메인 디자인·UX 컨텍스트 |
| \`skills/_runtime/system-rules.ts\` | DOMAIN_PRESERVATION_RULE 중앙 관리 |
| \`skills/_runtime/helpers.ts\` | withLlmOrMock 표준 헬퍼 |
| \`skills/_runtime/llm-client.ts\` | Anthropic API 클라이언트 |
| \`skills/<category>/<id>/SKILL.md\` | 사람이 읽는 스킬 사양 (frontmatter) |
| \`skills/<category>/<id>/prompt.ts\` | LLM system prompt + buildUser |
| \`skills/<category>/<id>/runner.ts\` | withLlmOrMock 호출하는 진입점 |
| \`skills/<category>/<id>/mock-output.ts\` | intent 기반 동적 mock |
| \`lib/hook-router/\` | 3단계 fallback 라우터 |
| \`lib/result-builders.ts\` | README/intent.md/validation.md 빌더 (공유) |
| \`lib/result-export.ts\` | 클라이언트 결과 zip |
| \`lib/workunit-bundle.ts\` | 서버 Bundle zip (Anthropic Skills 표준) |

## 10. 디버그 / 검증

\`\`\`
# Hook 라우팅 추적
curl -X POST localhost:3017/api/debug-route -d '{"prompt":"디자인해줘 + 헬스케어"}'

# 워크유닛 실행
curl -X POST localhost:3017/api/run -d '{"workUnitId":"ux-ui-planning-workunit","prompt":"..."}'

# Bundle 다운로드 (Claude Code 호환)
curl localhost:3017/api/work-units/ux-ui-planning-workunit/bundle -o bundle.zip
\`\`\`
`,
  },
  {
    id: "claude-code-install",
    title: "Claude Code Install Guide",
    ko: "Claude Code 설치 가이드",
    desc: "다운받은 Bundle zip을 Claude Code에 설치해 자연어로 호출하는 방법.",
    status: "approved",
    emoji: "🚀",
    body: `# Claude Code 설치 가이드

Sandbox 또는 Work Units 탭에서 받은 **Bundle zip**을 Claude Code에 설치하는 절차.

## 1. zip 다운로드

두 가지 경로:

### A. Sandbox에서 (실행 결과 포함)
1. \`/sandbox\` 진입
2. 프리셋 선택 → 실행
3. Output Preview 헤더의 **\`📦 Bundle (결과 + 스킬셋)\`** 버튼

### B. Work Units에서 (스킬셋만)
1. \`/work-units\` 진입
2. 워크유닛 선택
3. 우상단 **\`📦 Bundle zip\`** 버튼 — GET /api/work-units/[id]/bundle

## 2. 압축 풀기

받은 \`{workunit-id}-bundle-{timestamp}.zip\`을 풀면:

\`\`\`
ux-ui-planning-workunit/         ← 폴더명 = skill name (frontmatter와 동일)
├── SKILL.md                     ← Claude Code 진입점
├── CATALOG.md
├── README.md
├── references/
├── scripts/
├── assets/
├── tests/
├── examples/
└── _dev/                        ← Claude Code는 이 폴더 무시
\`\`\`

## 3. Claude Code에 설치

### macOS / Linux
\`\`\`bash
cp -r ux-ui-planning-workunit/ ~/.claude/skills/
# 또는
mv ux-ui-planning-workunit ~/.claude/skills/
\`\`\`

### Windows (PowerShell)
\`\`\`powershell
Copy-Item -Recurse ux-ui-planning-workunit/ $env:USERPROFILE\\.claude\\skills\\
# 또는
Move-Item ux-ui-planning-workunit $env:USERPROFILE\\.claude\\skills\\
\`\`\`

설치 후 Claude Code 재시작 (필요 시).

## 4. 자연어로 호출

설치된 skill은 \`SKILL.md\`의 frontmatter (\`name\`, \`description\`)로 트리거 매칭된다.

\`\`\`
"신규 헬스케어 SaaS 환자 대시보드를 기획해서 핸드오프 문서까지 만들어줘"
"엔터프라이즈 어드민 데이터 테이블 위주로 디자인 시스템 + 컴포넌트 스펙"
"패션 이커머스 모바일 MZ 타겟 풀세트"
\`\`\`

Claude Code가 자동으로 skill을 활성화해 \`SKILL.md\`의 워크플로 5단계를 실행한다.

## 5. 결과 확인

Skill이 실행되면 다음 산출물이 생성된다.

- 요구사항 요약
- UI Foundation (도메인 톤 반영 토큰)
- UX Process Plan (도메인 페르소나·플로우)
- **마스터 핸드오프 문서** (10개 섹션)
- Validation Report (4-state + 도메인 fit)

도메인 보존 규칙이 자동 적용되어 사용자 요청 도메인이 모든 산출물에 일관 유지된다.

## 6. 트러블슈팅

### Claude Code가 스킬을 인식 못 함
- 폴더가 \`~/.claude/skills/<workunit-id>/\` 경로에 있는지 확인
- 폴더 안에 \`SKILL.md\`가 root에 있는지 확인 (sub-folder 안에 있으면 안 됨)
- \`SKILL.md\` 첫 줄이 \`---\` (frontmatter 시작)인지 확인
- Claude Code 재시작

### 도메인이 잘못 인식됨
- 프롬프트에 도메인 키워드(헬스케어/핀테크/이커머스/어드민)를 명시
- \`examples/\` 폴더의 샘플을 참조해 비슷한 형태로 입력

### LLM 응답이 mock과 동일함
- \`ANTHROPIC_API_KEY\` 환경변수가 Claude Code에 전달되는지 확인
- mock 모드에서는 도메인 프로필 기반 정적 출력이 나오는 게 정상

## 7. 다중 스킬 설치

여러 워크유닛 Bundle을 동시에 설치 가능:

\`\`\`
~/.claude/skills/
├── ux-ui-planning-workunit/
├── kickoff-report-workunit/
└── cicd-setup-workunit/
\`\`\`

각 skill은 독립된 \`SKILL.md\`를 가지며 Claude Code가 자연어 의도에 따라 적합한 skill을 선택한다.

## 8. 업데이트

새 Bundle을 받으면 기존 폴더 위에 덮어쓰기:

\`\`\`bash
rm -rf ~/.claude/skills/ux-ui-planning-workunit/
cp -r ux-ui-planning-workunit/ ~/.claude/skills/
\`\`\`

\`work-unit.json\`의 버전 필드 또는 \`SKILL.md\` frontmatter \`version\` 필드로 추적 가능.
`,
  },
  {
    id: "standard-kit",
    title: "Standard Kit Spec",
    ko: "표준 키트 스펙",
    desc: "Anthropic Skills 표준 + AXDD 확장. Skill 폴더 구조, frontmatter, 검증 룰.",
    status: "approved",
    emoji: "📦",
    body: `# Standard Kit Spec

AXDD SkillOps Console의 모든 스킬은 **Anthropic Skills 표준**을 따른다.

## 1. 스킬 단위와 워크유닛 단위

| 단위 | 정의 | 폴더 위치 |
|---|---|---|
| **Skill** (sub-skill) | 단일 작업 능력 | \`skills/<category>/<skill-id>/\` |
| **Work Unit** (메가 스킬) | 여러 sub-skill의 체인 — Claude Code에는 단일 skill로 패키징 | \`{workunit-id}/\` (Bundle zip) |

Claude Code에 배포될 때는 워크유닛이 **단일 Anthropic Skill**로 합쳐진다.

## 2. Anthropic Skills 표준 폴더 구조

\`\`\`
<skill-name>/
├── SKILL.md          ← 필수. frontmatter 포함
├── references/       ← 참고자료 (옵션)
├── scripts/          ← 실행 스크립트 (옵션)
├── assets/           ← 템플릿 (옵션)
└── tests/            ← 검증 룰 (옵션)
\`\`\`

AXDD는 여기에 확장:
\`\`\`
<skill-name>/
├── SKILL.md          ← (표준)
├── CATALOG.md        ← (AXDD) 내부 sub-skill / 파일 인덱스
├── README.md         ← (AXDD) 사람용 시작 문서
├── work-unit.json    ← (AXDD) 머신 정의
├── references/       ← (표준)
├── scripts/          ← (표준)
├── assets/           ← (표준)
├── tests/            ← (표준)
├── examples/         ← (AXDD 강화) 도메인별 샘플
├── result/           ← (AXDD) 실행 결과 보관 (옵션)
└── _dev/             ← (AXDD) Next.js TS 구현 참조 — Claude Code 무시
\`\`\`

## 3. SKILL.md frontmatter (필수)

\`\`\`md
---
name: kebab-case-id
description: 한 줄 설명 (Hook 라우팅에 사용됨)
version: 1.0.0
category: workunit | simple | reference | template | script | asset | fullstep | metadata | test
owner: Product Design | Engineering | Operations | QA
---

# Skill Title

본문...
\`\`\`

| 필드 | 필수 | 용도 |
|---|---|---|
| \`name\` | ✅ | Claude Code의 skill 식별자 |
| \`description\` | ✅ | 자연어 트리거 매칭 |
| \`version\` | ⚪ | 업데이트 추적 |
| \`category\` | ⚪ | AXDD 분류 |
| \`owner\` | ⚪ | 책임자 |

## 4. SKILL.md 본문 구조 (권장)

워크유닛(메가 스킬) SKILL.md는 다음 섹션을 포함한다.

1. **🛡 Domain Preservation 규칙** — 가장 먼저
2. **When to Use** — 키워드 + 자연어 의도
3. **Workflow** — N단계 sub-skill 명세
4. **Input / Output**
5. **Validation** — 형식 + 의미 + 휴먼 리뷰
6. **Files Index** — references/scripts/assets/tests/examples 안내
7. **Quick Start** — 자연어 호출 예시

## 5. 도메인 보존 규칙 (핵심)

모든 워크유닛 SKILL.md는 상단에 도메인 보존 규칙을 명시한다.

\`\`\`md
## 🛡 Domain Preservation (최우선 규칙)

사용자 요청에 명시된 도메인·제품 유형·타깃 사용자·톤앤매너를
**모든 산출물에서 일관 유지**하라.

### 금지
- 내부 예시(AXDD SkillOps Console 등) 컨텍스트를 가져와 산출물 도메인을 덮어쓰는 것
- 사용자 도메인을 일반론으로 흐리는 것

### 지원 도메인
- 헬스케어 (신뢰·차분 / 청록·sky)
- 핀테크 (전문성·정확 / 짙은 청·골드)
- 이커머스 (트렌디·활발 / 코랄·핑크)
- 어드민 (효율·차분 / 청·슬레이트)
- SaaS (미니멀 / 인디고·시안)
\`\`\`

원본 규칙은 \`references/domain-preservation-rule.md\`에 보관.

## 6. references/ 구성

표준 참고자료:
- \`design-system.md\` — 디자인 시스템 가이드
- \`brand-tokens.json\` — 브랜드 토큰 export
- \`domain-profiles.md\` — 5개 도메인 프로필 요약
- \`domain-preservation-rule.md\` — 도메인 보존 규칙 원본
- \`validation-rules.md\` — 검증 룰 정의
- \`<workflow>-rule.md\` — 워크플로 특화 룰

여러 sub-skill이 같은 파일을 참조하면 Bundle export 시 **중복 제거** 후 통합.

## 7. examples/ (AXDD 강화)

도메인별 산출물 샘플 4종 — Claude Code가 skill을 어떻게 사용하는지 학습.

\`\`\`
examples/
├── README.md
├── healthcare-example.md       ← 헬스케어 + saas + 차분
├── fintech-example.md          ← 핀테크 + mobile-app + 전문성
├── ecommerce-example.md        ← 이커머스 + mobile-app + MZ
└── admin-example.md            ← 어드민 + admin + 엔터프라이즈
\`\`\`

각 파일 상단에 사용된 \`intent\` (도메인 / productType / 톤 / 프롬프트) 주석.

## 8. tests/ 검증 룰

| 룰 | 종류 | 예시 |
|---|---|---|
| 형식 검증 | 정적 | "10개 H2 섹션 모두 존재" |
| 의미 검증 | 도메인 fit | "도메인 키워드 ≥ 5회 등장" |
| 휴먼 리뷰 | 사람 | "브랜드 톤 최종 확인 필요" |

검증 결과는 4-state: \`passed\` / \`passed-with-review\` / \`needs-review\` / \`failed\`.

## 9. _dev/ (옵션, Claude Code는 무시)

Next.js TypeScript 구현 참조 코드. 개발자가 자신의 프로젝트로 옮길 때 활용.

\`\`\`
_dev/
├── README.md
├── _runtime/                  ← 공유 런타임 8개
└── skills/<sub-skill-id>/     ← sub-skill 원본
    ├── SKILL.md
    ├── prompt.ts              ← LLM system prompt
    ├── runner.ts              ← withLlmOrMock 진입점
    └── mock-output.ts         ← 도메인 기반 동적 출력
\`\`\`

Claude Code는 \`_\` 시작하는 폴더를 무시한다.

## 10. 새 워크유닛 추가 절차

1. **개별 sub-skill 작성**: \`skills/<category>/<skill-id>/\`에 SKILL.md + prompt.ts + runner.ts + mock-output.ts
2. **workunits.json에 등록**: skills 배열 + triggerHooks + input/output 정의
3. **hooks.json에 트리거 키워드 추가** (옵션)
4. **registry.ts에 import**: \`skills/_runtime/registry.ts\`
5. **Sandbox에서 시연**: \`/sandbox\` 진입 → 자연어 입력 → 실행
6. **Bundle export 확인**: \`/work-units\` → \`Bundle zip\` 버튼 → 받은 zip 압축 풀고 Anthropic Skills 표준 구조 확인
`,
  },
  {
    id: "agent-creation",
    title: "Agent Creation Guide",
    ko: "에이전트 생성 가이드",
    desc: "신규 sub-skill·워크유닛·Hook을 추가하는 단계별 절차.",
    status: "approved",
    emoji: "🧠",
    body: `# Agent Creation Guide

신규 에이전트는 두 레이어로 분해된다.

## 1. Skill (sub-skill, 단일 작업)

재사용 가능한 작업 1개 = 1개 Skill. 카테고리 8종:

| 카테고리 | 역할 | 예 |
|---|---|---|
| **simple** | 단순 텍스트 변환 | simple-summary-skill |
| **reference** | 외부 자료 참조 후 생성 | design-system-reference-skill |
| **template** | 정형 템플릿 채우기 | kickoff-report-template-skill |
| **script** | 외부 스크립트 호출 | html-milestone-generator-skill |
| **asset** | 작업 단위 풀셋 | ux-process-asset-skill |
| **fullstep** | 위 4종 통합 | ux-ui-handoff-fullstep-skill |
| **metadata** | 메타데이터 검색 | asset-metadata-search-skill |
| **test** | 산출물 검증 | output-validation-skill |

## 2. Work Unit (스킬 체인, 메가 스킬)

여러 Skill을 순서대로 묶은 업무 실행 세트.
- 1개 트리거 Hook과 연결
- Skill의 output을 다음 Skill의 input으로 chain
- 마지막에 validation Skill 자동 실행
- **Claude Code에는 단일 Anthropic Skill로 패키징되어 배포됨**

## 3. Hook (라우팅 룰)

사용자 자연어 입력 → 어떤 Work Unit을 실행할지 결정.

3단계 fallback:
1. **키워드 매칭** — data/hooks.json의 키워드
2. **intent.scope** — 작업 신호 (needsHandoff, needsIA 등)
3. **intent.domain** — 도메인만 있어도 기본 워크유닛으로

## 4. 새 sub-skill 추가 절차

### Step 1. 폴더 생성
\`\`\`
skills/<category>/<skill-id>/
├── SKILL.md
├── prompt.ts
├── runner.ts
└── mock-output.ts
\`\`\`

### Step 2. SKILL.md 작성
\`\`\`md
---
name: my-new-skill
description: 한 줄 설명
category: simple
version: 0.1.0
owner: Product Design
---

# My New Skill

## Input
- raw_document.md

## Output
- summary.md

## How it works
...
\`\`\`

### Step 3. prompt.ts 작성 (도메인 보존 규칙 prepend)
\`\`\`ts
import type { SkillPromptTemplate } from "../../_runtime/types";
import { DOMAIN_PRESERVATION_RULE } from "../../_runtime/system-rules";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 1500,
  system: \`\${DOMAIN_PRESERVATION_RULE}

당신은 ...
\`,
  buildUser: (input) => {
    const intent = input.context?.intent;
    return \`\${input.prompt}\\n\\n[Intent]\\n도메인: \${intent?.domain}\`;
  },
};
\`\`\`

### Step 4. mock-output.ts 작성 (intent 기반 동적)
\`\`\`ts
import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildMyOutput(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);
  return \`# \${profile.label}

(도메인 \${profile.id} 기반 산출물)
...
\`;
}
\`\`\`

### Step 5. runner.ts 작성
\`\`\`ts
import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildMyOutput } from "./mock-output";

const runner: SkillRunner = {
  id: "my-new-skill",
  category: "simple",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      buildMock: buildMyOutput,
    });
  },
};

export default runner;
\`\`\`

### Step 6. registry 등록
\`skills/_runtime/registry.ts\`에 import + RUNNERS 배열에 추가.

### Step 7. data/skills.catalog.json에 메타 추가
\`\`\`json
{
  "id": "my-new-skill",
  "name": "My New Skill",
  "category": "simple",
  "description": "...",
  "input": ["raw_document.md"],
  "output": ["summary.md"],
  "files": {
    "skill": "skills/simple/my-new-skill/SKILL.md",
    ...
  },
  "owner": "Product Design",
  "version": "0.1.0",
  "status": "draft",
  "relatedWorkUnits": [...],
  "tags": [...]
}
\`\`\`

## 5. 새 Work Unit 추가 절차

### Step 1. data/work-units.json에 등록
\`\`\`json
{
  "id": "my-new-workunit",
  "name": "My New Work Unit",
  "description": "...",
  "triggerHooks": ["my-new-hook"],
  "skills": [
    "simple-summary-skill",
    "my-new-skill",
    "output-validation-skill"
  ],
  "input": ["raw_requirement.md"],
  "output": ["summary.md", "result.md"],
  "validationSkill": "output-validation-skill",
  "owner": "Product Design",
  "status": "draft"
}
\`\`\`

### Step 2. (옵션) Hook 추가
\`\`\`json
{
  "id": "my-new-hook",
  "name": "My New Hook",
  "conditions": {
    "keywords": ["내 키워드", "another keyword"]
  },
  "targetWorkUnit": "my-new-workunit",
  "priority": 1,
  "enabled": true
}
\`\`\`

### Step 3. Sandbox에서 시연
\`/sandbox\` 진입 → 자연어 입력 → 실행 → 산출물 + 검증 확인.

### Step 4. Bundle export 확인
\`/work-units\` → 본인 워크유닛 선택 → \`📦 Bundle zip\` 다운로드.

압축 풀어 Anthropic Skills 표준 구조 확인:
- \`SKILL.md\` frontmatter
- \`CATALOG.md\`
- \`references/\`, \`scripts/\`, \`assets/\`, \`tests/\`, \`examples/\`

## 6. 검증

- 정적 룰: Validation Skill의 코드로
- LLM 메타 평가: validation prompt
- 휴먼 리뷰: Governance Queue

4-state: \`passed\` / \`passed-with-review\` / \`needs-review\` / \`failed\`.

## 7. Claude Code 배포

Sandbox 또는 Work Units에서 Bundle 다운로드 → \`~/.claude/skills/\`에 풀기 → 자연어 호출.

자세한 절차는 \`Claude Code Install Guide\` 문서 참조.
`,
  },
  {
    id: "playbook",
    title: "Playbook",
    ko: "플레이북",
    desc: "대표 시나리오 3종 + Claude Code 배포까지 end-to-end.",
    status: "approved",
    emoji: "📖",
    body: `# Playbook — End-to-End 시나리오

각 시나리오는 다음 흐름을 따른다:
**Sandbox 실행 → 결과 확인 → Bundle 다운로드 → Claude Code 설치 → 자연어 호출**

## 시나리오 1: 헬스케어 SaaS 환자 대시보드

### Sandbox에서 시연
1. \`/sandbox\` 진입
2. **🩺 헬스케어 SaaS 환자 대시보드** 프리셋 클릭
3. 좌측 \`[실행]\` 클릭
4. 우측에서 5개 sub-skill이 차례로 실행 (cyan glow → 초록 체크)
5. Output Preview에서 10섹션 마스터 핸드오프 확인

### 산출물
- \`requirement_summary.md\` — 환자 도메인 요약
- \`ui_foundation.md\` — teal-600 + sky-500 토큰
- \`ux_process_plan.md\` — 환자/보호자/의료진 페르소나
- \`handoff.md\` — 10섹션 풀세트
- \`figma-prompt.md\` — Figma AI 프롬프트 (그대로 복사 가능)
- \`validation.md\` — 도메인 fit passed

### Claude Code 설치
1. \`📦 Bundle (결과 + 스킬셋)\` 버튼 → zip 다운로드
2. 압축 풀기 → \`ux-ui-planning-workunit/\` 폴더 확인
3. \`~/.claude/skills/\`에 통째로 이동
4. Claude Code에서 자연어 호출:
   \`\`\`
   "신규 헬스케어 SaaS의 환자 대시보드를 기획해서 핸드오프 문서까지 만들어줘"
   \`\`\`

## 시나리오 2: 핀테크 모바일 KYC + 송금

### Sandbox에서 시연
1. **💳 핀테크 신규 사용자 온보딩** 프리셋 클릭
2. \`[실행]\`
3. 결과: KYC 단계 인디케이터 + 송금 + 자산 포트폴리오 핸드오프

### 핵심 컴포넌트 (도메인 특화)
- \`KYCStepIndicator\` (linear/circular × pending/active/done/failed)
- \`AmountField\` (KRW/USD/crypto)
- \`TransactionRow\` (incoming/outgoing/pending)
- \`AssetChart\` (donut/stacked-bar/line)
- \`SecurityVerification\` (password/biometric/otp)

### 디자인 토큰 (도메인 톤)
- primary/navy-900 #0c1c3a
- accent/gold-500 #d4a373
- status/profit #15803d (수익)
- status/loss #b91c1c (손실)

### Claude Code 호출
\`\`\`
"핀테크 모바일 앱 — KYC + 첫 송금 + 자산 포트폴리오 화면 기획해줘"
\`\`\`

## 시나리오 3: 패션 이커머스 모바일 MZ 타겟

### Sandbox에서 시연
1. **🛍️ 패션 이커머스 모바일 리디자인** 프리셋
2. \`[실행]\`
3. 결과: 큐레이션 + 상품 상세 + 장바구니 + 결제 풀세트

### 핵심 컴포넌트
- \`ProductCard\` (grid/horizontal/compact × default/wishlisted/soldout)
- \`PriceTag\` (regular/discounted/hot-deal)
- \`SizeSelector\` (fashion/shoes)
- \`ReviewCard\` (text/photo/fit-info)
- \`CartItem\` (normal/low-stock/out-of-stock)

### 디자인 토큰 (MZ 타겟)
- primary/coral-500 #ff6b6b
- primary/pink-500 #ec4899
- brand/instagram-grad (45deg, orange → pink → purple)

### Claude Code 호출
\`\`\`
"패션 이커머스 모바일 앱 리디자인. MZ 타겟, 인스타그램 비주얼"
\`\`\`

## Edge-case 시나리오

### 모호한 입력 ("디자인해줘")
1. Hook 매칭 실패 → 실행 버튼 비활성
2. **Clarifying Card** 등장 — 도메인 (필수) / 톤 / 플랫폼 선택
3. 답변 후 \`[적용하고 자동 실행]\` → intent.domain fallback으로 라우팅 → 즉시 실행

### 정보 일부 누락 ("엔터프라이즈 어드민 만들어줘")
1. 도메인은 인식됨 (어드민)
2. 누락 정보(타겟 페르소나, 일정, 디자인 시스템) → IntentCard에 ⚠️ 배지
3. 실행 가능 — 산출물에 \`⚠️ TBD\` 표시 + 휴먼 리뷰 항목

### 관련 없는 프롬프트 ("강아지 사료 추천")
1. Hook 매칭 실패 + 도메인 unknown
2. **NoMatchHint** 표시 — "등록된 워크유닛 중 적합 없음" + 시도해볼 키워드 안내
3. 실행 차단

## Bundle 검증 체크리스트

다운로드한 Bundle을 풀면 다음이 모두 있어야 함:

- [ ] \`SKILL.md\` (frontmatter \`name\` · \`description\` 필수)
- [ ] \`CATALOG.md\`
- [ ] \`README.md\`
- [ ] \`work-unit.json\`
- [ ] \`references/\` (6개 이상)
- [ ] \`assets/\` (6개 이상)
- [ ] \`scripts/\` (있을 경우)
- [ ] \`tests/\` (1개 이상)
- [ ] \`examples/\` (4개 도메인 샘플 + README)
- [ ] \`result/\` (실행 결과 포함했을 때)
- [ ] \`_dev/\` (옵션)
`,
  },
  {
    id: "wbs",
    title: "WBS",
    ko: "작업 분해 구조",
    desc: "MVP 5단계 마일스톤 + 현재 진행 상황.",
    status: "approved",
    emoji: "📅",
    body: `# WBS — AXDD SkillOps Console MVP

## Phase 1. Foundation ✅
- [x] Next.js + TypeScript + Tailwind shell
- [x] 글래스모피즘 디자인 토큰
- [x] 사이드바 + 헤더 레이아웃 (overflow-x-hidden 격리)
- [x] 7개 라우트 골격

## Phase 2. Data & Catalog ✅
- [x] data/*.json 5종 (skills/work-units/hooks/assets/runs)
- [x] skills/ 런타임 + 8개 카테고리 슬롯
- [x] mocks/ 격리 + MOCK 마커
- [x] _runtime/ 8개 공유 모듈

## Phase 3. Core Pages ✅
- [x] Overview · KPI + Architecture Status + Activity Feed + Quick Actions
- [x] Skill Library · 필터 / 검색 / Detail Panel (zip 다운로드)
- [x] Work Units · React Flow / Hook 키워드 / I/O 카드 / Bundle zip
- [x] Sandbox · 프리셋 / Hook 라우팅 / 스킬별 실행 상태 / 결과+Bundle 듀얼 다운로드
- [x] Asset Repository · Stats / Detail Panel / 검색
- [x] Governance · Release Pipeline / Review Queue / Domain Fit Distribution

## Phase 4. Robustness ✅
- [x] Intent Extractor (휴리스틱 + LLM 슬롯)
  - [x] domain · productType · tone · scope · unknowns
  - [x] confidence 계산
- [x] Clarifying Questions 카탈로그 (정적 룰베이스)
- [x] Edge-case 프리셋 (모호 / 일부 누락 / 무관)
- [x] Hook 라우터 3단계 fallback
  - [x] 키워드 매칭
  - [x] intent.scope fallback
  - [x] intent.domain fallback
- [x] 5개 Domain Profile (헬스케어/핀테크/이커머스/어드민/SaaS)
  - [x] 색 토큰 12종
  - [x] 페르소나 3종
  - [x] User Flow 2종
  - [x] Sample Screen 3종 (ASCII 와이어프레임)
  - [x] 도메인 특화 컴포넌트 5종
- [x] Domain Preservation Rule (모든 prompt에 자동 prepend)
- [x] 4-state Validation (passed/passed-with-review/needs-review/failed)
- [x] Domain-fit 의미 검증 (키워드 카운트 + 누출 감지)

## Phase 5. Anthropic Skills 호환 ✅
- [x] 동적 mock-output 5종 (intent 기반 도메인별 분기)
- [x] prompt.ts에 DOMAIN_PRESERVATION_RULE prepend
- [x] mock-output에 AXDD anchoring 제거
- [x] **Bundle zip — Anthropic Skills 표준 구조**
  - [x] root에 SKILL.md (frontmatter name/description)
  - [x] CATALOG.md
  - [x] references/ scripts/ assets/ tests/ examples/
  - [x] 통합 + 중복 제거
  - [x] examples/ 4개 도메인 샘플 자동 생성
  - [x] _dev/ 분리 (Claude Code 무시)
- [x] result + Bundle 듀얼 다운로드
- [x] @/ alias 의존성 0
- [x] Bundle registry.ts 동적 생성

## Phase 6. Production (다음) 🚧
- [ ] Anthropic API 연결 (ANTHROPIC_API_KEY)
- [ ] 데이터 저장소 (Postgres/Supabase)
  - [ ] Skill 카탈로그 마이그레이션
  - [ ] Run 이력 영구 저장
- [ ] 인증 (NextAuth — Designer/Developer/Operator 3개 역할)
- [ ] 작업 큐 (Inngest/QStash — 긴 LLM 체인 비동기)
- [ ] 파일 스토리지 (Vercel Blob/S3 — 산출물 영구 저장)
- [ ] 관찰성 (Sentry + Langfuse — LLM 비용·지연)
- [ ] Figma MCP wiring (보안정책 해제 시)
- [ ] CI/CD (GitHub Actions + Vercel preview)

## 검증된 시나리오 (실측)

| 시나리오 | 도메인 키워드 | 다른 도메인 누출 | Validation |
|---|---|---|---|
| 헬스케어 SaaS 환자 대시보드 | 107회 | 0회 | passed |
| 핀테크 KYC + 송금 | 113회 | 2회 | passed |
| 패션 이커머스 MZ | 119회 | 2회 | passed |
| 엔터프라이즈 어드민 | 66회 | 1회 | passed |
| "디자인해줘" (모호) | — | — | 차단 (Clarifying) |
| "강아지 사료" (무관) | — | — | 차단 (NoMatch) |

## 외부 평가 점수 변화

| 측정 시점 | 점수 | 비고 |
|---|---|---|
| 1차 (기본 MVP) | 62 | 도메인 충실도 실패 |
| 2차 (mock 분리) | 78 | 중복 제거 + 동적 |
| 3차 (Intent + 도메인 프로필) | 82 | Bundle 시작 |
| 4차 (전문가 5개 결함 수정) | 89 | productType 분리 + UX 흐름 |
| **현재 (Anthropic Skills 표준)** | **~93** | Claude Code 직접 호환 |
`,
  },
];
