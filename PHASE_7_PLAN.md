# Phase 7 작업 계획서 — Enterprise Export 중심 재정렬

> **작성일**: 2026-05-28
> **목적**: 콘솔을 AxDD-SKILLS 호환 export 도구로 재정렬. UI는 단순화, 결과물(zip) 품질에 집중.
> **참조**: 사용자 지시 + AxDD-SKILLS reference 저장소 분석 (`.tmp-prev-work/`)

---

## 1. 방향성 (변경 금지 — 작업 중 반복 확인)

| 항목 | 결정 |
|---|---|
| 콘솔 역할 | AxDD-SKILLS 호환 export를 쉽게 뽑는 도구 |
| 정석 | AxDD-SKILLS reference 저장소 (콘솔 ≠ 정석) |
| 최종 결과물 | `axdd-skills-enterprise.zip` |
| 폴더 구조 | flat `skills/<skill-name>/SKILL.md` |
| T1~T8 분류 | CATALOG.md에서 (폴더 nesting X) |
| Frontmatter | 표준 `name + description` + AXDD 확장은 `metadata:` (string→string) |
| Validator | 기존 `axe_check.py` 사용 (재발명 금지) |
| 10 atomic UX/UI skill | 유지 (각각 SKILL.md 생성) |
| Composite kit | `work-units/<kit>/workunit.yaml`로 별도 |
| Sandbox mock/4-Case/9 presets | **삭제 OK** |
| UI Selector | Download 옆 Export Profile dropdown 1개 |

---

## 2. 삭제·축소 대상 (Phase 7-A)

### 2.1 코드 레벨 삭제
- [ ] `mocks/sandbox-presets.ts` — 9개 preset (헬스케어/핀테크/이커머스/ax-bootstrap 등) 전부 삭제 또는 비움
- [ ] `mocks/execution.ts` — `simulateExecution` / `HumanGateRejectedError` 삭제 또는 export only로 단순화
- [ ] `mocks/halted-runs.ts` — Human Gate halted run 큐 삭제
- [ ] `mocks/sample-outputs.ts` — fallback 컨텐츠 삭제
- [ ] `mocks/domain-fit.ts` — 4-Case 도메인 fit 통계 삭제
- [ ] `mocks/validation.ts` — 도메인 키워드 누출 검사 → 단순 "frontmatter valid?" 검증
- [ ] `app/api/design-system/status/route.ts` — DS 상태 카드 API 삭제
- [ ] `data/our-design-system.md` — Phase 6에서 만든 스캐폴드 삭제 (AxDD reference 자료로 대체)
- [ ] `lib/our-design-system.ts` — DS 상태 분석 로직 삭제
- [ ] `components/assets/axdd-ds-card.tsx` — DS 상태 카드 컴포넌트 삭제

### 2.2 UI 단순화
- [ ] Sandbox 페이지 → "Export Builder"로 단순화 (mock 실행 X)
- [ ] WorkUnitFlow의 트랙 시각화 (slate/sky/violet/emerald 보더) 삭제
- [ ] PromptRunner의 HumanGatePanel / TrackLegend / HaltedNotice 삭제
- [ ] Governance의 Domain Fit Distribution → Acceptance Rule 보드로 교체
- [ ] Sandbox preset gallery → Export Profile dropdown으로 교체

### 2.3 데이터 정리
- [ ] `data/work-units.json` — `tracks` / `humanGate` / `skillBranches` / `supportedCases` 필드 삭제 (또는 reference 형식으로 재정의)
- [ ] `data/skills.catalog.json` — 카테고리 값을 T1~T8 매핑으로 업데이트

---

## 3. 유지·강화 대상

### 3.1 절대 유지
- [x] 10 atomic UX/UI skill 폴더 (`skills/<category>/<skill-id>/`) — 각각 SKILL.md 생성 대상
- [x] Anthropic Skills 표준 Bundle export (`lib/workunit-bundle.ts`) — Legacy로 유지 (Standard Kit ZIP)
- [x] `app/api/work-units/[id]/bundle/route.ts` — Standard Kit ZIP endpoint
- [x] `lib/hook-router/` — keyword + scope/domain fallback (단순화 가능)

