---
name: user-flow-design-skill
description: UX 프로세스 → 프로젝트 핵심 사용자 플로우 2~3개 (state-based) 작성
version: 1.1.0
category: template
owner: Product Design
---

# User Flow Design

## 🎯 Purpose
UX 프로세스에서 정의된 페르소나·시나리오를 기반으로 **이 프로젝트의 핵심 사용자 플로우 2~3개**를 state-based로 작성한다.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 |
|---|---|---|---|
| `ux_process_plan` | MD | ✅ | previous-skill (Step 6) |

## 🔀 분기

항상 실행. UX 트랙이 skip된 경우 (Bootstrap 모드)는 이 스킬도 함께 skip.

## 📤 Output
- `user_flow.md` — 핵심 플로우 2~3개 (Entry → State → Exit 형태)

## 🔧 동작
1. 요구사항·UX 프로세스에서 핵심 작업 2~3개 식별
2. 각 플로우를 state machine으로:
   - Entry (사용자 상태/트리거)
   - State A → B → C → D
   - Exit (성공/실패 조건)
3. 각 state에 화면·액션·시스템 응답 명시

## ✅ Validation
- 플로우 ≥ 2개
- 각 플로우 ≥ 5단계
- Entry/Exit 명시
- 요구사항의 핵심 작업 반영 (generic 플로우 금지)

## 📚 Assets
- `assets/user-flow-template.md` — 플로우 작성 표준 포맷
