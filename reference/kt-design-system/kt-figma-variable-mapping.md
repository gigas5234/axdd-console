# KT Design System × Figma Variables — Mapping Guide

KT 디자인 토큰을 Figma 변수(Variables) 시스템으로 옮기는 가이드입니다. 디자인 ↔ 코드 ↔ 클로드가 같은 이름의 토큰을 공유하도록 합니다.

---

## 1. 컬렉션 구조

Figma → **Local variables** 패널에서 다음 4개 컬렉션을 만듭니다.

| 컬렉션 | 모드 | 용도 |
|---|---|---|
| **1. Primitives** | `Default` | 변하지 않는 원시값 (red.500, gray.100, 16px 등) |
| **2. Semantic** | `Light`, `Dark` | 의미 기반 토큰 (text.default, bg.subtle) — 모드별 다른 primitive 참조 |
| **3. Typography** | `Default` | 폰트 사이즈/패밀리/굵기/행간 |
| **4. Spacing & Layout** | `Default` | 스페이싱, 라디우스, z-index |

> 💡 Semantic 컬렉션이 Primitives를 **참조(alias)**하는 구조여야 다크모드 토글이 자동으로 동작합니다.

---

## 2. Collection 1 — Primitives

### Group: `brand/`
| 변수명 | 타입 | 값 | 대응 CSS |
|---|---|---|---|
| `brand/red`          | Color | `#E60012` | `--kt-red` |
| `brand/red-hover`    | Color | `#C70010` | `--kt-red-hover` |
| `brand/red-pressed`  | Color | `#A8000D` | `--kt-red-pressed` |
| `brand/red-soft`     | Color | `#FFEDEE` | `--kt-red-soft` |
| `brand/black`        | Color | `#141414` | `--kt-black` |

### Group: `gray/`
| 변수명 | 타입 | 값 |
|---|---|---|
| `gray/50`  | Color | `#FAFAFA` |
| `gray/100` | Color | `#F4F4F5` |
| `gray/200` | Color | `#E6E6E8` |
| `gray/300` | Color | `#D1D1D6` |
| `gray/400` | Color | `#A8A8B0` |
| `gray/500` | Color | `#76767E` |
| `gray/600` | Color | `#54545B` |
| `gray/700` | Color | `#3A3A40` |
| `gray/800` | Color | `#25252A` |
| `gray/900` | Color | `#18181B` |
| `gray/950` | Color | `#0A0A0B` |

### Group: `semantic-base/`
| 변수명 | 타입 | 값 |
|---|---|---|
| `semantic-base/info`         | Color | `#2A6FDB` |
| `semantic-base/info-soft`    | Color | `#EAF1FC` |
| `semantic-base/success`      | Color | `#1F8A5B` |
| `semantic-base/success-soft` | Color | `#E6F4ED` |
| `semantic-base/warning`      | Color | `#C77700` |
| `semantic-base/warning-soft` | Color | `#FDF2DE` |
| `semantic-base/danger`       | Color | `#D7263D` |
| `semantic-base/danger-soft`  | Color | `#FCEAEC` |
| `semantic-base/white`        | Color | `#FFFFFF` |

> ⚠️ Primitives 컬렉션의 변수는 **컴포넌트에 직접 적용하지 마세요**. 항상 Semantic을 거칩니다.

---

## 3. Collection 2 — Semantic (Light + Dark 모드)

각 변수는 `Light` / `Dark` 두 모드를 가집니다. 값은 Primitives의 alias.

### Group: `color/text/`
| 변수명 | Light → | Dark → | CSS |
|---|---|---|---|
| `color/text/default`  | `gray/900` | `#F5F5F7` *(또는 새 primitive `gray-dark/50`)* | `--kt-text` |
| `color/text/muted`    | `gray/600` | `#B4B4BB` | `--kt-text-muted` |
| `color/text/subtle`   | `gray/500` | `#88888F` | `--kt-text-subtle` |
| `color/text/disabled` | `gray/400` | `gray/700` | `--kt-text-disabled` |
| `color/text/inverse`  | `semantic-base/white` | `brand/black` | `--kt-text-inverse` |
| `color/text/brand`    | `brand/red` | `brand/red` | `--kt-text-brand` |
| `color/text/link`     | `brand/red` | `brand/red` | `--kt-text-link` |

### Group: `color/bg/`
| 변수명 | Light → | Dark → | CSS |
|---|---|---|---|
| `color/bg/default`  | `semantic-base/white` | `#0A0A0B` | `--kt-bg` |
| `color/bg/subtle`   | `gray/50`  | `#131316` | `--kt-bg-subtle` |
| `color/bg/muted`    | `gray/100` | `#1B1B1F` | `--kt-bg-muted` |
| `color/bg/inverse`  | `brand/black` | `semantic-base/white` | `--kt-bg-inverse` |

### Group: `color/border/`
| 변수명 | Light → | Dark → | CSS |
|---|---|---|---|
| `color/border/default` | `gray/200` | `#2A2A2F` | `--kt-border` |
| `color/border/strong`  | `gray/300` | `#3A3A40` | `--kt-border-strong` |
| `color/border/focus`   | `brand/red` | `brand/red` | `--kt-border-focus` |