### 3.2 새로 구현
- [ ] `reference/axdd-skills/` — AxDD-SKILLS reference 자산 정적 복사
  - axe_check.py
  - 8 T-skill SKILL.md (T1~T8)
  - AGENT_CREATION_GUIDE.md
  - templates/ (8종)
  - governance-lite/ (ACCEPTANCE_RULES / OWNER_TABLE / PR_CHECKLIST)
- [ ] `lib/enterprise-export.ts` — `generateEnterpriseRepository(config)` 함수
- [ ] `lib/catalog-generator.ts` — T1~T8 그루핑 CATALOG.md 생성
- [ ] `lib/frontmatter-builder.ts` — 표준 frontmatter + AXDD metadata 빌더
- [ ] `app/api/export/enterprise/route.ts` — POST endpoint
- [ ] Export Profile dropdown UI

---

## 4. 10 atomic skill ↔ T1~T8 매핑 (고정 — 변경 금지)

| Atomic Skill | T-Type | 카테고리 (신) |
|---|---|---|
| `ui-ux-requirement-extract` | T1 Minimal SOP | simple |
| `ui-element-extract` | T2 Reference-heavy | reference |
| `ui-foundation-build` | T2 Reference-heavy | reference |
| `component-spec-write` | T4 Asset-template | asset-template |
| `sample-screen-design` | T4 Asset-template | asset-template |
| `ux-process-define` | T4 Asset-template | asset-template |
| `user-flow-design` | T4 Asset-template | asset-template |
| `ia-build` | T4 Asset-template | asset-template |
| `handoff-merge` | T5 Full-stack | full-step |
| `figma-prompt-build` | T4 Asset-template | asset-template |

기타 기존 skill:
- `simple-summary` → T1, simple
- `stakeholder-map` → T1, simple
- `kickoff-report-template` → T4, asset-template
- `risk-checklist` → T4, asset-template
- `html-milestone-generator` → T3, script
- `asset-metadata-search` → T6, meta-tooling
- `output-validation` → **AXDD Extension: validation-skill** (T1~T8 외)

---

## 5. SkillCategory enum 정렬 (lib/types.ts)

```ts
export type SkillCategory =
  | "simple"              // T1 Minimal SOP
  | "reference"           // T2 Reference-heavy
  | "script"              // T3 Script-backed
  | "asset-template"      // T4 Asset-template (구 "template" + "asset" 통합)
  | "full-step"           // T5 Full-stack (구 "fullstep" → 하이픈)
  | "meta-tooling"        // T6 Meta-tooling (구 "metadata")
  | "integration"         // T7 API/integration (신규)
  | "frontmatter-overlay" // T8 Optional frontmatter (신규)
  | "validation";         // AXDD Extension (구 "test")
```

마이그레이션:
- `template` + `asset` → `asset-template`
- `fullstep` → `full-step`
- `metadata` → `meta-tooling`
- `test` → `validation`

---

## 6. Frontmatter 표준 (변경 금지)

```yaml
---
name: <kebab-case, 디렉토리명과 동일, ≤64자>
description: <1~1024자, what + when>
metadata:
  axdd.title: "<사람 읽는 제목>"
  axdd.version: "0.1.0"
  axdd.type: "T2-reference-heavy"      # T1~T8 또는 "AXDD-validation"
  axdd.category: "ux-ui"
  axdd.owner: "Product Design"
  axdd.status: "Draft"                 # Draft | Accepted
  axdd.tags: "ux,ui,reference"         # 콤마 구분 string
  axdd.inputs: "screen-description,figma-frame"
  axdd.outputs: "element-list,component-candidates"
  axdd.dependencies.files: "references/axdd-design-system.md"
  axdd.dependencies.skills: ""         # composite kit 한정
---
```

