---
name: component-spec-write-skill
description: UI Foundation 토큰 + 요구사항 → 컴포넌트 스펙 (Variants/States/Props/Anatomy/Token mapping)
version: 1.0.0
category: asset
owner: Product Design
---

# Component Spec Write

## 🎯 Purpose
UI Foundation 토큰을 기반으로 **컴포넌트 스펙**을 작성한다. 디자이너·개발자가 즉시 구현 가능한 수준의 명세 (Variants / States / Props / Anatomy / Token mapping).

## 📥 Input
- `ui_foundation.md` (Step 3 출력)
- `ui_ux_requirement_summary.md` (Step 1 출력 — 필요한 컴포넌트 식별용)
- `assets/component-spec-template.md` (스펙 작성 표준)

## 📤 Output
- `component_spec.md` — 공용 컴포넌트 5종 + 도메인 특화 3종 풀 스펙

## 🔧 동작
1. 공용 컴포넌트 (Button/Card/Input/Modal/Toast) 스펙 작성
2. 도메인 특화 컴포넌트 식별 후 스펙 작성
3. 각 컴포넌트마다:
   - Variants (primary/secondary/ghost 등)
   - States (default/hover/focus/disabled/loading)
   - Props (이름·타입·기본값·설명 표)
   - Anatomy (구성요소 bullet)
   - Token mapping (어떤 토큰을 쓰는지)

## ✅ Validation
- 공용 컴포넌트 5종 모두 정의
- 도메인 특화 컴포넌트 ≥ 3종
- 각 컴포넌트가 Variants/States/Props/Anatomy/Token mapping 5개 항목 모두 포함

## 📚 Assets
- `assets/component-spec-template.md` — 컴포넌트 스펙 표준 템플릿