### Group: `color/feedback/`
> 시맨틱 컬러는 두 모드 모두 base를 그대로 alias하되, `*-soft`만 다크모드용 별도 primitive(또는 `color/24` opacity)로 분기.

| 변수명 | Light → | Dark → |
|---|---|---|
| `color/feedback/info`         | `semantic-base/info` | `semantic-base/info` |
| `color/feedback/info-soft`    | `semantic-base/info-soft` | `info @ 16%` *(또는 새 primitive)* |
| `color/feedback/success`      | `semantic-base/success` | `semantic-base/success` |
| `color/feedback/warning`      | `semantic-base/warning` | `semantic-base/warning` |
| `color/feedback/danger`       | `semantic-base/danger` | `semantic-base/danger` |
| `color/feedback/brand-soft`   | `brand/red-soft` | `red @ 14%` |

---

## 4. Collection 3 — Typography

### Group: `font-family/`
| 변수명 | 타입 | 값 |
|---|---|---|
| `font-family/sans` | String | `Pretendard` |
| `font-family/mono` | String | `JetBrains Mono` |

### Group: `font-size/` *(Number 타입)*
| 변수명 | 값 | CSS |
|---|---|---|
| `font-size/2xs`  | 11 | `--kt-text-2xs` |
| `font-size/xs`   | 12 | `--kt-text-xs` |
| `font-size/sm`   | 14 | `--kt-text-sm` |
| `font-size/base` | 16 | `--kt-text-base` |
| `font-size/lg`   | 18 | `--kt-text-lg` |
| `font-size/xl`   | 20 | `--kt-text-xl` |
| `font-size/2xl`  | 24 | `--kt-text-2xl` |
| `font-size/3xl`  | 30 | `--kt-text-3xl` |
| `font-size/4xl`  | 36 | `--kt-text-4xl` |
| `font-size/5xl`  | 48 | `--kt-text-5xl` |
| `font-size/6xl`  | 60 | `--kt-text-6xl` |
| `font-size/7xl`  | 76 | `--kt-text-7xl` |

### Group: `font-weight/` *(Number)*
| 변수명 | 값 |
|---|---|
| `font-weight/regular`  | 400 |
| `font-weight/medium`   | 500 |
| `font-weight/semibold` | 600 |
| `font-weight/bold`     | 700 |
| `font-weight/black`    | 800 |

### Group: `line-height/` *(Number, 단위 %)*
> Figma는 line-height를 % 또는 px로 받습니다. 비율 그대로 적용.

| 변수명 | 값 |
|---|---|
| `line-height/tight`   | 115 |
| `line-height/snug`    | 135 |
| `line-height/normal`  | 155 |
| `line-height/relaxed` | 170 |

### Text Styles (Figma "Text styles" — 변수를 묶은 결과물)

Figma 우측 패널에서 텍스트 스타일을 만들 때 위 변수들을 조합해 다음 14개 스타일을 등록하세요. (코드의 `.kt-display`, `.kt-h1` …와 1:1 매칭)

| Style 이름 | Family | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| `KT/Display` | sans | 7xl | bold (700) | tight | -3.5% |
| `KT/H1` | sans | 5xl | bold | tight | -2% |
| `KT/H2` | sans | 4xl | bold | tight | -2% |
| `KT/H3` | sans | 3xl | semibold | snug | 0 |
| `KT/H4` | sans | 2xl | semibold | snug | 0 |
| `KT/H5` | sans | xl | semibold | snug | 0 |
| `KT/Body-LG` | sans | lg | regular | relaxed | 0 |
| `KT/Body` | sans | base | regular | normal | 0 |
| `KT/Body-SM` | sans | sm | regular | normal | 0 |
| `KT/Caption` | sans | xs | regular | normal | 0 |
| `KT/Overline` | sans | xs | semibold | normal | +4% / UPPER |

---

## 5. Collection 4 — Spacing & Layout

### Group: `spacing/` *(Number)*
| 변수명 | 값 |
|---|---|
| `spacing/0`  | 0 |
| `spacing/1`  | 4 |
| `spacing/2`  | 8 |
| `spacing/3`  | 12 |
| `spacing/4`  | 16 |
| `spacing/5`  | 20 |
| `spacing/6`  | 24 |
| `spacing/8`  | 32 |
| `spacing/10` | 40 |
| `spacing/12` | 48 |
| `spacing/16` | 64 |
| `spacing/20` | 80 |
| `spacing/24` | 96 |
| `spacing/32` | 128 |

> Auto-layout의 padding/gap에 이 변수를 바인딩하세요. (우클릭 → Apply variable)

### Group: `radius/` *(Number)*
| 변수명 | 값 |
|---|---|
| `radius/xs`   | 4 |
| `radius/sm`   | 6 |
| `radius/md`   | 10 |
| `radius/lg`   | 14 |
| `radius/xl`   | 20 |
| `radius/2xl`  | 28 |
| `radius/full` | 9999 |