**제약**:
- `metadata`는 string→string만 (YAML array/nested object 금지)
- 필요시 `description` 1~1024자 / `name` 디렉토리명 일치 / 외부 URL 1차 정책 차단

---

## 7. Enterprise Export 결과 구조 (목표 — 변경 금지)

```
axdd-skills-enterprise/
├── README.md
├── CATALOG.md                          ← T1~T8 그루핑
├── AGENT_CREATION_GUIDE.md
├── skills/
│   ├── ui-ux-requirement-extract/
│   │   └── SKILL.md
│   ├── ui-element-extract/
│   │   └── SKILL.md
│   ├── ui-foundation-build/
│   │   └── SKILL.md
│   ├── component-spec-write/
│   │   └── SKILL.md
│   ├── sample-screen-design/
│   │   └── SKILL.md
│   ├── ux-process-define/
│   │   └── SKILL.md
│   ├── user-flow-design/
│   │   └── SKILL.md
│   ├── ia-build/
│   │   └── SKILL.md
│   ├── handoff-merge/
│   │   └── SKILL.md
│   └── figma-prompt-build/
│       └── SKILL.md
├── work-units/
│   └── axdd-ux-ui-standard-kit/
│       ├── workunit.yaml
│       ├── CATALOG.md
│       └── README.md
├── governance-lite/
│   ├── ACCEPTANCE_RULES.md
│   ├── OWNER_TABLE.md
│   └── PR_CHECKLIST.md
├── validation/
│   ├── axe_check.py
│   └── validation-log-template.md
└── examples/
    └── README.md
```

---

## 8. 작업 순서 (Phase 7-A → 7-D)

### Phase 7-A: UI / Mock Cleanup
- 2.1 / 2.2 / 2.3 모두 실행
- typecheck 통과 확인
- 빌드 통과 확인

### Phase 7-B: Types Align
- SkillCategory enum 업데이트
- `data/skills.catalog.json` 카테고리 값 마이그레이션
- `lib/types.ts`의 4-Case / SkillBranch 관련 타입 삭제
- 의존 코드 (mocks, components) 정정
- typecheck 통과 확인

### Phase 7-C: Reference 자산 복사 + Enterprise Export
- `reference/axdd-skills/` 디렉토리 생성
- AxDD-SKILLS 핵심 자산 정적 복사 (axe_check.py, AGENT_CREATION_GUIDE.md, templates/, governance-lite/, T1~T8 샘플 SKILL.md)
- `lib/frontmatter-builder.ts` 신규
- `lib/enterprise-export.ts` 신규
- `lib/catalog-generator.ts` 신규
- `app/api/export/enterprise/route.ts` 신규
- Export Profile dropdown UI 추가

### Phase 7-D: 검증
- typecheck + build 통과
- Enterprise export zip 생성
- zip 풀어서 SKILL.md frontmatter 검증
- axe_check.py 실행 (가능하면)
- Standard Kit ZIP 회귀 확인
- 커밋 + 푸시

---

## 9. Acceptance Criteria (최종 검증)

작업 완료 조건:
- [ ] Enterprise Skill Repository export → `axdd-skills-enterprise.zip` 생성됨
- [ ] zip 내 구조가 §7과 정확히 일치
- [ ] 모든 SKILL.md에 `name + description + metadata` 있음
- [ ] `name`이 디렉토리명과 일치
- [ ] `metadata` 값이 모두 string
- [ ] Root CATALOG.md에 T1~T8 그루핑 + AXDD Extensions 섹션
- [ ] T1~T8 폴더 nesting 없음 (flat skills/)
- [ ] `validation/axe_check.py` 포함
- [ ] `work-units/axdd-ux-ui-standard-kit/workunit.yaml` 포함
- [ ] Standard Kit ZIP (기존 Bundle export) 여전히 동작
- [ ] Sandbox mock execution / 4-Case / 9 presets 제거됨
- [ ] tsc 통과
- [ ] next build 통과

---

## 10. 변경 금지 사항 (재확인용)

작업 중 다음을 잊지 않는다:

