---
name: ia-build-skill
description: User Flow → Information Architecture (라우트 트리 + 화면 계층) 구성
version: 1.1.0
category: template
owner: Product Design
---

# IA Build

## 🎯 Purpose
User Flow에서 발견된 화면을 **Information Architecture**로 구조화한다. 라우트 트리 + 각 노드의 한 줄 설명.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 |
|---|---|---|---|
| `user_flow` | MD | ✅ | previous-skill (Step 7) |

## 🔀 분기

항상 실행. UX 트랙이 skip된 경우 함께 skip.

## 📤 Output
- `ia.md` — 프로젝트 특화 라우트 트리 (코드블록) + 각 노드 한 줄 설명

## 🔧 동작
1. User Flow의 각 state에 대응되는 화면 식별
2. 라우트 경로 부여 (프로젝트의 도메인 단어 사용)
3. ASCII 트리로 시각화
4. 각 노드에 한 줄 설명 추가

## ✅ Validation
- 트리에 orphan 노드 없음
- 각 노드 한 줄 설명 존재
- User Flow의 모든 state가 IA에 매핑됨
- 프로젝트 특화 경로 사용 (generic `/dashboard`, `/settings`만 있으면 fail)

## 📚 Assets
- `assets/ia-tree-template.md` — ASCII 트리 표준 포맷
