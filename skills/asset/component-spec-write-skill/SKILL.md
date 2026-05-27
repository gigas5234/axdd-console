---
name: component-spec-write-skill
description: UI Foundation 토큰 + 요구사항 → 컴포넌트 스펙 (Variants/States/Props/Anatomy/Token mapping)
version: 1.1.0
category: asset
owner: Product Design
---

# Component Spec Write

## 🎯 Purpose
디자이너·개발자가 즉시 구현 가능한 수준의 **컴포넌트 명세**를 작성한다. UI Foundation 토큰을 어떻게 컴포넌트에 매핑하는지 명시.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 | 비고 |
|---|---|---|---|---|
| `ui_foundation` | MD | ✅ | previous-skill | Step 3의 출력 |
| `requirement_summary` | MD | ✅ | previous-skill | Step 1의 출력 (필요한 컴포넌트 식별용) |

## 🔀 분기

| 인풋 상태 | 동작 |
|---|---|
| 둘 다 있음 | 정상 실행 |
| `ui_foundation`만 있음 (Bootstrap 케이스) | 공용 컴포넌트 5종 스펙만 작성 (요구사항 기반 특화 컴포넌트는 생략) |

## 📤 Output
- `component_spec.md` — 공용 컴포넌트 5종 + 프로젝트 특화 컴포넌트 N종 풀 스펙

## 🔧 동작
1. 공용 컴포넌트 스펙 (Button/Card/Input/Modal/Toast) 작성
2. 프로젝트 특화 컴포넌트 식별 후 스펙 작성 (요구사항 기반)
3. 각 컴포넌트마다:
   - **Variants** (primary/secondary/ghost 등)
   - **States** (default/hover/focus/disabled/loading)
   - **Props** (이름·타입·기본값·설명 표)
   - **Anatomy** (구성요소 bullet)
   - **Token mapping** (어떤 토큰을 쓰는지)

## ✅ Validation
- 공용 컴포넌트 5종 모두 정의
- 각 컴포넌트가 Variants/States/Props/Anatomy/Token mapping 5개 항목 모두 포함
- 모든 색·여백·라운드 값이 **토큰 이름**으로 표기 (인라인 hex 금지)
- DS Bootstrap 모드에서는 검증 완화 (특화 컴포넌트 ≥ 0 허용)

## 📚 Assets
- `assets/component-spec-template.md` — 컴포넌트 스펙 표준 템플릿
