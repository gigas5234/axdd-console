---
name: figma-prompt-build-skill
description: 마스터 핸드오프 → Figma AI 그대로 붙여 넣을 수 있는 프롬프트 생성
version: 1.0.0
category: template
owner: Product Design
---

# Figma Prompt Build

## 🎯 Purpose
마스터 핸드오프 문서를 **Figma AI / Make Designs / First Draft에 그대로 복사·붙여 넣을 수 있는** 프롬프트로 변환한다. Figma MCP가 차단된 환경에서도 디자이너가 즉시 활용 가능.

## 📥 Input
- `handoff.md` (Step 9 출력)
- `assets/figma-frame-recipes.md`

## 📤 Output
- `figma_prompt.md` — Figma AI 프롬프트 (코드블록 포함, 그대로 복사 가능)

## 🔧 동작
1. 핸드오프에서 핵심 정보 추출 (브랜드·토큰·컴포넌트·화면)
2. 프레임 6종 정의:
   - Cover / Project Overview
   - IA & User Flow
   - UI Foundation (토큰)
   - Component Library
   - Sample Screens
   - (옵션) Empty/Loading/Error States
3. 규칙 명시 (Auto Layout / Spacing 4의 배수 / 토큰만 사용 / 도메인 톤 유지)
4. 코드블록으로 감싸 그대로 복사 가능하게

## ✅ Validation
- 프레임 ≥ 6개 명시
- 도메인 정보 (프로젝트명·브랜드·토큰) 포함
- 규칙 섹션 ≥ 5개
- 코드블록으로 감싸짐
- 다른 도메인 anchoring 없음

## 📚 Assets
- `assets/figma-frame-recipes.md` — Figma 프레임 구성 레시피
