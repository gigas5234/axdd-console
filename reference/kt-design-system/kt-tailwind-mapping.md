# KT Design System × Tailwind CSS — Mapping Guide

KT 디자인 토큰을 Tailwind CSS 유틸리티 클래스로 매핑하는 가이드입니다. `tailwind.config.js`(또는 `tailwind.config.ts`)에 그대로 복사해서 쓸 수 있도록 구성했습니다.

---

## 1. 설치

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`globals.css` 또는 진입 CSS:

```css
@import "tailwindcss";
@import "./kt-ds/tokens.css";   /* CSS 변수 (--kt-*)를 함께 로드 */
```

> ⚠️ Tailwind 단독으로도 충분하지만, `tokens.css`를 함께 로드하면 **순수 CSS 영역**(서드파티 컴포넌트, 외부 위젯)에서도 같은 `var(--kt-*)` 변수를 쓸 수 있어 일관성이 유지됩니다.

---

## 2. `tailwind.config.js` 전체 매핑

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,jsx,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      /* ───────── COLORS ───────── */
      colors: {
        kt: {
          red: {
            DEFAULT: '#E60012',
            hover:   '#C70010',
            pressed: '#A8000D',
            soft:    '#FFEDEE',
          },
          black: '#141414',

          gray: {
             50: '#FAFAFA',
            100: '#F4F4F5',
            200: '#E6E6E8',
            300: '#D1D1D6',
            400: '#A8A8B0',
            500: '#76767E',
            600: '#54545B',
            700: '#3A3A40',
            800: '#25252A',
            900: '#18181B',
            950: '#0A0A0B',
          },

          info:    { DEFAULT: '#2A6FDB', soft: '#EAF1FC' },
          success: { DEFAULT: '#1F8A5B', soft: '#E6F4ED' },
          warning: { DEFAULT: '#C77700', soft: '#FDF2DE' },
          danger:  { DEFAULT: '#D7263D', soft: '#FCEAEC' },
        },

        /* 시맨틱 별칭 — CSS 변수를 그대로 참조해 다크모드 자동 적용 */
        bg:        'var(--kt-bg)',
        'bg-subtle': 'var(--kt-bg-subtle)',
        'bg-muted':  'var(--kt-bg-muted)',
        fg:          'var(--kt-text)',
        'fg-muted':  'var(--kt-text-muted)',
        'fg-subtle': 'var(--kt-text-subtle)',
        border:      'var(--kt-border)',
        'border-strong': 'var(--kt-border-strong)',
      },

      /* ───────── TYPOGRAPHY ───────── */
      fontFamily: {
        sans: [
          'Pretendard', 'Pretendard Variable', '-apple-system',
          'BlinkMacSystemFont', '"Apple SD Gothic Neo"',
          '"Noto Sans KR"', '"Segoe UI"', 'Roboto', 'sans-serif',
        ],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs':  ['11px', { lineHeight: '1.55' }],
        xs:     ['12px', { lineHeight: '1.55' }],
        sm:     ['14px', { lineHeight: '1.55' }],
        base:   ['16px', { lineHeight: '1.55' }],
        lg:     ['18px', { lineHeight: '1.7'  }],
        xl:     ['20px', { lineHeight: '1.35' }],
        '2xl':  ['24px', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
        '3xl':  ['30px', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
        '4xl':  ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '5xl':  ['48px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '6xl':  ['60px', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        '7xl':  ['76px', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
      },
      letterSpacing: {
        tight:  '-0.02em',
        normal: '0',
        wide:   '0.04em',
      },

      /* ───────── SPACING (4pt) ───────── */
      spacing: {
        0:  '0px',
        1:  '4px',
        2:  '8px',
        3:  '12px',
        4:  '16px',
        5:  '20px',
        6:  '24px',
        8:  '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
      },

      /* ───────── RADIUS ───────── */
      borderRadius: {
        none: '0',
        xs:   '4px',
        sm:   '6px',
        DEFAULT: '10px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        '2xl':'28px',
        full: '9999px',
      },

      /* ───────── SHADOW ───────── */
      boxShadow: {
        xs:    '0 1px 2px rgba(20,20,20,0.04)',
        sm:    '0 1px 3px rgba(20,20,20,0.06), 0 1px 2px rgba(20,20,20,0.04)',
        DEFAULT:'0 1px 3px rgba(20,20,20,0.06), 0 1px 2px rgba(20,20,20,0.04)',
        md:    '0 4px 12px rgba(20,20,20,0.06), 0 2px 4px rgba(20,20,20,0.04)',
        lg:    '0 12px 28px rgba(20,20,20,0.08), 0 4px 8px rgba(20,20,20,0.04)',
        xl:    '0 24px 56px rgba(20,20,20,0.12), 0 8px 16px rgba(20,20,20,0.06)',
        focus: '0 0 0 4px rgba(230,0,18,0.18)',
        'focus-info': '0 0 0 4px rgba(42,111,219,0.22)',
      },

      /* ───────── MOTION ───────── */
      transitionDuration: {
        fast:   '120ms',
        DEFAULT:'200ms',
        base:   '200ms',
        slow:   '320ms',
        slower: '560ms',
      },
      transitionTimingFunction: {
        flow:   'cubic-bezier(0.22, 0.61, 0.36, 1)',
        out:    'cubic-bezier(0.16, 1, 0.3, 1)',
        in:     'cubic-bezier(0.7, 0, 0.84, 0)',
        'in-out':'cubic-bezier(0.65, 0, 0.35, 1)',
      },

      /* ───────── LAYOUT ───────── */
      maxWidth: {
        'container-sm':  '640px',
        'container-md':  '768px',
        'container-lg':  '1024px',
        'container-xl':  '1280px',
        'container-2xl': '1440px',
      },
      zIndex: {
        base:     '0',
        dropdown: '1000',
        sticky:   '1100',
        overlay:  '1200',
        modal:    '1300',
        toast:    '1400',
        tooltip:  '1500',
      },
    },
  },
  plugins: [],
};
```

---

## 3. 유틸리티 매핑 — 빠른 참조표

### 컬러

| CSS 변수 | Tailwind 클래스 (배경/텍스트/보더) |
|---|---|
| `--kt-red` | `bg-kt-red` / `text-kt-red` / `border-kt-red` |
| `--kt-red-hover` | `bg-kt-red-hover` |
| `--kt-red-soft` | `bg-kt-red-soft` |
| `--kt-black` | `bg-kt-black` / `text-kt-black` |
| `--kt-gray-100` ~ `950` | `bg-kt-gray-100` ~ `bg-kt-gray-950` |
| `--kt-info` | `bg-kt-info` / `text-kt-info` |
| `--kt-success` | `bg-kt-success` / `text-kt-success` |
| `--kt-warning` | `bg-kt-warning` / `text-kt-warning` |
| `--kt-danger`  | `bg-kt-danger` / `text-kt-danger` |
| `--kt-text` | `text-fg` *(시맨틱 별칭, 다크모드 자동)* |
| `--kt-text-muted` | `text-fg-muted` |
| `--kt-bg` | `bg-bg` |
| `--kt-border` | `border-border` |

### 타이포

| 토큰 | Tailwind |
|---|---|
| Display (76) | `text-7xl font-bold tracking-tight` |
| H1 (48) | `text-5xl font-bold tracking-tight` |
| H2 (36) | `text-4xl font-bold tracking-tight` |
| H3 (30) | `text-3xl font-semibold` |
| H4 (24) | `text-2xl font-semibold` |
| Body LG | `text-lg leading-relaxed` |
| Body | `text-base` |
| Caption | `text-xs text-fg-muted` |
| Overline | `text-xs font-semibold uppercase tracking-wide text-fg-muted` |

### 간격 (`--kt-space-N` ↔ Tailwind)

`p-`, `m-`, `gap-` 등 모든 spacing 유틸리티에서 동일한 숫자 키를 씁니다.

| 토큰 | Tailwind | px |
|---|---|---|
| `--kt-space-2` | `p-2` `gap-2` | 8 |
| `--kt-space-4` | `p-4` `gap-4` | 16 |
| `--kt-space-6` | `p-6` `gap-6` | 24 |
| `--kt-space-8` | `p-8` | 32 |
| `--kt-space-12` | `p-12` | 48 |

### Radius

| 토큰 | Tailwind |
|---|---|
| `--kt-radius-sm` (6) | `rounded-sm` |
| `--kt-radius-md` (10) | `rounded-md` 또는 `rounded` |
| `--kt-radius-lg` (14) | `rounded-lg` |
| `--kt-radius-xl` (20) | `rounded-xl` |
| `--kt-radius-full` | `rounded-full` |

### 그림자

| 토큰 | Tailwind |
|---|---|
| `--kt-shadow-sm` | `shadow-sm` |
| `--kt-shadow-md` | `shadow-md` |
| `--kt-shadow-lg` | `shadow-lg` |
| `--kt-shadow-xl` | `shadow-xl` |
| `--kt-shadow-focus` | `shadow-focus` (또는 `focus:shadow-focus`) |

### 모션

| 토큰 | Tailwind |
|---|---|
| `--kt-duration-base` | `duration-base` (= `duration-200`) |
| `--kt-duration-slow` | `duration-slow` |
| `--kt-ease-flow` | `ease-flow` |

조합 예: `transition duration-base ease-flow`

---

## 4. 컴포넌트 마이그레이션 예시

### Button (Primary)

```html
<!-- 순수 KT DS -->
<button class="kt-btn kt-btn--primary">시작하기</button>

