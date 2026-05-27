# KT Design System — Figma Component Library Template

> Figma에서 KT 디자인 시스템 컴포넌트 라이브러리를 구성할 때 사용하는 표준 카탈로그.
> 각 컴포넌트는 Variant / State / Props (Component Properties) 를 모두 정의.

## 1. 라이브러리 구조

```
KT Design System Library
├── 0. Foundation
│   ├── Color Swatches
│   ├── Type Scale
│   ├── Spacing Ruler
│   ├── Radius Sampler
│   └── Shadow Sampler
├── 1. Form
│   ├── Button
│   ├── Input
│   ├── Textarea
│   ├── Select
│   ├── Checkbox
│   ├── Radio
│   └── Switch
├── 2. Container
│   ├── Card
│   ├── Modal
│   ├── Drawer
│   └── Toast
├── 3. Status
│   ├── Badge
│   ├── Chip
│   ├── Alert
│   ├── Progress
│   └── Steps
├── 4. Navigation
│   ├── Header
│   ├── Sidebar
│   ├── Tabs
│   ├── Breadcrumb
│   └── Pagination
├── 5. Data Display
│   ├── Table
│   ├── Data Table (dense / sortable)
│   ├── List Item
│   └── Metric Card
└── 6. Admin
    ├── Page Header
    ├── Toolbar
    ├── Filter Bar
    ├── Empty State
    ├── Loading State
    ├── Approval Timeline
    ├── Audit Log
    └── Status Summary
```

## 2. Form 컴포넌트

### Button

| Property | Type | Values | Default |
|---|---|---|---|
| Variant | Variant | primary / secondary / outline / ghost / danger | primary |
| Size | Variant | sm / md / lg / xl | md |
| State | Variant | default / hover / focus / pressed / disabled / loading | default |
| Icon Left | Boolean | true / false | false |
| Icon Right | Boolean | true / false | false |
| Block | Boolean | true / false | false |
| Label | Text | (custom) | "Button" |

Anatomy: `[icon?] · Label · [icon? / spinner?]`

Token mapping:
- `bg` ← `--kt-red` / `--kt-black` / transparent / `--kt-danger`
- `color` ← `--kt-white` / `--kt-text`
- `radius` ← `--kt-radius-md` (sm 은 `--kt-radius-sm`)
- `padding` ← `--kt-space-5` / `--kt-space-4` / `--kt-space-6` / `--kt-space-8`
- `height` ← 36 / 44 / 52 / 60

### Input

| Property | Type | Values | Default |
|---|---|---|---|
| Type | Variant | text / email / number / password / search | text |
| Size | Variant | md / lg | md |
| State | Variant | default / focus / disabled / invalid | default |
| Has Hint | Boolean | true / false | false |
| Has Error | Boolean | true / false | false |
| Has Required Mark | Boolean | true / false | false |
| Label | Text | (custom) | "Label" |
| Placeholder | Text | (custom) | "name@kt.com" |
| Hint | Text | (custom) | "" |
| Error Message | Text | (custom) | "" |

Anatomy: `Label [*] · Input · [Hint | Error]`

### Select / Checkbox / Radio / Switch

같은 패턴: Variant (size/state) + Boolean (checked/disabled).

## 3. Container 컴포넌트

### Card

| Property | Type | Values | Default |
|---|---|---|---|
| Variant | Variant | default / elevated / outlined / interactive | default |
| Header | Boolean | true / false | true |
| Footer | Boolean | true / false | false |
| Badge | Boolean | true / false | false |
| Title | Text | (custom) | "Card title" |
| Body | Text | (custom) | "Body text" |

### Modal

| Property | Type | Values | Default |
|---|---|---|---|
| Size | Variant | sm / md / lg / fullscreen | md |
| Has Footer | Boolean | true / false | true |
| Action Count | Variant | 1 / 2 | 2 |
| Title | Text | (custom) | "Modal title" |

### Drawer

| Property | Type | Values | Default |
|---|---|---|---|
| Side | Variant | right / left | right |
| Width | Variant | sm (360) / md (480) / lg (640) | md |
| Has Footer | Boolean | true / false | true |

## 4. Status 컴포넌트

### Badge

| Property | Type | Values | Default |
|---|---|---|---|
| Variant | Variant | default / brand / soft / info / success / warning / danger / outline | default |
| Has Dot | Boolean | true / false | false |
| Label | Text | (custom) | "Badge" |

### Alert

| Property | Type | Values | Default |
|---|---|---|---|
| Variant | Variant | info / success / warning / danger / brand | info |
| Has Title | Boolean | true / false | true |
| Has Icon | Boolean | true / false | true |
| Has Close | Boolean | true / false | false |
| Title | Text | (custom) | "Alert title" |
| Body | Text | (custom) | "Alert body" |

### Steps

