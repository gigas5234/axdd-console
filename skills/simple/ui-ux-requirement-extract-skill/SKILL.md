---
name: ui-ux-requirement-extract-skill
description: 고객 Requirement MD에서 UI/UX 관련 요구사항만 추출해 1페이지 요약을 만든다
version: 1.0.0
category: simple
owner: Product Design
---

# UI/UX Requirement Extract

## 🎯 Purpose
고객의 전체 Requirement에서 **UI/UX 관련 요구사항만 필터링**해 표준 5섹션 요약 MD를 생성한다.

## 📥 Input
- `customer_requirement.md` — 고객 전체 Requirement (필수)

## 📤 Output
- `ui_ux_requirement_summary.md` — UI/UX 관련 항목만 정리된 1페이지 요약

## 🔧 동작
1. 입력에서 다음 영역 식별
   - 화면·컴포넌트 관련 요구사항
   - 사용자 플로우·인터랙션 요구사항
   - 디자인 시스템·브랜드 가이드라인
2. 백엔드·인프라·API·DB 영역은 **제외**
3. 5섹션으로 정리 (Context / Goal / Key Points / Risks / Next Steps)

## ✅ Validation
- UI/UX 관련 요구사항 ≥ 3개 식별
- 백엔드/인프라 영역 누출 0건
- 1000자 이내 (1페이지 분량)

## 📚 References
- `references/ui-ux-keyword-list.md` — UI/UX 식별용 키워드 카탈로그
