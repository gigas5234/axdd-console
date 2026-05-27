---
name: ux-process-define-skill
description: UX 어셋 폴더 + 고객 요구사항 → 프로젝트 특화 UX 프로세스 플랜 정의 (Double Diamond)
version: 1.1.0
category: asset
owner: Product Design
---

# UX Process Define

## 🎯 Purpose
UX 어셋 (체크리스트·예시·룰 폴더) 풀세트를 기반으로 **이 프로젝트에 맞는 UX 프로세스 플랜**을 정의한다. UX 트랙의 시작점.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 | 비고 |
|---|---|---|---|---|
| `requirement_summary` | MD | ✅ | previous-skill (Step 1) | UX 관련 요구사항 |
| `ux_asset_pack` | 폴더 | ❌ | fixed-asset (`assets/ux-asset-pack/`) | 폴더가 없으면 generic Double Diamond |

## 🔀 분기

| `ux_asset_pack` 폴더 상태 | 동작 |
|---|---|
| 있음 (체크리스트·예시 MD 다수) | 폴더 내용을 차용해 프로세스 플랜 작성 |
| 없음 | Generic Double Diamond 4단계만 작성 + "UX 어셋 보강 필요" 마커 |

## 📤 Output
- `ux_process_plan.md` — 프로젝트 특화 Double Diamond 플랜 + 페르소나 N종 + 단계별 액션 표

## 🔧 동작
1. 요구사항에서 핵심 사용자 역할 식별 → 페르소나 작성
2. Double Diamond 4단계 정의 (Discover / Define / Design / Validate)
3. 각 단계별 액션 표 (Method · Output · 소요 기간)
4. ux_asset_pack 폴더 내용을 차용해 구체 액션 채움

## ✅ Validation
- 페르소나 ≥ 2종 (Persona × Goal × Pain × Insight)
- Double Diamond 4단계 모두 정의
- 각 단계별 액션 표에 Method · Output 명시
- 페르소나는 **프로젝트의 실제 사용자** 기반 (가상 외부 페르소나 금지)

## 📚 Assets
- `assets/ux-asset-pack/` — UX 어셋 풀세트 (체크리스트·예시) — 폴더 자체. 미존재 시 generic 폴백
- `references/double-diamond-method.md` — 방법론 정의