| Property | Type | Values | Default |
|---|---|---|---|
| Step Count | Variant | 3 / 4 / 5 / 6 | 3 |
| Current Step | Number | 1-N | 2 |
| Orientation | Variant | horizontal / vertical | horizontal |

## 5. Navigation 컴포넌트

### Sidebar

| Property | Type | Values | Default |
|---|---|---|---|
| Width | Variant | 200 / 240 / 280 | 240 |
| Has Section Title | Boolean | true / false | true |
| Item Count | Number | 3-12 | 6 |

Anatomy: `Section Title · [Icon · Label] x N · [Footer]`

### Tabs

| Property | Type | Values | Default |
|---|---|---|---|
| Tab Count | Variant | 2 / 3 / 4 / 5 | 3 |
| Active Index | Number | 1-N | 1 |

### Pagination

| Property | Type | Values | Default |
|---|---|---|---|
| Total Pages | Number | (custom) | 10 |
| Current Page | Number | 1-N | 1 |
| Has Page Info | Boolean | true / false | true |
| Show First/Last | Boolean | true / false | true |

## 6. Data Display 컴포넌트

### Data Table

| Property | Type | Values | Default |
|---|---|---|---|
| Density | Variant | default / dense | default |
| Sortable | Boolean | true / false | false |
| Selectable | Boolean | true / false | false |
| Row Count | Number | 5-50 | 10 |
| Column Count | Number | 3-10 | 5 |

### Metric Card

| Property | Type | Values | Default |
|---|---|---|---|
| Has Delta | Boolean | true / false | true |
| Delta Direction | Variant | up / down / flat | up |
| Has Hint | Boolean | true / false | false |
| Label | Text | (custom) | "Metric" |
| Value | Text | (custom) | "1,234" |
| Delta | Text | (custom) | "+12%" |

## 7. Admin 컴포넌트

### Page Header

| Property | Type | Values | Default |
|---|---|---|---|
| Has Description | Boolean | true / false | true |
| Action Count | Variant | 0 / 1 / 2 / 3 | 1 |
| Title | Text | (custom) | "Page title" |
| Description | Text | (custom) | "Page description" |

### Filter Bar

| Property | Type | Values | Default |
|---|---|---|---|
| Chip Count | Number | 2-8 | 4 |
| Has Active Chip | Boolean | true / false | true |
| Has Clear Button | Boolean | true / false | true |

### Empty State

| Property | Type | Values | Default |
|---|---|---|---|
| Has Action | Boolean | true / false | true |
| Variant | Variant | no-data / no-results / no-access / error | no-data |
| Title | Text | (custom) | "데이터가 없습니다" |
| Description | Text | (custom) | "필터를 조정하거나 새 항목을 추가해 보세요." |

### Approval Timeline

| Property | Type | Values | Default |
|---|---|---|---|
| Step Count | Number | 2-8 | 4 |
| Has Notes | Boolean | true / false | true |

각 Step의 State: pending / approved / rejected / current.

### Audit Log

| Property | Type | Values | Default |
|---|---|---|---|
| Entry Count | Number | 5-50 | 10 |
| Density | Variant | default / dense | default |

각 Entry: time · actor · action.

## 8. Foundation 페이지 (참고용 갤러리)

### Color Swatches
- Brand swatches (red / red-hover / red-pressed / red-soft / black / white)
- Gray scale (50 ~ 950)
- Semantic (info / success / warning / danger + soft variants)
- Surface (base / subtle / muted / inverse)

### Type Scale
- 11 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 76 까지 한글 + 영문 샘플

### Spacing Ruler
- 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 80 / 96 / 128 시각화

### Radius Sampler
- 4 / 6 / 10 / 14 / 20 / 28 / full 적용된 박스

### Shadow Sampler
- xs / sm / md / lg / xl / focus 적용된 카드

## 9. 빌드 절차

1. **Figma 파일 생성** — "KT Design System Library"
2. **Color Variables import** (Token Studio 또는 수동)
3. **Foundation 페이지 작성** — 토큰을 시각화한 갤러리
4. **각 컴포넌트를 Frame으로** 만들기 — Properties + Variants 정의
5. **Component Set으로 변환** — Variant 별로 그룹핑
6. **Library 게시** — Figma 우상단 "Publish library"
7. **다른 파일에서 import** — Enable library 후 사용

## 10. 검수 체크리스트

- [ ] Foundation 페이지 5개 모두 작성됨
- [ ] Form / Container / Status / Navigation / Data Display / Admin 카테고리에 컴포넌트 모두 등록
- [ ] 모든 컴포넌트에 Properties + Variants 정의됨
- [ ] 모든 색·spacing·radius가 Variable로 bind됨 (인라인 hex 0)
- [ ] Light / Dark mode 둘 다 동작
- [ ] Pretendard 폰트 임베드됨
- [ ] Library 게시 + 다른 파일에서 import 테스트

---

생성 출처: AXDD SkillOps Console — Enterprise Lite (Phase 7-H)
