---
name: sample-screen-design-skill
description: 컴포넌트 스펙 → 프로젝트 핵심 화면 3종을 ASCII 와이어프레임 + 토큰 매핑으로 설계
version: 1.1.0
category: asset
owner: Product Design
---

# Sample Screen Design

## 🎯 Purpose
컴포넌트 스펙을 바탕으로 **요구사항이 정의한 프로젝트의 핵심 화면 3개**를 ASCII 와이어프레임으로 설계한다. Figma 작업 직전 단계.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 |
|---|---|---|---|
| `component_spec` | MD | ✅ | previous-skill (Step 4) |
| `ui_foundation` | MD | ✅ | previous-skill (Step 3) |
| `requirement_summary` | MD | ✅ | previous-skill (Step 1) |

## 🔀 분기

이 스킬은 모든 케이스에서 항상 실행. 다만 화면 수는 요구사항에 따라 가변:
- 요구사항에 화면 3종 이상 명시 → 명시된 화면 사용
- 요구사항에 화면 명시 없음 → 표준 3종 (Home / List / Detail) 생성

## 📤 Output
- `sample_screens.md` — 핵심 화면 3개 (ASCII 와이어프레임 + 영역별 컴포넌트·토큰 매핑)

## 🔧 동작
1. 요구사항에서 핵심 화면 식별 (없으면 표준 3종 폴백)
2. 각 화면을 ASCII 와이어프레임으로 그리기
3. 각 영역에 사용된 컴포넌트와 토큰 매핑 명시

## ✅ Validation
- 화면 ≥ 3개
- 각 화면에 ASCII 와이어프레임 (코드블록) 포함
- 각 영역의 컴포넌트·토큰 매핑 bullet 작성
- 컴포넌트 이름이 `component_spec.md`에 정의된 것과 일치

## 📚 Assets
- `assets/wireframe-template.md` — 와이어프레임 표준 포맷