<!-- Tailwind -->
<button class="
  inline-flex items-center justify-center gap-2
  h-11 px-5 min-w-16
  rounded-md
  bg-kt-red text-white font-semibold text-base
  hover:bg-kt-red-hover active:bg-kt-red-pressed
  focus-visible:outline-none focus-visible:shadow-focus
  transition duration-fast ease-flow
  disabled:opacity-45 disabled:cursor-not-allowed
">
  시작하기
</button>
```

### Card

```html
<article class="
  bg-bg border border-border rounded-lg p-6
  transition duration-base ease-flow
  hover:shadow-md hover:-translate-y-0.5
">
  <header class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold">5G 시그니처</h3>
    <span class="
      inline-flex items-center px-2 h-[22px] text-xs font-semibold
      rounded-full bg-kt-red-soft text-kt-red
    ">추천</span>
  </header>
  <p class="text-fg-muted leading-relaxed">데이터 무제한, 미디어 혜택 포함.</p>
</article>
```

### Input + 에러

```html
<label class="flex flex-col gap-2">
  <span class="text-sm font-semibold">이메일<span class="text-kt-red ml-0.5">*</span></span>
  <input class="
    h-12 px-4
    bg-bg border border-border-strong rounded-md
    text-base text-fg placeholder:text-fg-subtle
    hover:border-kt-gray-500
    focus:outline-none focus:border-kt-red focus:shadow-focus
    transition duration-fast ease-flow
  " placeholder="name@kt.com" />
  <span class="text-xs text-kt-danger flex items-center gap-1.5">⚠ 이메일 형식이 올바르지 않습니다.</span>
