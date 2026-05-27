---
name: figma-prompt-build-skill
description: 마스터 핸드오프 → Figma AI에 그대로 붙여 넣을 수 있는 프롬프트 생성
version: 1.1.0
category: template
owner: Product Design
---

# Figma Prompt Build

## 🎯 Purpose
마스터 핸드오프 문서를 **Figma AI / Make Designs / First Draft에 그대로 복사·붙여 넣을 수 있는** 프롬프트로 변환한다. Figma MCP가 차단된 환경에서도 디자이너가 즉시 활용 가능.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 |
|---|---|---|---|
| `handoff` | MD | ✅ | previous-skill (Step 9) |

## 🔀 분기

항상 실행. 핸드오프 산출물이 UI-only 모드면 프롬프트도 UI 프레임만 (UX 플로우/IA 프레임 제외).

## 📤 Output
- `figma_prompt.md` — Figma AI 프롬프트 (코드블록 포함, 그대로 복사 가능)

## 🔧 동작
1. 핸드오프에서 핵심 정보 추출 (프로젝트명·토큰·컴포넌트·화면)
2. 프레임 6종 정의:
   - Cover / Project Overview
   - IA & User Flow (UX 트랙 완료 시)
   - UI Foundation (토큰)
   - Component Library
   - Sample Screens
   - (옵션) Empty/Loading/Error States
3. 규칙 명시 (Auto Layout / Spacing 4의 배수 / 토큰만 사용)
4. 코드블록으로 감싸 그대로 복사 가능하게

## ✅ Validation
- 프레임 ≥ 4개 (UI-only) ~ 6개 (풀세트)
- 프로젝트 정보 (프로젝트명·DS 출처·토큰) 포함
- 규칙 섹션 ≥ 5개
- 코드블록으로 감싸짐
- 일반 SaaS 예시 anchoring 없음 — 이 프로젝트 컨텍스트로만

## 📚 Assets
- `assets/figma-frame-recipes.md` — Figma 프레임 구성 레시피
