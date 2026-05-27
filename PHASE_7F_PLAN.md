# Phase 7-F 작업 계획서 — Scaffold → Real UX/UI Content

> **작성일**: 2026-05-28
> **이전 결과**: Phase 7-E (zip 55KB / 47 파일 / scaffold placeholder)
> **목표**: scaffold 마커가 들어있는 references/assets/tests를 실제 UX/UI 실무 컨텐츠로 교체.
> 추가로 workunit.yaml axe_check 호환 / AGENT_CREATION_GUIDE 재작성 / 일관성 정정.

---

## 1. 우선순위

### P0 (반드시)
- [ ] **scaffold dependency 파일을 실제 UX/UI 컨텐츠로 교체** (14+ 파일)
- [ ] **workunit.yaml axe_check 호환** (requiredRolePacks / requiredHandoffs / requiredArtifacts 추가 + axe_check.py Lite mode 패치)

### P1 (강하게 권장)
- [ ] **AGENT_CREATION_GUIDE.md Enterprise Lite용으로 재작성** (broken link 제거)
- [ ] **Status Draft 통일** (SKILL.md metadata / CATALOG / workunit)

### P2 (개선)
- [ ] **CATALOG T1~T8 전체 섹션** (빈 섹션은 "No generated skills in this export.")
- [ ] **Governance 파일명 정규화** (`PR_REVIEW_CHECKLIST.md` → `PR_CHECKLIST.md`)
- [ ] **Scaffold 마커 quality check** (export 후 검출 시 warn)

---

## 2. P0-1: Scaffold 파일 교체 대상 목록

### references/ (skill별 의미 있는 컨텐츠)

| 파일 | 컨텐츠 |
|---|---|
| `references/ui-ux-keyword-list.md` | UI/UX 키워드 카탈로그, 포함/제외 룰, 요구사항 필터링 예시 |
| `references/axdd-design-system.md` | AXDD base DS 원칙·컴포넌트 카테고리·토큰 카테고리·네이밍 룰·폴백 룰 |
| `references/customer-design-system-template.md` | 고객사 DS 인풋 표준 (color/typography/component/brand/a11y 필드) |
| `references/element-categorization.md` | UI 요소 분류 (global / layout / input / feedback / domain-specific) |
| `references/token-naming-convention.md` | color/typography/spacing/radius/shadow/motion 네이밍 룰 + 예시·anti-pattern |
| `references/spacing-scale-guide.md` | 4px/8px 스케일 + 레이아웃·컴포넌트 spacing 룰 |
| `references/double-diamond-method.md` | Discover/Define/Design/Validate 4단계 + 단계별 UX 활동·산출물 |

### assets/ (실제 사용 가능한 템플릿)

| 파일 | 컨텐츠 |
|---|---|
| `assets/component-spec-template.md` | name·purpose·variants·states·props·anatomy·token mapping·a11y·AC |
| `assets/wireframe-template.md` | screen purpose·ASCII wireframe·regions·components·states·responsive |
| `assets/ux-process-asset-pack.md` | persona template·journey map·task scenario·validation checklist |
| `assets/user-flow-template.md` | entry·trigger·state·action·system response·error path·exit |
| `assets/ia-tree-template.md` | route tree·screen hierarchy·navigation rules·orphan check |
| `assets/handoff-doc-template.md` | overview·IA·flows·tokens·components·screens·notes·QA checklist |
| `assets/figma-frame-recipes.md` | frame 구조·auto layout·section order·component library·sample screen·handoff |

### tests/*.md (각 스킬별)

스켈레톤이 아닌 실제 형식:
- purpose
- input condition
- pass criteria
- fail criteria
- manual review checklist

---

## 3. P0-2: workunit.yaml + axe_check Lite mode

### workunit.yaml 추가 필드

```yaml
spec:
  requiredRolePacks: [ux-ui-designer]
  requiredHandoffs: [ux-ui-standard-handoff]
  requiredArtifacts:
    - ui_ux_requirement_summary.md
    - ...
  requiredSkills: [...]      ← 유지
  outputs: [...]             ← 유지
  closureCriteria: [...]     ← 유지
```

### axe_check.py Enterprise Lite mode

