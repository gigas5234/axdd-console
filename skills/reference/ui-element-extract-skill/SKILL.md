---
name: ui-element-extract-skill
description: 디자인 시스템 레퍼런스 + UI/UX 요구사항 → UI 요소(컴포넌트 후보) 추출
version: 1.0.0
category: reference
owner: Product Design
---

# UI Element Extract

## 🎯 Purpose
디자인 시스템 레퍼런스를 분석해 **이 프로젝트에 필요한 UI 요소 후보**를 추출한다. 다음 스킬인 `ui-foundation-build`의 인풋이 된다.

## 📥 Input
- `ui_ux_requirement_summary.md` (Step 1 출력)
- `references/axdd-design-system.md` 또는 `references/customer-design-system.md` (고정 자료)

## 📤 Output
- `ui_elements.md` — 추출된 UI 요소 목록 (Button / Card / Modal / 도메인 특화 컴포넌트 등)

## 🔧 동작
1. 디자인 시스템 레퍼런스에서 사용 가능한 요소 카탈로그 로드
2. 요구사항에 맞는 요소 매칭 (예: "환자 정보 카드" → PatientCard 패턴)
3. 도메인 특화 컴포넌트 추가 식별

## ✅ Validation
- 공용 컴포넌트 ≥ 5종 (Button/Card/Input/Modal/Toast)
- 도메인 특화 컴포넌트 ≥ 3종
- 요구사항 미커버 영역 0건

## 📚 References
- `references/axdd-design-system.md` — AXDD 기본 디자인 시스템
- `references/customer-design-system-template.md` — 고객사 디자인 시스템 입력용 템플릿
- `references/element-categorization.md` — 요소 분류 룰
