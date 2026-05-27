---
name: handoff-merge-skill
description: UI 트랙 + UX 트랙 산출물 → 마스터 핸드오프 문서 (프론트 설계서)
version: 1.1.0
category: fullstep
owner: Product Design
---

# Handoff Merge

## 🎯 Purpose
UI 트랙(Step 2-5)과 UX 트랙(Step 6-8) 산출물을 **합쳐서 프론트엔드 개발자가 즉시 구현 가능한 마스터 핸드오프 문서**를 만든다.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 |
|---|---|---|---|
| `ui_foundation` | MD | ✅ | Step 3 |
| `component_spec` | MD | ✅ | Step 4 |
| `sample_screens` | MD | ✅ | Step 5 |
| `ux_process_plan` | MD | ❌ | Step 6 (UX 트랙 skip 시 부재) |
| `user_flow` | MD | ❌ | Step 7 (UX 트랙 skip 시 부재) |
| `ia` | MD | ❌ | Step 8 (UX 트랙 skip 시 부재) |
| `design_system_profile` | MD | ❌ | previous-skill (design-system-ingest) — DS 출처 요약 |
| `design_tokens` | JSON | ❌ | previous-skill (design-system-ingest) — 토큰 사전 |
| `figma_variable_mapping` | MD | ❌ | previous-skill (design-system-ingest) |
| `tailwind_token_mapping` | MD | ❌ | previous-skill (design-system-ingest) — **React 핸드오프 1순위 인용** |
| `component_library_mapping` | MD | ❌ | previous-skill (design-system-ingest) |

## 🔀 분기

| 상황 | 동작 |
|---|---|
| UI + UX 트랙 모두 완료 | 8섹션 풀세트 핸드오프 |
| UI 트랙만 완료 (Bootstrap / UX skip) | UI 5섹션만 + "UX 트랙 미수행" 마커 |
| `design-system-ingest` 산출물 있음 | **핸드오프 상단에 DS 출처 + 토큰 인용 가이드 박스 삽입** |

## 📌 Design System Usage Rule (HARD)

**`design_system_profile`, `design_tokens`, `figma_variable_mapping`, `tailwind_token_mapping`, `component_library_mapping` 가 하나라도 들어오면 핸드오프는 반드시 그것을 1순위로 인용한다.**

- 핸드오프 상단 "DS 출처" 박스에 `design_system_profile.md` 의 요약 (사내 / 고객사 / 신규)을 그대로 인용
- Design Tokens 섹션은 `design_tokens.json` 의 키-값을 그대로 표로 옮긴다 (인라인 hex 금지)
- Component Spec 섹션의 컴포넌트 이름은 `component_library_mapping.md` 의 매핑 사용
- React/TypeScript 코드 스니펫에는 `tailwind_token_mapping.md` 의 Tailwind 클래스 사용
- Figma 핸드오프 노트에는 `figma_variable_mapping.md` 의 Variable 경로 사용
- 미매핑·갈등 케이스도 그대로 핸드오프 부록에 옮긴다 (개발자가 알아야 함)

## 📤 Output
- `handoff.md` — 마스터 핸드오프

## 🔧 동작 (8섹션 구조 — 풀세트 기준)
1. **Project Overview** — 프로젝트명·요구사항 요약·페르소나·KPI
2. **Information Architecture** — Step 8 결과
3. **User Flow** — Step 7 결과
4. **Design Tokens** — Step 3 결과
5. **Component Spec** — Step 4 결과
6. **Sample Screens** — Step 5 결과
7. **Interaction & Motion** — UI Foundation의 motion 가이드 발췌
8. **A11y · QA Matrix** — a11y 체크리스트 + 브라우저/breakpoint 매트릭스

## ✅ Validation
- 8섹션 모두 존재 (UI-only 모드는 5섹션 + UX skip 마커)
- UI 트랙 산출물이 모두 합쳐짐
- 마크다운 표 구조 정확
- 사용된 DS 출처가 문서 상단에 명시 (AXDD DS / 고객사 DS / 신규 DS)

## 📚 Assets
- `assets/handoff-doc-template.md` — 마스터 핸드오프 템플릿 (풀세트 + UI-only 두 버전)