1. **콘솔이 정석이 아님** — AxDD-SKILLS reference가 정석
2. **UX/UI atomic skill 10개는 묶지 않음** — 각각 개별 SKILL.md
3. **T1~T8은 폴더가 아님** — CATALOG.md 분류
4. **AXDD 확장 필드는 metadata 안에만** — top-level X
5. **axe_check.py 재발명 금지**
6. **Mock 실행 / preset / 4-Case 미련 없이 삭제**
7. **UI는 단순화** — 화려한 시각화보다 export 품질 우선

---

## 11. 실행 결과 (작업 완료 후 기록)

### Phase 7-A · UI/Mock Cleanup
- 삭제: `mocks/sandbox-presets.ts` · `mocks/halted-runs.ts` · `mocks/domain-fit.ts` · `mocks/our-design-system.md` · `lib/our-design-system.ts` · `components/assets/axdd-ds-card.tsx` · `components/sandbox/preset-gallery.tsx` · `app/api/design-system/`
- 단순화: `mocks/execution.ts` (stub) · `mocks/sample-outputs.ts` (stub) · `mocks/validation.ts` (frontmatter 정합성 검사로 단순화) · `data/work-units.json` (tracks/humanGate/skillBranches 제거) · `data/hooks.json` (ds-bootstrap-hook 제거) · `lib/types.ts` (SkillBranch/InputState/InputCase 제거)
- 재작성: `components/sandbox/prompt-runner.tsx` (989 → 360줄, Export Builder로) · `components/work-units/workunit-flow.tsx` (트랙 시각화 제거) · `app/governance/page.tsx` (Domain Fit → Acceptance Rule)

### Phase 7-B · SkillCategory 정렬
- `lib/types.ts`: 8 카테고리 → T1-T8 + validation 9개
- `data/skills.catalog.json`: 모든 category 값 마이그레이션 (template+asset→asset-template, fullstep→full-step, metadata→meta-tooling, test→validation)
- `components/skills/skill-category-filter.tsx` / `app/skills/page.tsx` / `app/api/run/route.ts` 후속 정정

### Phase 7-C · Enterprise Export
- 신규: `reference/axdd-skills/` (axe_check.py · AGENT_CREATION_GUIDE.md · governance-lite/ · templates/ · T1-T8 샘플 정적 복사)
- 신규: `lib/frontmatter-builder.ts` (표준 frontmatter + AXDD metadata)
- 신규: `lib/catalog-generator.ts` (T1~T8 그루핑 CATALOG.md)
- 신규: `lib/enterprise-export.ts` (`buildEnterpriseRepository`)
- 신규: `app/api/export/enterprise/route.ts` (POST + GET)
- Sandbox `prompt-runner.tsx`에 Export Profile dropdown 추가

### Phase 7-D · 검증 결과

| 검증 항목 | 결과 |
|---|---|
| typecheck (`npx tsc --noEmit`) | ✅ 통과 (0 error) |
| production build (`npx next build`) | ✅ 통과 (Sandbox 55→4.4KB) |
| Enterprise export endpoint | ✅ 200 / 33KB zip |
| zip 구조 (flat skills/<name>/SKILL.md × 10 + work-units/ + governance-lite/ + validation/) | ✅ 정합 |
| 각 SKILL.md frontmatter (name + description + metadata) | ✅ 10/10 |
| `axe_check.py validate-skill` 통과 | ✅ 10/10 OK |
| `axe_check.py scan-secrets` 통과 | ✅ OK |
| CATALOG.md T1~T8 그루핑 | ✅ |
| Standard Kit ZIP 회귀 (`/api/work-units/<id>/bundle`) | ✅ 200 / 98KB |

---

## 12. 작업 완료 (2026-05-28)

PHASE_7_PLAN의 모든 단계 완수. AxDD-SKILLS reference 호환 Enterprise zip 생성 가능.
사용자는 zip을 다운받아 `~/.claude/skills/` 또는 `.cursor/skills/`에 풀어
Claude Code · Cursor에서 직접 스킬 실행 가능.