새 CLI flag: `--lite`
- `requiredRolePacks` / `requiredHandoffs`가 빈 배열이거나 폴더 실제 X 일 때 fail 대신 warn
- `requiredSkills` 필드를 신규로 인식 (Lite 한정)
- `requiredArtifacts` 모두 있는지 확인

---

## 4. P1: AGENT_CREATION_GUIDE.md 재작성

reference 자료의 203줄짜리 가이드를 Enterprise Lite용으로 축소·재작성:

### 포함되는 내용
- Enterprise Lite zip 구조 설명
- 새 UX/UI atomic skill 만드는 절차 (skills/<name>/ 폴더 생성)
- 호환 frontmatter 작성법 (name + description + metadata)
- references/assets/tests 배치
- CATALOG.md 등록 방법
- validation/axe_check.py 실행
- workunit에 skill 추가

### 제거되는 내용
- `skill-creator-agent/` 참조
- `skills/t1-minimal-sop/` 등 T-sample 참조
- `docs/KT_DELIVERY_WAY_SKILLS_GUIDE_KO.md` 참조
- 외부 URL 참조

---

## 5. P1: Status Draft 통일

생성 시점 export는 모두 `Draft`:
- SKILL.md frontmatter `axdd.status: "Draft"`
- CATALOG.md status 컬럼
- workunit.yaml metadata.status

(소스 `data/skills.catalog.json`의 status (예: `ready-for-test`)는 보존 — 콘솔 내부 표시용. **Enterprise export 시점에만** Draft로 정규화.)

---

## 6. P2: CATALOG T1~T8 전체

빈 섹션도 표시:

```md
## T3 — Script-backed
> 결정적 계산·변환을 위한 stdlib Python 등 외부 스크립트 호출.
_No generated skills in this export._
```

---

## 7. P2: Governance 파일명 정규화

| 현재 | 변경 |
|---|---|
| ACCEPTANCE_RULE.md | ACCEPTANCE_RULE.md (그대로) |
| OWNER_TABLE.md | OWNER_TABLE.md (그대로) |
| **PR_REVIEW_CHECKLIST.md** | **PR_CHECKLIST.md** |
| VERSION_RULE.md | VERSION_RULE.md (그대로) |

README.md 링크도 같이 수정.

---

## 8. P2: Scaffold 마커 Quality Check

export 종료 직전 검사:

```ts
const SCAFFOLD_MARKERS = [
  "Skeleton file auto-generated",
  "실제 자료가 채워질 자리입니다",
  "상태: scaffold",
  "__TODO__",
];
```

각 zip 파일을 스캔해 마커 발견 시 warn (실패 X — Enterprise Lite는 일부 placeholder 허용 가능). 결과는 응답 헤더 또는 zip 내 `examples/quality-report.md`로 첨부.

---

## 9. Acceptance Criteria

작업 완료 조건:

- [ ] scaffold 마커 텍스트가 들어있는 dependency 파일 0건 (TODO 마커는 일부 허용 but 컨텐츠는 실제)
- [ ] `metadata.axdd.dependencies.files`에 적힌 파일 모두 zip 안에 존재 ✓
- [ ] 모든 SKILL.md `axe_check.py validate-skill` 통과 ✓
- [ ] `workunit.yaml` Enterprise Lite mode로 `axe_check.py validate-workunit --lite` 통과
- [ ] AGENT_CREATION_GUIDE.md 내 broken link 0건
- [ ] CATALOG.md에 10개 atomic skill 모두 등재
- [ ] CATALOG.md에 T1~T8 + AXDD Extensions + Work Units 섹션 모두 존재
- [ ] Status `Draft`로 통일
- [ ] UX/UI 특화 (generic AxDD-SKILLS clone 아님)
- [ ] `npx tsc --noEmit` 통과
- [ ] `npx next build` 통과

---

## 10. 작업 순서

