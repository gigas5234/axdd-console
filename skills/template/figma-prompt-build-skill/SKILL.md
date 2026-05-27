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
| `design_system_profile` | MD | ❌ | previous-skill (design-system-ingest) |
| `design_tokens` | JSON | ❌ | previous-skill (design-system-ingest) |
| `figma_variable_mapping` | MD | ❌ | previous-skill (design-system-ingest) — **Figma Variables 컬렉션 구조** |
| `tailwind_token_mapping` | MD | ❌ | previous-skill (design-system-ingest) |
| `component_library_mapping` | MD | ❌ | previous-skill (design-system-ingest) |

## 🔀 분기

항상 실행. 핸드오프 산출물이 UI-only 모드면 프롬프트도 UI 프레임만 (UX 플로우/IA 프레임 제외).

## 📌 Design System Usage Rule (HARD)

**`design_system_profile`, `design_tokens`, `figma_variable_mapping`, `tailwind_token_mapping`, `component_library_mapping` 가 하나라도 들어오면 Figma 프롬프트는 반드시 그것을 기반으로 작성한다.**

- 프롬프트 안의 토큰 이름은 `figma_variable_mapping.md` 의 Figma Variable 경로(`color/brand/primary`, `spacing/4`, `radius/md` 등)와 1:1 일치
- 컴포넌트 이름은 `component_library_mapping.md` 의 매핑된 이름 사용
- Style Dictionary / Tokens Studio 사용 가능하면 그 임포트 절차도 프롬프트에 함께 안내
- DS 인풋이 없는 경우에만 핸드오프 본문에서 추출한 토큰을 사용

## 📌 Figma MCP — Optional, Not Required

이 스킬의 **기본 출력 경로는 "Figma AI / Make Designs / First Draft 등에 사람이 직접 붙여넣는 manual prompt"**.

- Figma MCP 가 연결되어 있어도 자동 호출하지 않는다 (MCP 가용성·계정·권한이 환경마다 다름)
- MCP 사용 시나리오는 별도 어댑터(`lib/figma/mcp-adapter.ts`)가 담당하며, 본 스킬과는 결합도가 0
- 프롬프트 본문에 "MCP가 있다면 이 프롬프트를 그대로 MCP 호출 인자로 사용해도 됨" 정도의 안내만 포함

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
