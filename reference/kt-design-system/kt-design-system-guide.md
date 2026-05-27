# KT Design System — Claude Code Guide

This file tells Claude (and any teammate) how to build UI consistently with the KT design system. Read it before generating any markup, styles, or component code.

---

## 0. Philosophy — "Seamless Flow"

KT의 UX 디자인 시스템은 단절 없는 흐름(Seamless Flow)을 핵심 원칙으로 합니다. 모든 UI는 다음을 따릅니다.

1. **하나의 흐름** — 화면과 화면, 단계와 단계 사이의 전환이 자연스러워야 합니다. 동작은 빠르되 부드럽게 (`--kt-ease-flow`).
2. **신뢰의 시각언어** — 과한 장식, 무거운 그림자, 화려한 그라데이션은 피합니다. 절제된 톤, 명확한 위계, 충분한 여백.
3. **KT Red는 의도적으로** — 빨강은 "지금 행동해야 하는 곳"에만 씁니다. 컬러 전체를 채우지 말고, 강조 포인트로.
4. **한국어 우선** — 모든 타이포그래피는 한글 가독성 기준. Pretendard를 우선으로 합니다.

---

## 1. Setup

Drop these two files into your project (e.g. `assets/css/`):

```
kt-ds/
  tokens.css       ← CSS custom properties (colors, type, spacing, motion)
  components.css   ← Pre-built component classes (.kt-btn, .kt-card, …)
```

In every HTML page:

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
  <link rel="stylesheet" href="/assets/css/kt-ds/tokens.css" />
  <link rel="stylesheet" href="/assets/css/kt-ds/components.css" />
</head>
<body class="kt-root">
  <!-- your UI -->
