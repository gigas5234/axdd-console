---
name: design-system-ingest-skill
description: 고객사 또는 사내 디자인 시스템 자료(브랜드 가이드 / Figma library / 토큰 표 등)를 받아 AXDD 표준 폼으로 변환하는 ingest 스킬
version: 1.0.0
category: reference
owner: Product Design
---

# Design System Ingest

## 🎯 Purpose
사용자가 다음 중 하나를 제공할 때 AXDD 표준 frameworked 폼으로 변환한다:

- 브랜드 가이드 문서
- Figma library 설명
- 기존 디자인 시스템 (사내 또는 고객사)
- token table
- component library 룰
- 고객사 UI guideline

다음 단계인 `ui-foundation-build-skill`이 이 산출물을 입력으로 받아 토큰 풀세트를 정의한다.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 | 비고 |
|---|---|---|---|---|
| `ds_source` | MD / URL / JSON / 폴더 | ❌ | user-input | 미제공 시 AXDD 베이스로 폴백 |
| `requirement_summary` | MD | ✅ | previous-skill | Step 1의 출력 (UI/UX 요구) |

## 🔀 분기 (DS 출처 우선순위)

| 상황 | 동작 |
|---|---|
| 고객사 DS 인풋 있음 | `customer-design-system-template.md` 기준 매핑 → 고객사 토큰 우선 |
| 사내 AXDD DS만 있음 | AXDD 베이스 DS 사용 (`fallback applied: false`) |
| DS 인풋 전혀 없음 | AXDD 베이스 DS 폴백 (`fallback applied: true`, "고객 DS 입력 요청" 메모) |

## 📤 Output

- `design_system_profile.md` — 사용된 DS 출처·매핑 요약
- `design_tokens.json` — 머신 읽기 가능한 토큰 사전 (Tailwind config 시드 가능)
- `tailwind_token_mapping.md` — Tailwind config 변환 가이드
- `figma_variable_mapping.md` — Figma Variables 매핑
- `component_library_mapping.md` — 고객사 컴포넌트 ↔ AXDD 컴포넌트

## 🔧 동작

1. DS 인풋 검증 (URL accessible? MD 파싱 가능? Figma export 형식?)
2. Color / Typography / Spacing / Radius / Shadow / Motion 토큰 추출
3. AXDD 표준 네이밍(`color/brand/primary` 등)으로 alias 매핑
4. Tailwind config 형태로 변환 (`tailwind.config.js`의 `theme.extend.colors`)
5. Figma Variables 형태로 변환 (이름·타입·collection 분류)
6. 컴포넌트 라이브러리 매핑 (고객사 컴포넌트명 ↔ AXDD 컴포넌트명)
7. 미매핑 항목·갈등 케이스 명시

## ✅ Validation

- `design_tokens.json` 이 valid JSON
- 모든 hex 값이 `#RRGGBB` 형식 (인라인 hex 우회 X)
- Tailwind config 시드가 valid JS object 구조
- 컴포넌트 매핑 ≥ 5건 (Button/Card/Input/Modal/Toast 최소)
- DS 출처 명시 (사내 / 고객사 / 폴백)
- 미매핑 항목 ≤ 30% (이상이면 fallback applied 표기)

## 📚 References

- `references/customer-design-system-template.md` — 고객사 DS 인풋 표준 폼
- `references/token-naming-convention.md` — AXDD 토큰 네이밍 룰
- `references/spacing-scale-guide.md` — 4의 배수 spacing

## 📦 Assets

- `assets/design-token-template.json` — 토큰 JSON 시드
- `assets/tailwind-token-mapping.md` — Tailwind config 변환 가이드
- `assets/figma-variable-mapping.md` — Figma Variables 매핑
- `assets/component-library-template.md` — 컴포넌트 라이브러리 매핑 양식

## 🧭 사용 예시

- "우리 회사 디자인 시스템 기준으로 관리자 화면을 만들어줘. Primary는 deep blue, Card radius 12px, Dense table 지원해야 해."
- "고객사 Figma library URL 받았어. 우리 표준에 맞춰 변환해줘."
- "기존 사내 토큰 표를 Tailwind config 시드로 만들어줘."
- "KT 디자인 시스템 기준으로 만들어줘" / "KT Red CTA, Seamless Flow 모션"

## 🏢 KT Design System Adapter (Phase 7-H 포함)

이 스킬은 KT 디자인 시스템을 사전 어댑터 형태로 함께 묶어 export합니다.

| 파일 | 위치 | 용도 |
|---|---|---|
| `kt-design-system-guide.md` | references/ | "Seamless Flow" 가이드 (CLAUDE.md 원본 — 루트 라우터 X) |
| `kt-tokens.css` | assets/ | CSS variables 토큰 (라이브 사용 가능) |
| `kt-components.css` | assets/ | 컴포넌트 클래스 + 13종 admin 컴포넌트 |
| `kt-design-tokens.json` | assets/ | **W3C DTCG 포맷** 정본 — Tokens Studio / Style Dictionary / Figma 변수 임포트용 (`$value`, `$type`, alias `{color.brand.red}`) |
| `kt-design-token-seed.json` | assets/ | Claude 가독성 우선 단순 시드 — LLM이 빠르게 읽어 토큰을 코드 한 줄로 인용할 때 사용 (DTCG의 평탄화 버전) |
| `kt-tailwind-mapping.md` | assets/ | React/Tailwind handoff — `darkMode: ['class', '[data-theme="dark"]']` + 시맨틱 별칭(`bg`, `fg`, `border`) + ESLint plugin 권장 |
| `kt-figma-variable-mapping.md` | assets/ | Figma Variables 매핑 — 4 컬렉션(Primitives / Semantic Light·Dark / Typography / Spacing & Layout) + Tokens Studio sync 옵션 |
| `kt-component-library-template.md` | assets/ | Figma 라이브러리 구성 카탈로그 |

**📌 Two Token Files — When to Use Which**

- `kt-design-tokens.json` (W3C DTCG) — **디자인 ↔ 코드 자동화 파이프라인**의 입력. Tokens Studio, Style Dictionary, Figma Variables 임포트, Tailwind 빌드 등 외부 도구가 그대로 소비할 수 있는 표준 포맷.
- `kt-design-token-seed.json` (simplified) — **Claude/LLM 가독성**용. `color.brand.red = "#E60012"` 같은 직관적 키-값으로 1-depth flatten되어 있어, LLM이 산출물 작성 중 토큰을 인용할 때 빠르게 참조.

두 파일은 **동기화 대상** — 한쪽을 수정하면 다른 쪽도 동일 값으로 맞춰야 한다. DTCG 쪽을 정본(source of truth)으로 두고 seed를 derived로 다룬다.

**호출 트리거**:
- 사용자 요청에 "KT" / "Seamless Flow" / "KT Red" 키워드 포함 → KT 어댑터 우선 사용
- 사용자가 별도 DS 인풋 안 줌 + 일반 요청 → AXDD 베이스 사용 (KT 어댑터 X)
- 사용자가 다른 고객사 DS 인풋 줌 → 그것 우선 + AXDD 폴백

