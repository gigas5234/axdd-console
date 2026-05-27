---
name: ui-foundation-build-skill
description: UI 요소 + 도메인 톤 → 디자인 토큰 (color/typography/spacing/radius/shadow/motion) 정의
version: 1.0.0
category: reference
owner: Product Design
---

# UI Foundation Build

## 🎯 Purpose
이전 스킬이 추출한 UI 요소를 **실제 디자인 토큰**으로 정의한다. 도메인 톤(헬스케어 차분·핀테크 전문성 등)을 반영해 일관된 디자인 시스템 토큰 풀세트 생성.

## 📥 Input
- `ui_elements.md` (Step 2 출력)
- `references/token-naming-convention.md`
- `references/spacing-scale-guide.md`

## 📤 Output
- `ui_foundation.md` — 토큰 풀세트 (color · typography · spacing · radius · shadow · motion)

## 🔧 동작
1. 도메인 톤 식별 (intent.domain 활용)
2. Color 토큰 정의 (primary/accent/surface/ink/status 10~14종)
3. Typography 스케일 (display/h1~h3/body/caption/code)
4. Spacing scale (4의 배수, xs~3xl)
5. Radius / Shadow / Motion 가이드

## ✅ Validation
- Color 토큰 ≥ 10종
- Typography 스케일 ≥ 7종
- Spacing 4의 배수만 사용
- 토큰 이름은 kebab-case 또는 slash 표기
- 임의 hex 값 인라인 사용 금지

## 📚 References
- `references/token-naming-convention.md` — 네이밍 규칙
- `references/spacing-scale-guide.md` — 4의 배수 스케일
