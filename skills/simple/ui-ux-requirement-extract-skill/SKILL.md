---
name: ui-ux-requirement-extract-skill
description: 고객(또는 사내 사업부)이 전달한 Requirement MD에서 UI/UX 관련 요구사항만 추출해 1페이지 표준 요약을 만든다
version: 1.1.0
category: simple
owner: Product Design
---

# UI/UX Requirement Extract

## 🎯 Purpose
프로젝트로 들어온 **전체 Requirement 문서**에서 UI/UX 관련 항목만 골라 표준 5섹션 1페이지 요약 MD로 정리한다. 백엔드·인프라·API·DB 영역은 제외.

이 스킬은 UX/UI Planning 워크유닛의 **공통 첫 단계 (common-start)** 이자, DS Bootstrap 워크유닛의 첫 단계이기도 하다.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 | 비고 |
|---|---|---|---|---|
| `customer_requirement` | MD | ✅ | user-input | 고객/사업부가 넘긴 원본 Requirement |

## 📤 Output
- `ui_ux_requirement_summary.md` — UI/UX 관련 항목만 추출된 1페이지 표준 요약

## 🔀 분기 (skipCondition)

| 인풋 상태 | 동작 |
|---|---|
| `hasRequirement = false` (Requirement 원본 있음, 요약은 없음) | **이 스킬 실행** — 요약 생성 |
| `hasRequirement = true` (이미 정리된 요약 MD 있음) | **이 스킬 skip** — 그 MD를 그대로 다음 스킬에 전달 |

## 🔧 동작
1. 인풋에서 다음 영역 식별
   - 화면·컴포넌트 관련 요구사항
   - 사용자 플로우·인터랙션 요구사항
   - 디자인 시스템·브랜드 가이드라인 요구사항
2. 백엔드·인프라·API·DB 요구사항은 **제외**
3. 5섹션으로 정리: Context / Goal / Key Points (UI/UX 한정) / Risks / Next Steps

## ✅ Validation
- UI/UX 관련 요구사항 ≥ 3개 식별
- 백엔드/인프라 영역 누출 0건
- 1000자 이내 (1페이지 분량)
- 5섹션 모두 존재

## 📚 References
- `references/ui-ux-keyword-list.md` — UI/UX 식별용 키워드 카탈로그 (필요 시 추가)

## 🧭 사용 예
- "사내 어드민 신규 화면 추가" 프로젝트 → 사업부가 넘긴 PRD에서 UI 부분만 추출
- "외부 고객사 프로젝트 인수" → 고객사 RFP에서 UX 요구만 골라 1페이지로
