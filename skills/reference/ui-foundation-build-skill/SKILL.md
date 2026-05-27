---
name: ui-foundation-build-skill
description: UI 요소 + 디자인 시스템 레퍼런스(AXDD 또는 고객사) → 디자인 토큰(color/typography/spacing/radius/shadow/motion) 정의
version: 1.1.0
category: reference
owner: Product Design
---

# UI Foundation Build

## 🎯 Purpose
이전 스킬이 추출한 UI 요소를 **실제 디자인 토큰**으로 정의한다. AXDD DS가 있으면 그것을 그대로 차용하고, 없으면 (Case A) DS Bootstrap 워크유닛에서 새로 생성.

## 📥 Input Slots

| 슬롯 | 형식 | 필수 | 소스 | 비고 |
|---|---|---|---|---|
| `ui_elements` | MD | ✅ | previous-skill | Step 2의 출력 |
| `design_system_ref` | MD | ✅ | customer-ds-input → axdd-ds-catalog (fallback) | 같은 우선순위 |

## 🔀 분기 (4-Case 매트릭스 적용)

| Case | hasAxddDs | hasCustomerDs | 동작 |
|---|:---:|:---:|---|
| **A** | ❌ | ❌ | 이 스킬은 **DS Bootstrap 워크유닛에서 호출** — 새 토큰 풀세트 생성 |
| **B** | ✅ | ❌ | AXDD DS 토큰을 그대로 차용 + 프로젝트 특화 토큰 추가 |
| **C** | ✅ | ✅ | 고객사 DS 토큰을 메인으로 + AXDD DS는 폴백 |
| **D** | — | — | 이전 단계가 먼저 해결되어야 도달 가능 |

## 📤 Output
- `ui_foundation.md` — 토큰 풀세트 (color · typography · spacing · radius · shadow · motion)

## 🔧 동작
1. 사용할 DS 레퍼런스 결정 (위 매트릭스)
2. Color 토큰 정의 (primary/accent/surface/ink/status 10~14종)
3. Typography 스케일 (display/h1~h3/body/caption/code)
4. Spacing scale (4의 배수, xs~3xl)
5. Radius / Shadow / Motion 가이드
6. Case A인 경우 → 산출물을 `data/our-design-system.md` 후보로 마킹

## ✅ Validation
- Color 토큰 ≥ 10종
- Typography 스케일 ≥ 7종
- Spacing 4의 배수만 사용
- 토큰 이름은 kebab-case 또는 slash 표기
- 임의 hex 값 인라인 사용 금지
- 사용한 DS 출처 명시

## 📚 References
- `references/token-naming-convention.md` — 네이밍 규칙
- `references/spacing-scale-guide.md` — 4의 배수 스케일
- `references/axdd-design-system.md` — AXDD DS 카탈로그 (있을 때만)