</body>
</html>
```

`kt-root` on `<body>` activates the base font, color, and box-sizing reset. Without it, you'll see browser defaults.

---

## 2. Color Tokens — How to choose

**Always use CSS variables. Never hardcode hex.**

| Intent | Token | When to use |
|---|---|---|
| Primary action, brand emphasis | `--kt-red` | The single most important CTA on a screen, brand highlights |
| Trustworthy contrast | `--kt-black` | Secondary buttons, dark surfaces, headers in dark mode |
| Body text | `--kt-text` | All readable text |
| Muted text | `--kt-text-muted` | Captions, helper text, deprioritized info |
| Subtle text | `--kt-text-subtle` | Placeholders, timestamps |
| Page background | `--kt-bg` | App canvas |
| Card/panel | `--kt-bg` over `--kt-bg-subtle` page | Foreground surfaces |
| Soft tint | `--kt-bg-subtle`, `--kt-red-soft` | Hover states, badges, alerts |
| Borders | `--kt-border` (default), `--kt-border-strong` (inputs) | Dividers and outlines |

### Do
- Use `--kt-red` for **one** primary action per view.
- Pair `--kt-red-soft` background with `--kt-red` text/icon for badges.
- Use semantic colors (`--kt-info`, `--kt-success`, `--kt-warning`, `--kt-danger`) for status messaging — never decoration.

### Don't
- ❌ Don't fill large surfaces with `--kt-red`. (Hero banners are the rare exception.)
- ❌ Don't mix multiple accent colors in the same view.
- ❌ Don't introduce new hex codes. If you need a new shade, extend the gray scale or ask first.

---

## 3. Typography

**Font:** Pretendard (한글/영문 통합). Loaded via CDN above. Fallback chain handles offline.

### Scale

| Use | Class | Size |
|---|---|---|
| Hero / display | `.kt-display` | 76px / Bold |
| Page H1 | `.kt-h1` | 48px / Bold |
| Section H2 | `.kt-h2` | 36px / Bold |
| H3 | `.kt-h3` | 30px / Semibold |
| H4 / card title | `.kt-h4` | 24px / Semibold |
| H5 | `.kt-h5` | 20px / Semibold |
| Body large | `.kt-body-lg` | 18px |
| Body (default) | `.kt-body` | 16px |
| Body small | `.kt-body-sm` | 14px |
| Caption | `.kt-caption` | 12px / muted |
| Overline / label | `.kt-overline` | 12px / uppercase |

### Rules
- Body text never below **14px** on web. Minimum **16px** for content-heavy reading.
- Tight tracking (`--kt-tracking-tight`) is applied to headings ≥24px automatically. Don't override.
- Korean text needs slightly more line-height than English — use `--kt-leading-relaxed` (1.7) for long paragraphs in 한글.

---

## 4. Spacing & Layout

4pt grid. Always use spacing tokens.

| Token | px | Common use |
|---|---|---|
| `--kt-space-1` | 4  | tight icon gap |
| `--kt-space-2` | 8  | button internal gap, label→input |
| `--kt-space-3` | 12 | card internal sections |
| `--kt-space-4` | 16 | default gap between siblings |
| `--kt-space-5` | 20 | input internal padding |
| `--kt-space-6` | 24 | card padding |
| `--kt-space-8` | 32 | section padding |
| `--kt-space-12` | 48 | section→section |
| `--kt-space-16` | 64 | page top/bottom rhythm |
| `--kt-space-20`+ | 80+ | hero verticals |

**Layout containers:** `--kt-container-lg` (1024) for product UIs, `--kt-container-xl` (1280) for marketing.

---

## 5. Radius & Shadow

| Element | Radius token |
|---|---|
| Inputs, small buttons | `--kt-radius-sm` (6) |
| Default buttons, inputs | `--kt-radius-md` (10) |
| Cards | `--kt-radius-lg` (14) |
| Modals, hero cards | `--kt-radius-xl` (20) |
| Pills / badges / chips | `--kt-radius-full` |

**Shadows are restrained.** Default UI uses `--kt-shadow-sm` or none. Use `--kt-shadow-md` for cards that lift on hover, `--kt-shadow-lg` for popovers, `--kt-shadow-xl` reserved for modals.

---

## 6. Component Recipes

### Button

```html
<button class="kt-btn kt-btn--primary">시작하기</button>
<button class="kt-btn kt-btn--secondary">자세히</button>
<button class="kt-btn kt-btn--outline">취소</button>
<button class="kt-btn kt-btn--ghost">건너뛰기</button>
<button class="kt-btn kt-btn--primary kt-btn--lg kt-btn--block">가입 신청</button>
```

Sizes: `kt-btn--sm | (default) | kt-btn--lg | kt-btn--xl`. Add `kt-btn--block` for full-width. Add `kt-btn--icon` (no text) for icon-only.

### Form field

```html
<label class="kt-field">
  <span class="kt-label">이메일<span class="kt-required">*</span></span>
  <input type="email" class="kt-input" placeholder="name@kt.com" />
  <span class="kt-hint">로그인 시 사용됩니다.</span>
</label>
```

Error state: add `kt-is-invalid` to the input and a `<span class="kt-error">` below.

### Card

```html
<article class="kt-card">
  <header class="kt-card__header">
    <h3 class="kt-card__title">5G 시그니처</h3>
    <span class="kt-badge kt-badge--soft">추천</span>
  </header>
  <p class="kt-card__body">데이터 무제한, 미디어 혜택 포함.</p>
  <footer class="kt-card__footer">
    <button class="kt-btn kt-btn--primary kt-btn--sm">가입</button>
  </footer>
</article>
```

Variants: `kt-card--elevated` (no border, shadow), `kt-card--interactive` (hover lift).

### List item (telco menu row)

```html
<div class="kt-list">
  <a class="kt-list-item" href="#">
    <span class="kt-list-item__icon">📱</span>
    <div class="kt-list-item__content">
      <div class="kt-list-item__title">요금제 변경</div>
      <div class="kt-list-item__desc">현재: 5G 슈퍼플랜 베이직</div>
    </div>
    <span class="kt-list-item__trail">›</span>
  </a>
</div>
```

### Alert / Banner

```html
<div class="kt-alert kt-alert--info">
  <span class="kt-alert__icon">ⓘ</span>
  <div>
    <div class="kt-alert__title">청구서 발송 안내</div>
    <div class="kt-alert__body">이번 달 청구서가 발송되었습니다.</div>
  </div>