</label>
```

---

## 5. 다크모드

`tailwind.config.js`에서 `darkMode: ['class', '[data-theme="dark"]']`로 설정되어 있어 두 방식 모두 동작합니다.

```html
<html data-theme="dark">
<!-- 또는 -->
<html class="dark">
```

시맨틱 별칭(`bg`, `fg`, `border`)은 CSS 변수를 직접 참조하므로 **클래스 한 번으로 라이트/다크 양쪽이 자동 처리**됩니다.

```html
<!-- 다크모드 분기를 따로 쓸 필요 없음 -->
<div class="bg-bg text-fg">자동으로 다크모드 대응</div>

<!-- 필요할 때만 dark: 변형 사용 -->
<div class="bg-white dark:bg-kt-gray-900">명시적 분기</div>
```

---

## 6. 권장 사용 패턴

### Do
- 시맨틱 별칭(`bg`, `fg`, `border`)을 먼저 고려 → 다크모드/테마 변경에 자동 대응
- 브랜드 강조에만 `kt-red`/`kt-red-soft` 사용
- spacing 키는 4의 배수만 사용

### Don't
- ❌ 임의 값 `bg-[#e60012]` 사용 금지 — 토큰을 안 쓰는 신호
- ❌ Tailwind의 기본 색상(`bg-red-500`, `text-gray-700`) 사용 금지
- ❌ `text-[15px]` 같은 비표준 사이즈 — 토큰 스케일을 벗어남

---

## 7. ESLint / Prettier 권장

```js
// .eslintrc.js — tailwindcss 플러그인
{
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/no-arbitrary-value': 'warn',
    'tailwindcss/classnames-order': 'warn',
  }
}
```

`tailwindcss/no-arbitrary-value`는 `bg-[#fff]` 같은 임의값을 잡아내 토큰 사용을 강제합니다.

---

**버전:** 1.0 · Tailwind CSS ≥ 3.4 기준
