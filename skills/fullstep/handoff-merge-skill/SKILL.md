---
name: handoff-merge-skill
description: UI 트랙 + UX 트랙 → 마스터 핸드오프 문서 (프론트 설계서)
version: 1.0.0
category: fullstep
owner: Product Design
---

# Handoff Merge

## 🎯 Purpose
UI 트랙(Step 2-5)과 UX 트랙(Step 6-8) 산출물을 **합쳐서 프론트엔드 개발자가 즉시 구현 가능한 마스터 핸드오프 문서**를 만든다.

## 📥 Input
- UI 트랙: `ui_foundation.md`, `component_spec.md`, `sample_screens.md`
- UX 트랙: `ux_process_plan.md`, `user_flow.md`, `ia.md`
- `assets/handoff-doc-template.md`

## 📤 Output
- `handoff.md` — 마스터 핸드오프 (8섹션 통합)

## 🔧 동작
8섹션 구조로 합치기:

1. **Project Overview** — 도메인·톤·페르소나·KPI
2. **Information Architecture** — Step 8 결과
3. **User Flow** — Step 7 결과
4. **Design Tokens** — Step 3 결과
5. **Component Spec** — Step 4 결과
6. **Sample Screens** — Step 5 결과
7. **Interaction & Motion** — UI Foundation의 motion 가이드 발췌
8. **A11y · QA Matrix** — 도메인 a11y 체크리스트 + 브라우저/breakpoint 매트릭스

## ✅ Validation
- 8섹션 모두 존재
- UI 트랙 + UX 트랙 모든 산출물이 합쳐짐
- 마크다운 표 구조 정확
- 도메인 키워드 ≥ 30회 등장 (전체 문서)
- 다른 도메인 누출 ≤ 3회

## 📚 Assets
- `assets/handoff-doc-template.md` — 마스터 핸드오프 8섹션 템플릿