```
Step 1. lib/enterprise-export.ts의 buildSkeletonContent 대규모 교체
        → 14+ 파일을 실제 UX/UI 컨텐츠로 (별도 lib/uxui-content.ts로 분리 권장)

Step 2. buildWorkUnitYaml — requiredRolePacks/Handoffs/Artifacts 추가

Step 3. reference/axdd-skills/axe_check.py 에 --lite flag 추가

Step 4. buildAgentCreationGuide() 신규 — Enterprise Lite 가이드 동적 생성

Step 5. 모든 status를 Draft로 통일 (mapStatusToAxdd 단순화)

Step 6. buildRootCatalog — T1~T8 전체 섹션 (빈 섹션 안내 포함)

Step 7. governance-lite 파일명 PR_CHECKLIST.md로 rename + README 링크

Step 8. buildEnterpriseRepository 끝에 quality-check 추가
        → examples/quality-report.md 생성

Step 9. typecheck + build + re-export + 검증
       - axe_check.py validate-skill × 10
       - axe_check.py validate-workunit --lite
       - scaffold 마커 0건 (또는 quality-report 첨부)
       - Standard Kit ZIP 회귀

Step 10. 커밋 + push
```

---

## 11. 변경 금지 사항

1. flat `skills/<skill-name>/` 구조 유지
2. 10개 UX/UI atomic skill 보존 (수축 X)
3. UX/UI 특화 컨텐츠 유지 (generic AxDD-SKILLS clone 금지)
4. T1~T8 폴더 nesting 도입 금지
5. Standard Kit ZIP 동작 보존

---

## 12. 실행 결과 (작업 완료 후 기록)

### Step 1 · 실제 UX/UI 컨텐츠 generator
- 신규: `lib/uxui-content.ts` (1900+ 줄, 14+ 실제 컨텐츠 분기)
- 교체: `lib/enterprise-export.ts`의 buildSkeletonContent → buildUxuiContent
- 삭제: deprecated buildReferenceSkeleton / buildAssetSkeleton / buildScriptSkeleton / buildTestSkeleton (204 줄)

### Step 2-3 · workunit + axe_check Lite + Guide
- `buildWorkUnitYaml`: requiredRolePacks/Handoffs/Artifacts/requiredSkills/closureCriteria 모두 포함
- `reference/axdd-skills/axe_check.py`: `--lite` flag 추가, Lite mode에서 role/handoff/solution 누락은 WARN, requiredSkills 신규 검증
- `buildAgentCreationGuide` 신규 — Enterprise Lite 구조에 맞춰 동적 생성 (broken link 0)

### Step 4-8 · 일관성 + Quality Check
- Status 모두 `Draft` 강제 (frontmatter + CATALOG + workunit)
- CATALOG.md: T1~T8 + AXDD-ext + Work Units 12 섹션 모두 표시 (빈 섹션은 "No generated skills in this export.")
- `PR_REVIEW_CHECKLIST.md` → `PR_CHECKLIST.md` rename (copyDirWithRename)
- `runQualityCheck` 신규: scaffold 마커 스캔 → `examples/quality-report.md` 자동 생성

### Step 9-10 · 검증
| 검증 | 결과 |
|---|---|
| typecheck | ✅ 0 error |
| production build | ✅ 11 routes |
| Enterprise zip 크기 | 33KB (v1) → 55KB (v2) → **77KB (v3)** — 실제 컨텐츠 반영 |
| 파일 수 | 25 → 47 → **48** (quality-report 추가) |
| Scaffold 마커 검출 | ✅ **0건** (모든 파일이 실제 컨텐츠) |
| TODO 마커 | ✅ 0건 (의도된 placeholder 없음) |
| axe_check validate-skill | ✅ **10/10 OK** |
| axe_check validate-workunit --lite | ✅ **OK** (10 skills + required* 모두 통과, role/handoff WARN) |
| CATALOG T1~T8 전체 섹션 | ✅ 12 섹션 |
| Status 일관성 | ✅ 모두 `Draft` |
| Governance 파일명 | ✅ PR_CHECKLIST.md로 정규화 |
| Standard Kit ZIP 회귀 | ✅ 200/98KB |

---

## 13. 작업 완료 (2026-05-28)

사용자 피드백의 모든 P0/P1/P2 항목 해결:
- ✅ P0: Scaffold → 실제 UX/UI 컨텐츠 (zip 77KB)
- ✅ P0: workunit.yaml axe_check 호환 (--lite mode 신규)
- ✅ P1: AGENT_CREATION_GUIDE.md Enterprise Lite 재작성
- ✅ P1: Status Draft 통일
- ✅ P2: CATALOG T1~T8 전체 표시
- ✅ P2: Governance PR_CHECKLIST 정규화
- ✅ P2: Scaffold 마커 quality check (examples/quality-report.md)

전사 배포 준비 완료.
