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

## 🔀 분기

| 상황 | 동작 |
|---|---|
| UI + UX 트랙 모두 완료 | 8섹션 풀세트 핸드오프 |
| UI 트랙만 완료 (Bootstrap / UX skip) | UI 5섹션만 + "UX 트랙 미수행" 마커 |

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
