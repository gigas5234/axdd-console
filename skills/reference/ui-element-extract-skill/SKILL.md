---
name: ui-element-extract-skill
description: AXDD DS 또는 고객사 DS 레퍼런스 + UI/UX 요구사항 → 이 프로젝트에 필요한 UI 요소(컴포넌트 후보) 추출
version: 1.1.0
category: reference
owner: Product Design
---

# UI Element Extract

## 🎯 Purpose
"이 프로젝트에서 어떤 UI 요소(컴포넌트 후보)가 필요한가" 를 결정한다. 다음 스킬(`ui-foundation-build-skill`)의 인풋이 되며, 토큰 정의 범위를 좁히는 역할.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 | 비고 |
|---|---|---|---|---|
| `requirement_summary` | MD | ✅ | previous-skill | Step 1의 출력 |
| `design_system_ref` | MD / 폴더 | ✅ | customer-ds-input → axdd-ds-catalog (fallback) | 우선순위: 고객사 DS → AXDD DS |

## 🔀 분기 (인풋 우선순위)

| 인풋 상태 | 동작 |
|---|---|
| 고객사 DS 있음 + AXDD DS 있음 | 고객사 DS를 **레퍼런스로 차용**, AXDD DS는 공통 컴포넌트 폴백 |
| 고객사 DS 없음 + AXDD DS 있음 | AXDD DS만 사용 (Case B — 내부 신규 화면) |
| 고객사 DS 없음 + AXDD DS 없음 | **이 스킬 실행 불가** — `design-system-bootstrap-workunit` 먼저 권유 |

## 📤 Output
- `ui_elements.md` — 추출된 UI 요소 목록 (Button / Card / Modal / 프로젝트 특화 컴포넌트 등)

## 🔧 동작
1. 디자인 시스템 레퍼런스에서 사용 가능한 요소 카탈로그 로드
2. 요구사항에 맞는 요소 매칭
3. 프로젝트 특화 컴포넌트 식별 (기존 카탈로그에 없으면 신규 후보로 마킹)

## ✅ Validation
- 공용 컴포넌트 ≥ 5종 (예: Button/Card/Input/Modal/Toast)
- 프로젝트 특화 컴포넌트 ≥ 1종
- 요구사항 미커버 영역 0건
- 사용한 DS 출처 명시 (AXDD DS vs 고객사 DS)

## 📚 References
- `references/axdd-design-system.md` — AXDD 자체 디자인 시스템 카탈로그 (없으면 콘솔이 "DS Bootstrap 워크유닛 먼저 실행" 안내)
- `references/customer-design-system-template.md` — 고객사 DS 입력 시 따라야 할 표준 포맷
- `references/element-categorization.md` — 요소 분류 룰