### Group: `container/` *(Number)*
| 변수명 | 값 |
|---|---|
| `container/sm`  | 640 |
| `container/md`  | 768 |
| `container/lg`  | 1024 |
| `container/xl`  | 1280 |
| `container/2xl` | 1440 |

> Effects(shadow)는 현재 Figma Variables가 직접 지원하지 않습니다. **Local styles → Effects**로 등록하세요:
> - `KT/Shadow-xs` ~ `KT/Shadow-xl` (5개)
> - `KT/Shadow-focus`

---

## 6. 다크모드 사용법

Figma 캔버스 → 프레임 선택 → 오른쪽 **Layer** 패널 → **Variables** 모드 드롭다운에서 `Light` / `Dark` 전환. 모든 semantic 변수가 즉시 다크값으로 갱신됩니다.

> 컴포넌트는 **항상 Semantic 변수만 사용**해야 모드 전환이 동작합니다. Primitives(gray/900 등)를 직접 적용하면 다크모드에서 안 바뀝니다.

---

## 7. 이름 규칙 — 코드와 1:1 매칭

| Figma 변수 | CSS 변수 | JSON 토큰 경로 |
|---|---|---|
| `brand/red` | `--kt-red` | `color.brand.red` |
| `color/text/default` | `--kt-text` | `color.text.default` |
| `color/bg/subtle` | `--kt-bg-subtle` | `color.surface.bg-subtle` |
| `spacing/4` | `--kt-space-4` | `spacing.4` |
| `radius/md` | `--kt-radius-md` | `radius.md` |
| `font-size/lg` | `--kt-text-lg` | `typography.fontSize.lg` |

**규칙**: `/`(Figma group) ↔ `-`(CSS variable hyphen) ↔ `.`(JSON path). 이 매핑이 깨지면 자동화 도구가 동기화에 실패합니다.

---

## 8. 자동 동기화 (선택 사항)

세 가지 출처(`kt-design-tokens.json` ↔ `tokens.css` ↔ Figma)를 자동 동기화하려면:

### 옵션 A — Tokens Studio for Figma (무료/유료)
1. Figma 플러그인 **Tokens Studio** 설치
2. **Import** → `kt-design-tokens.json` (이미 W3C DTCG 포맷)
3. 그룹 구조와 이름이 그대로 Figma Variables에 매핑됨
4. **Sync** 탭에서 GitHub repo 연결 → 양방향 동기화

### 옵션 B — Style Dictionary (코드 우선)
```bash
npm install -D style-dictionary
```

`config.json`:
```json
{
  "source": ["kt-ds/kt-design-tokens.json"],
  "platforms": {
    "css":    { "transformGroup": "css",  "buildPath": "kt-ds/", "files": [{ "destination": "tokens.css", "format": "css/variables" }] },
    "figma":  { "transformGroup": "js",   "buildPath": "kt-ds/", "files": [{ "destination": "figma-tokens.json", "format": "json/flat" }] },
    "tailwind":{ "transformGroup": "js",  "buildPath": "kt-ds/", "files": [{ "destination": "tailwind-tokens.js", "format": "javascript/module-flat" }] }
  }
}
```
```bash
npx style-dictionary build
```

### 옵션 C — Figma REST API (직접 스크립트)
Figma → 계정 설정에서 **Personal Access Token** 발급 → `POST /v1/files/:key/variables` 엔드포인트로 JSON 파일을 그대로 푸시.

> 권장: **옵션 A**. 가장 빠르고, 디자이너가 익숙합니다.

---

## 9. 컴포넌트 라이브러리 구축 체크리스트

Figma 컴포넌트를 만들 때:

- [ ] 색은 **Semantic 변수만** 사용 (Primitives 직접 바인딩 금지)
- [ ] padding/gap은 **spacing/* 변수**로 바인딩
- [ ] 모서리는 **radius/* 변수**로 바인딩
- [ ] 텍스트는 **Text Style**(KT/H1 등) 적용
- [ ] 그림자는 **Effect Style**(KT/Shadow-md 등) 적용
- [ ] Variants는 **Properties**로 (size, variant, state)
- [ ] 코드의 클래스명(`.kt-btn--primary`)을 컴포넌트 description에 적어두면 핸드오프가 깔끔

---

## 10. 검증

세 곳의 값이 같은지 확인:

| 항목 | Figma | CSS | JSON |
|---|---|---|---|
| KT Red | `brand/red` = `#E60012` | `var(--kt-red)` = `#E60012` | `color.brand.red.$value` = `#E60012` |
| Body 사이즈 | `font-size/base` = 16 | `var(--kt-text-base)` = 16px | `typography.fontSize.base.$value` = 16px |
| 카드 radius | `radius/lg` = 14 | `var(--kt-radius-lg)` = 14px | `radius.lg.$value` = 14px |

값이 어긋나면 동기화 파이프라인을 다시 점검하세요.

---

**버전:** 1.0 · Figma Variables (2024+) 기준
