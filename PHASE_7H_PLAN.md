# Phase 7-H 작업 계획서 — KT Design System Adapter 통합

> **작성일**: 2026-05-28
> **이전 결과**: Phase 7-G (zip 100KB / 62 파일 / 하네스 레이어 + design-system-ingest-skill)
> **목표**: KT Design System 3개 파일을 어댑터로 편입 + JSON/Tailwind/Figma 매핑 + 관리자 컴포넌트 보강

---

## 1. 받은 자산 (사용자 제공)

| 원본 | 위치 | 비고 |
|---|---|---|
| `D:/Downloads/KT/kt-ds/CLAUDE.md` | KT DS 가이드 (Seamless Flow) | **루트 CLAUDE.md 덮어쓰지 말 것** |
| `D:/Downloads/KT/kt-ds/tokens.css` | KT 토큰 (CSS variables) | 그대로 사용 가능 |
| `D:/Downloads/KT/kt-ds/components.css` | KT 컴포넌트 클래스 | 하드코딩 hex 4건 토큰화 필요 + admin 컴포넌트 추가 |

## 2. 편입 위치 (변경 금지)

```
reference/kt-design-system/                  ← 정적 자산 (콘솔 레포 내부)
├── kt-design-system-guide.md                (원본 CLAUDE.md 이름 변경)
├── kt-tokens.css                            (원본 tokens.css)
├── kt-components.css                        (원본 components.css + 토큰화 + admin 컴포넌트)
├── kt-design-tokens.json                    (신규 — CSS variables → JSON)
├── kt-tailwind-mapping.md                   (신규)
├── kt-figma-variable-mapping.md             (신규)
└── kt-component-library-template.md         (신규)
```

Enterprise zip 생성 시 → `skills/design-system-ingest-skill/{references,assets}/` 로 자동 복사.

## 3. 작업 단계

### Step 1. KT 정적 자산 7개 작성
- `kt-design-system-guide.md` — CLAUDE.md 원본 그대로 (이름만 변경)
- `kt-tokens.css` — tokens.css 원본 그대로
- `kt-components.css` — components.css 원본 + 4개 토큰 추가 + admin 컴포넌트 13종
- `kt-design-tokens.json` — JSON 시드
- `kt-tailwind-mapping.md` — Tailwind config 변환 가이드
- `kt-figma-variable-mapping.md` — Figma Variables 매핑
- `kt-component-library-template.md` — Figma component set 문서

### Step 2. components.css 토큰화 + admin 컴포넌트
신규 토큰:
- `--kt-white: #FFFFFF`
- `--kt-black-hover: #000000`
- `--kt-danger-hover: #B61E32`
- `--kt-success-bright: #4ADE80`

하드코딩 교체:
- `#000` → `var(--kt-black-hover)`
- `#B61E32` → `var(--kt-danger-hover)`
- `#4ADE80` → `var(--kt-success-bright)`
- `#fff` (background/color 위치만) → `var(--kt-white)` (SVG data URI · checkbox 점은 그대로)

신규 관리자 컴포넌트 (13종):
- `.kt-sidebar`
- `.kt-page-header`
- `.kt-toolbar`
- `.kt-filter-bar`
- `.kt-data-table` (또는 `.kt-table` dense 확장)
- `.kt-pagination`
- `.kt-drawer`
- `.kt-empty-state`
- `.kt-loading-state`
- `.kt-metric-card`
- `.kt-status-summary`
- `.kt-approval-timeline`
- `.kt-audit-log`

### Step 3. skills.catalog.json 의존성 갱신
`design-system-ingest-skill`의 `files.references` / `files.assets` 에 KT 파일 7개 추가.

### Step 4. enterprise-export.ts에서 KT 자산 복사
`reference/kt-design-system/` 폴더 컨텐츠를 `design-system-ingest-skill/references|assets/` 에 자동 복사.
파일명 패턴(`kt-*.css|md|json`)을 보고 references vs assets 라우팅:
- `.md` 파일 중 `*-guide.md` → references
- 나머지 (`.css`, `.json`, `*-mapping.md`, `*-template.md`) → assets

### Step 5. design-system-ingest-skill의 SKILL.md 업데이트
KT 디자인 시스템 인지 명시:
- "KT 디자인 시스템 파일이 제공되면 자동 인식"
- 출력에 `design_system_profile.md`에 KT 출처 명시

### Step 6. README/CLAUDE.md 안내
- KT DS는 **어댑터** — 루트 라우터 X
- 고객사 DS 인풋 없으면 AXDD 베이스 폴백
- Figma MCP는 optional, 수동 지시서 기본

### Step 7. 검증
- typecheck + build
- Enterprise zip 재생성
- `skills/design-system-ingest-skill/` 안에 KT 파일 7개 모두 포함
- axe_check.py validate-skill 11/11
- validate-workunit --lite 통과
- scaffold 마커 0
- design_tokens.json + kt-design-tokens.json 모두 valid JSON
- Standard Kit ZIP 회귀

### Step 8. (사용자 OK 후) 커밋·푸시

## 4. 변경 금지 사항

1. **루트 `CLAUDE.md`는 AXDD 라우터 유지** — KT 가이드로 덮어쓰기 금지
2. **flat `skills/<name>/`** 구조 유지
3. **기존 11개 atomic skill** 보존
4. **자동 푸시 금지** — 사용자 OK 후 commit + push

## 5. Acceptance Criteria

- [ ] `reference/kt-design-system/` 폴더에 KT 자산 7개
- [ ] components.css 4개 신규 토큰 + admin 13개 컴포넌트
- [ ] components.css 하드코딩 hex 4건 모두 토큰화 (SVG data URI 제외)
- [ ] Enterprise zip의 `skills/design-system-ingest-skill/references/` 에 `kt-design-system-guide.md`
- [ ] Enterprise zip의 `skills/design-system-ingest-skill/assets/` 에 `kt-tokens.css` / `kt-components.css` / `kt-design-tokens.json` / `kt-tailwind-mapping.md` / `kt-figma-variable-mapping.md` / `kt-component-library-template.md`
- [ ] 루트 `CLAUDE.md`는 라우터 유지 (덮어쓰지 않음)
- [ ] `axe_check.py validate-skill skills/design-system-ingest-skill` 통과
- [ ] `kt-design-tokens.json` valid JSON
- [ ] `python -c "import json; json.load(...)"` 으로 검증 가능
- [ ] typecheck + build 통과
- [ ] Scaffold 마커 0
- [ ] Standard Kit ZIP 회귀 OK