</div>
```

### Steps (signup / payment flows)

```html
<ol class="kt-steps">
  <li class="kt-step kt-is-complete"><span class="kt-step__num">✓</span>본인 인증</li>
  <span class="kt-step__connector"></span>
  <li class="kt-step kt-is-active"><span class="kt-step__num">2</span>요금제 선택</li>
  <span class="kt-step__connector"></span>
  <li class="kt-step"><span class="kt-step__num">3</span>결제</li>
</ol>
```

---

## 7. Motion

All transitions use one of:
- `--kt-duration-fast` (120ms) — hover, focus, checkbox/radio toggle
- `--kt-duration-base` (200ms) — most state changes
- `--kt-duration-slow` (320ms) — modal in/out, progress bars
- `--kt-duration-slower` (560ms) — large enter animations

Easing: **default to `--kt-ease-flow`**. It's the Seamless Flow curve. Use `--kt-ease-out` for elements entering, `--kt-ease-in` for elements exiting.

Always respect `prefers-reduced-motion` — components.css already disables animations under that media query. Don't re-enable.

---

## 8. Accessibility checklist

- [ ] Every interactive element has `:focus-visible` state (built into `.kt-btn`, `.kt-input`, etc.)
- [ ] Color contrast: body text on bg passes WCAG AA (`--kt-text` on `--kt-bg` = 16:1)
- [ ] Buttons have descriptive text or `aria-label` for icon-only
- [ ] Form inputs have `<label>` (use `.kt-field` wrapper)
- [ ] Korean and English mixed runs: don't `text-transform: uppercase` Korean characters

---

## 9. Dark mode

Add `data-theme="dark"` to `<html>` or `<body>` (or `.kt-dark` class). All tokens automatically rebind. Components support it without changes.

```js
// theme toggle
document.documentElement.dataset.theme =
  document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
```

---

## 10. What to do when something isn't covered

1. **Look for a primitive first.** Most needs combine existing tokens + utility classes.
2. **Compose, don't invent.** A "notification card" is `.kt-card` + a `.kt-badge` + a `.kt-list-item__icon`.
3. **If you must add a new style:** put it in a file scoped to the feature (`feature.css`), not in `components.css`. Use existing tokens — never new hex values.
4. **When in doubt:** mirror the patterns from telco services (요금제 가입, 본인 인증, 청구서) — clean cards stacked vertically, big tap targets, KT Red on the single forward action.

---

## 11. Anti-patterns Claude should avoid

- ❌ Building cards or buttons from scratch when `.kt-card` / `.kt-btn` exist
- ❌ Using emoji as production iconography (placeholder only — replace with real icons)
- ❌ Sprinkling rounded gradients, neumorphism, or glassmorphism on KT surfaces
- ❌ Centering long Korean body text — left-align for readability
- ❌ Using `--kt-red` as a page background
- ❌ Tight line-height on Korean (< 1.5) — vowel/consonant stacking needs room
- ❌ Mixing in Inter / Roboto — Pretendard handles Latin perfectly

---

**Version:** 1.0
**Maintained by:** Design team

---

## 12. AXDD Integration Notes (this file in Enterprise zip)

이 가이드는 **AXDD UX/UI Enterprise Skill Repository의 어댑터**로 편입되었습니다.

- 루트 `CLAUDE.md` (AXDD 라우터)와는 **별개** 파일입니다. 절대 덮어쓰지 마세요.
- 이 파일은 `skills/design-system-ingest-skill/references/kt-design-system-guide.md` 경로로 들어갑니다.
- `design-system-ingest-skill` 이 이 가이드를 인지하면 KT DS 출처로 산출물을 생성합니다.
- 함께 제공되는 자산:
  - `assets/kt-tokens.css` — CSS variables
  - `assets/kt-components.css` — 컴포넌트 클래스 (admin 컴포넌트 포함)
  - `assets/kt-design-tokens.json` — JSON 시드
  - `assets/kt-tailwind-mapping.md` — Tailwind config 변환
  - `assets/kt-figma-variable-mapping.md` — Figma Variables 매핑
  - `assets/kt-component-library-template.md` — Figma component set 문서
