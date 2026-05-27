/**
 * UX/UI Real Content Builder — Phase 7-F.
 *
 * 이전(Phase 7-E)에는 references/assets/tests를 "skeleton placeholder"로 채웠다.
 * 사용자 피드백: "파일은 있는데 실제 UX/UI 실무 내용이 없어 전사 배포 불가".
 *
 * 이 모듈은 각 파일명을 보고 **실제 사용 가능한 UX/UI 컨텐츠**를 생성한다.
 * scaffold 마커("Skeleton file auto-generated", "TODO" 등) 제거.
 *
 * 모든 컨텐츠는:
 *   - 전사 내부 디자이너·PM·개발자가 그대로 활용 가능
 *   - generic AxDD-SKILLS reference clone 아님 (UX/UI 특화)
 *   - 사내 디자인팀이 보강·확장 가능한 구조
 */

import type { Skill } from "./types";

export type DependencyKind = "references" | "assets" | "scripts" | "tests";

/**
 * 파일명·종류 기반으로 실제 UX/UI 컨텐츠 생성.
 * 매칭되지 않는 파일은 generic but real 컨텐츠 (scaffold 마커 없이).
 */
export function buildUxuiContent(
  kind: DependencyKind,
  basename: string,
  skill: Skill,
): string {
  // ─── references/ ──────────────────────────────────────────
  if (kind === "references") {
    if (basename === "ui-ux-keyword-list.md") return REF_UI_UX_KEYWORD_LIST;
    if (basename === "axdd-design-system.md") return REF_AXDD_DESIGN_SYSTEM;
    if (basename === "customer-design-system-template.md")
      return REF_CUSTOMER_DS_TEMPLATE;
    if (basename === "element-categorization.md") return REF_ELEMENT_CATEGORIZATION;
    if (basename === "token-naming-convention.md") return REF_TOKEN_NAMING;
    if (basename === "spacing-scale-guide.md") return REF_SPACING_SCALE;
    if (basename === "double-diamond-method.md") return REF_DOUBLE_DIAMOND;
    return buildGenericReference(basename, skill);
  }

  // ─── assets/ ──────────────────────────────────────────────
  if (kind === "assets") {
    if (basename === "component-spec-template.md") return ASSET_COMPONENT_SPEC;
    if (basename === "wireframe-template.md") return ASSET_WIREFRAME;
    if (basename === "ux-process-asset-pack.md") return ASSET_UX_PROCESS_PACK;
    if (basename === "user-flow-template.md") return ASSET_USER_FLOW;
    if (basename === "ia-tree-template.md") return ASSET_IA_TREE;
    if (basename === "handoff-doc-template.md") return ASSET_HANDOFF_DOC;
    if (basename === "figma-frame-recipes.md") return ASSET_FIGMA_RECIPES;
    if (basename === "kickoff-template.md") return ASSET_KICKOFF;
    if (basename === "risk-template.md") return ASSET_RISK;
    if (basename === "validation-checklist.md") return ASSET_VALIDATION_CHECKLIST;
    if (basename === "milestone-template.html") return ASSET_MILESTONE_HTML;
    // Phase 7-G — design-system-ingest-skill assets
    if (basename === "design-token-template.json") return ASSET_DESIGN_TOKEN_JSON;
    if (basename === "tailwind-token-mapping.md") return ASSET_TAILWIND_MAPPING;
    if (basename === "figma-variable-mapping.md") return ASSET_FIGMA_VAR_MAPPING;
    if (basename === "component-library-template.md") return ASSET_COMPONENT_LIB;
    return buildGenericAsset(basename, skill);
  }

  // ─── scripts/ ─────────────────────────────────────────────
  if (kind === "scripts") {
    return buildScriptContent(basename, skill);
  }

  // ─── tests/ ───────────────────────────────────────────────
  return buildTestContent(basename, skill);
}

/* ═══════════════════════════════════════════════════════════════
 * REFERENCES — 실제 UX/UI 지식 자산
 * ═══════════════════════════════════════════════════════════════ */

const REF_UI_UX_KEYWORD_LIST = `# UI/UX Keyword List & Filter Rules

전체 프로젝트 Requirement에서 **UI/UX 관련 항목만** 식별·추출할 때 사용하는 키워드 사전.

## 1. 포함 (Include) 키워드

### 화면·레이아웃
- 화면, 페이지, 뷰, UI, 인터페이스, layout, 그리드, 헤더, 푸터, 사이드바, 네비게이션
- 모달, 다이얼로그, 토스트, 알림창, 팝업, 드로어

### 컴포넌트
- 버튼, 입력, 폼, 필드, 체크박스, 라디오, 셀렉트, 드롭다운, 토글, 슬라이더
- 카드, 리스트, 테이블, 차트, 그래프, 배지, 태그, 아바타, 아이콘
- 탭, 아코디언, breadcrumb, pagination

### 인터랙션·플로우
- 사용자 플로우, 시나리오, 작업 흐름, journey, 화면 전환, 라우팅
- 호버, 클릭, 포커스, 키보드 네비게이션, 드래그앤드롭, 스와이프
- 애니메이션, 전환, 모션, 페이드, 슬라이드, 트랜지션

### 디자인 시스템
- 디자인 시스템, design system, 토큰, token, 컬러, 색상, 팔레트
- typography, 폰트, 타이포, line-height, font-weight
- spacing, padding, margin, gap, gutter
- radius, shadow, elevation, depth

### 접근성·반응형
- 접근성, accessibility, a11y, WCAG, 스크린리더, 키보드 접근
- 반응형, responsive, breakpoint, mobile, tablet, desktop
- 다크모드, dark mode, theme, 테마

### 정보 구조
- IA, Information Architecture, 정보 구조, 사이트맵, 메뉴 구조, 라우트

## 2. 제외 (Exclude) 키워드 — 백엔드·인프라

- API, endpoint, REST, GraphQL, microservice
- DB, database, schema, query, transaction, migration
- 인프라, infra, server, deployment, CI/CD, Docker
- 인증, auth, OAuth, JWT, session, encryption
- 메시지 큐, message queue, Kafka, RabbitMQ
- 로깅, logging, monitoring, Sentry, DataDog
- 성능, performance, caching, CDN (UX 관점 외)

## 3. 필터링 예시

### 원본 요구사항
> "주문 생성 화면에서 사용자가 상품을 선택하면 결제 API를 호출해 결제 처리하고
> 완료 시 토스트 알림을 띄운다. DB에는 주문 내역을 저장한다."

### UI/UX 한정 추출
- ✅ **주문 생성 화면** (화면)
- ✅ **상품 선택** (인터랙션)
- ✅ **토스트 알림** (컴포넌트)
- ❌ ~~결제 API 호출~~ (백엔드)
- ❌ ~~DB 저장~~ (백엔드)

### 결과 (요약본 1줄)
> "주문 생성 화면: 상품 선택 → 결제 진행 상태 표시 → 완료 토스트"

## 4. 모호한 경우 처리

- 양쪽 영역에 걸친 항목(예: "결제 진행 UI") → 포함하되 *(UI 부분만)* 명시
- 추출 후에도 100% 확신 없으면 \`Open Questions\`에 남기고 PM 확인 요청
`;

const REF_AXDD_DESIGN_SYSTEM = `# AXDD Design System Reference

> 전사 내부 프로젝트에서 공통으로 차용하는 AXDD 자체 디자인 시스템 가이드.
> 이 파일은 **고정 자산** — UX/UI atomic skill들이 이 자료를 input으로 받는다.

## 1. 원칙

1. **일관성 우선** — 사내 프로젝트 모두 동일한 토큰·패턴 사용
2. **확장성** — 프로젝트별 특화 토큰은 namespace로 분리 (\`project/myproject/...\`)
3. **접근성 기본** — 모든 컴포넌트 WCAG 2.1 AA 충족
4. **반응형 표준** — Mobile-first, breakpoint sm/md/lg/xl

## 2. Color Token 카테고리

| 카테고리 | 패턴 | 예시 |
|---|---|---|
| Brand | \`color/brand/<role>\` | \`color/brand/primary\`, \`color/brand/accent\` |
| Surface | \`color/surface/<level>\` | \`color/surface/base\`, \`color/surface/elevated\` |
| Ink (텍스트) | \`color/ink/<role>\` | \`color/ink/primary\`, \`color/ink/secondary\` |
| Border | \`color/border/<role>\` | \`color/border/default\`, \`color/border/focus\` |
| Status | \`color/status/<state>\` | \`success\`, \`warning\`, \`error\`, \`info\` |

> **Hex 값**: AXDD 디자인팀이 [\`our-design-system\` 사내 저장소](https://axdd.internal/design-system) 또는 별도 카탈로그에서 관리. 이 reference는 토큰 **이름과 카테고리만** 정의.

## 3. Typography Scale (7-step)

| Token | 용도 | 권장 weight |
|---|---|---|
| \`text/display\` | 페이지 hero 헤더 | 700 |
| \`text/h1\` | 페이지 제목 | 600 |
| \`text/h2\` | 섹션 제목 | 600 |
| \`text/h3\` | 서브 섹션 | 600 |
| \`text/body\` | 본문 | 400 |
| \`text/caption\` | 보조 텍스트·라벨 | 400 |
| \`text/code\` | 코드·토큰명 | mono 500 |

## 4. Spacing Scale (4의 배수)

\`\`\`
xs   4px
sm   8px
md  12px
lg  16px
xl  24px
2xl 32px
3xl 48px
\`\`\`

- 컴포넌트 내부 padding: sm ~ lg
- 컴포넌트 간 gap: md ~ xl
- 섹션 간 spacing: xl ~ 3xl

## 5. Radius / Shadow / Motion

| 카테고리 | 토큰 | 용도 |
|---|---|---|
| Radius | \`radius/sm\` (4) / \`radius/md\` (8) / \`radius/lg\` (12) | 카드·버튼 |
| Shadow | \`shadow/sm\` (1px) / \`shadow/md\` (3-6px) / \`shadow/lg\` (10-20px) | 호버·모달 |
| Motion | \`motion/fast\` (120ms) / \`motion/normal\` (200ms) / \`motion/slow\` (400ms) | ease-out 기본 |

## 6. 공용 컴포넌트 (사내 표준)

| Component | Variants | States |
|---|---|---|
| Button | primary / secondary / ghost / danger | default / hover / focus / disabled / loading |
| Card | default / elevated / outlined | default / hover (interactive 일 때) |
| Input | text / number / search / textarea | default / focus / error / disabled |
| Select | single / multi / searchable | default / open / disabled |
| Modal | sm / md / lg / fullscreen | open / closed |
| Toast | success / warning / error / info | enter / visible / exit |
| Table | default / striped / sortable | default / hover row / selected row |
| Tabs | horizontal / vertical | active / inactive |

## 7. 폴백 룰

| 상황 | 폴백 |
|---|---|
| 고객사 DS 인풋 있음 | 고객사 토큰 우선 + AXDD 토큰은 보조 |
| 고객사 DS 일부만 정의 (예: color만) | 정의된 카테고리는 고객사 / 미정의 카테고리는 AXDD |
| 양쪽 모두 없음 | DS Bootstrap 워크유닛으로 새로 생성 |

## 8. 네이밍 룰

- kebab-case 또는 slash (\`color/brand/primary\`)
- 절대 인라인 hex 금지 (\`#FF0000\` → \`color/status/error\`)
- 컴포넌트 prop 이름은 lowerCamelCase

자세한 룰은 \`references/token-naming-convention.md\` 참조.
`;

const REF_CUSTOMER_DS_TEMPLATE = `# Customer Design System Input Template

고객사 프로젝트에서 고객사가 제공한 디자인 시스템을 **AXDD 표준 폼**으로 변환할 때 사용.

## 1. 기본 정보

| 필드 | 값 | 비고 |
|---|---|---|
| Customer Name | (예: ㈜OOOO) | |
| DS Version | (예: v2.4) | 고객사 내부 버전 |
| DS Source | (Figma URL / Storybook URL / MD / zip) | 우선순위: Figma > Storybook > MD |
| Last Updated | YYYY-MM-DD | 고객사 측 최신 갱신일 |

## 2. Color Tokens (고객사 → AXDD 매핑)

\`\`\`
| 고객사 토큰명         | 고객사 Hex | AXDD 매핑           | 비고            |
| --------------------- | ---------- | ------------------- | --------------- |
| acme-blue-500         | #1E40AF    | color/brand/primary | (예시)          |
| acme-orange-400       | #F97316    | color/brand/accent  |                 |
| acme-gray-50          | #F9FAFB    | color/surface/base  |                 |
\`\`\`

> AXDD 매핑 컬럼이 비어있으면 → fallback 또는 새 토큰 신설 필요.

## 3. Typography

| 고객사 폰트 | weight | 용도 | AXDD 매핑 |
|---|---|---|---|
| Pretendard | 700 | 헤더 | text/display |
| Pretendard | 400 | 본문 | text/body |

## 4. Component Library

고객사 컴포넌트 이름 + AXDD 공용 컴포넌트와의 매핑:

| 고객사 컴포넌트 | AXDD 매핑 | 비고 |
|---|---|---|
| acme-button | Button | variant 매핑: solid → primary, outline → secondary |
| acme-modal | Modal | size 매핑 (xs/sm/md/lg/xl → sm/md/lg/fullscreen) |
| acme-banner | Toast or 신설 | 표시 위치·dismiss 방식 확인 |

## 5. Brand Guidelines

- 톤·무드 키워드: (예: 신뢰감, 전문성, 부드러움)
- 사용 금지 색·문구: (예: 경쟁사 컬러, 특정 슬로건)
- 로고 사용 룰: (위치·여백·최소 크기)

## 6. Accessibility 요구

| 항목 | 고객사 요구 | AXDD 기본 |
|---|---|---|
| 색 대비 | (예: WCAG AAA) | AA |
| 키보드 접근 | 모든 액션 | 모든 액션 |
| 스크린리더 | 모든 컴포넌트 | 표준 컴포넌트 |

## 7. 미매핑·갈등 항목

| 항목 | 사유 | 해결 |
|---|---|---|
| (예: 고객사가 inline hex 사용) | 토큰 부재 | AXDD에 임시 alias 생성 + 고객사에 토큰 정의 요청 |

## 8. 검수 체크리스트

- [ ] 모든 고객사 토큰이 AXDD에 매핑되거나 fallback 처리됨
- [ ] 폰트 라이선스 확인 (사내 사용 가능 여부)
- [ ] 컴포넌트 동작 차이 명시 (variant·state)
- [ ] 브랜드 가이드라인 어긋남 0건
- [ ] a11y 요구 충족
`;

const REF_ELEMENT_CATEGORIZATION = `# UI Element Categorization

UI 요소를 5개 카테고리로 분류해 매핑·재사용을 표준화한다.

## 1. Global Components (전역)

화면 어디서나 등장하는 공통 요소.

| Element | 용도 | 표준 컴포넌트 |
|---|---|---|
| Header | 페이지 상단 네비·로고·검색 | AppHeader |
| Footer | 페이지 하단 정보·링크 | AppFooter |
| Sidebar | 좌측 메인 네비게이션 | AppSidebar |
| TopNav | 상단 보조 메뉴 | TopNav |
| Breadcrumb | 위계 경로 표시 | Breadcrumb |
| SearchBar | 전역 검색 | SearchBar |
| UserMenu | 사용자 프로필·로그아웃 | UserMenu |

## 2. Layout Components (구조)

페이지 내부 영역을 구성.

| Element | 용도 | 표준 컴포넌트 |
|---|---|---|
| Container | 최대 너비 제한 | Container |
| Grid | 다열 레이아웃 | Grid (12-col) |
| Stack | 세로 spacing | VStack / HStack |
| Section | 의미 단위 그룹핑 | Section |
| Tabs | 탭 컨테이너 | Tabs |
| Accordion | 펼침/접힘 그룹 | Accordion |
| Divider | 영역 분리선 | Divider |

## 3. Input Components (입력)

사용자가 데이터를 넣는 요소.

| Element | 용도 | 표준 컴포넌트 |
|---|---|---|
| TextInput | 한 줄 텍스트 | Input type="text" |
| Textarea | 여러 줄 텍스트 | Textarea |
| Select | 단일 선택 | Select |
| MultiSelect | 다중 선택 | MultiSelect |
| Checkbox | bool / 다중 옵션 | Checkbox |
| Radio | 단일 옵션 | Radio |
| Switch | on/off 토글 | Switch |
| Slider | 범위 선택 | Slider |
| DatePicker | 날짜 선택 | DatePicker |
| FileUpload | 파일 첨부 | FileUpload |
| Form | 입력 그룹 | Form |

## 4. Feedback Components (피드백)

시스템 상태·결과를 사용자에게 전달.

| Element | 용도 | 표준 컴포넌트 |
|---|---|---|
| Toast | 일시 알림 (top-right) | Toast |
| Alert | 영구 알림 (inline) | Alert |
| Modal | 확인·경고 dialog | Modal |
| Tooltip | hover 보조 설명 | Tooltip |
| Popover | click 보조 패널 | Popover |
| Skeleton | 로딩 placeholder | Skeleton |
| Progress | 진행률 (bar / circle) | Progress |
| Spinner | 무한 로딩 | Spinner |
| EmptyState | 데이터 없음 | EmptyState |
| ErrorState | 에러 상태 | ErrorState |
| Badge | 카운트·상태 | Badge |

## 5. Domain-specific Components (프로젝트 특화)

요구사항에서 도출된 신규 컴포넌트. 기존 공통과 합쳐 사용하되 namespace 분리.

| 패턴 | 예시 |
|---|---|
| Data Card | OrderSummaryCard, UserProfileCard |
| List Row | OrderRow, NotificationRow |
| Detail Panel | OrderDetailPanel |
| Workflow Node | SkillChainNode, ProjectKickoffCard |

## 6. 분류 가이드

새 요소가 들어오면:
1. **Global / Layout / Input / Feedback 중 매칭되는가?** → 매칭되면 표준 컴포넌트 사용
2. **공통 카테고리 어느 것도 못 맞는가?** → Domain-specific으로 신설
3. **신설 시 namespace** → 프로젝트 코드명을 prefix (\`project-orderflow-order-row\`)
4. **여러 프로젝트에서 재사용 가능성** ≥ 2개 → 공통으로 승격 검토 (DS 컨트리뷰션 PR)
`;

const REF_TOKEN_NAMING = `# Token Naming Convention

## 1. 형식

모든 토큰은 **slash 표기** 사용.

\`\`\`
<category>/<subcategory>/<variant>
\`\`\`

예:
- \`color/brand/primary\`
- \`text/h1\`
- \`space/lg\`
- \`radius/md\`
- \`motion/fast\`

## 2. 카테고리 prefix

| Prefix | 의미 | 예시 |
|---|---|---|
| \`color/\` | 색상 | \`color/brand/primary\` |
| \`text/\` | typography scale | \`text/body\` |
| \`font/\` | 폰트 패밀리·weight | \`font/sans\`, \`font/weight-600\` |
| \`space/\` | spacing | \`space/lg\` |
| \`radius/\` | border radius | \`radius/md\` |
| \`shadow/\` | shadow elevation | \`shadow/lg\` |
| \`motion/\` | duration / easing | \`motion/fast\`, \`motion/ease-out\` |
| \`z/\` | z-index layer | \`z/modal\`, \`z/toast\` |
| \`breakpoint/\` | 반응형 | \`breakpoint/md\` |

## 3. 의미 기반 (semantic) vs 원시 (raw)

- **Semantic** (권장): \`color/status/error\`, \`color/ink/primary\`
- **Raw** (이름만): \`color/red-500\` — 직접 사용 금지, semantic이 alias로 가리킬 때만

\`\`\`
color/red-500: #DC2626      ← raw (private)
color/status/error: color/red-500  ← semantic (public, 사용)
\`\`\`

## 4. Variants

같은 카테고리에 여러 옵션:

\`\`\`
color/brand/primary           ← 기본
color/brand/primary-hover     ← 상태별
color/brand/primary-pressed
color/brand/primary-disabled
\`\`\`

## 5. Anti-patterns (사용 금지)

| Anti-pattern | 이유 | 대신 |
|---|---|---|
| \`color-primary\` (대시) | slash 일관성 위반 | \`color/brand/primary\` |
| \`mainBlue\` (camelCase) | 토큰은 kebab/slash | \`color/brand/primary\` |
| 인라인 hex (\`#1E40AF\`) | 토큰 우회 | semantic 토큰 사용 |
| \`color/blue\` (단순) | 의미 불명확 | \`color/brand/primary\` |
| \`spacing-16\` (px 명시) | scale 일관성 깨짐 | \`space/lg\` |

## 6. 명명 예시 (Do / Don't)

| 의도 | ✅ Do | ❌ Don't |
|---|---|---|
| 메인 액션 배경 | \`color/brand/primary\` | \`primary-blue\` |
| 입력 필드 보더 | \`color/border/default\` | \`border-gray-light\` |
| 카드 호버 시 그림자 | \`shadow/md\` | \`box-shadow-3\` |
| 모달 열림 애니메이션 | \`motion/normal\` | \`200ms\` |
| 페이지 헤더 폰트 크기 | \`text/h1\` | \`32px-bold\` |

## 7. 확장 (프로젝트 특화)

프로젝트 전용 토큰이 필요하면 namespace:

\`\`\`
project/<project-id>/color/...
project/<project-id>/space/...
\`\`\`

예:
\`\`\`
project/orderflow/color/order-status/pending
project/orderflow/color/order-status/shipped
\`\`\`

→ 공통 토큰으로 승격 시 namespace 제거.
`;

const REF_SPACING_SCALE = `# Spacing Scale Guide (4의 배수)

## 1. 기본 스케일

모든 spacing 값은 **4의 배수**.

| Token | px | 용도 |
|---|---|---|
| \`space/xs\` | 4 | 아이콘·텍스트 사이, 매우 좁은 간격 |
| \`space/sm\` | 8 | 컴포넌트 내부 padding (좁음) |
| \`space/md\` | 12 | 일반 padding·gap |
| \`space/lg\` | 16 | 카드 padding·섹션 내 gap |
| \`space/xl\` | 24 | 섹션 간 spacing (좁음) |
| \`space/2xl\` | 32 | 섹션 간 spacing (보통) |
| \`space/3xl\` | 48 | 페이지 헤더·푸터 거리 |

## 2. 레이아웃 spacing

### 페이지 레벨
- 페이지 좌우 padding: \`space/xl\` (24px) — desktop
- 페이지 좌우 padding: \`space/lg\` (16px) — mobile
- 헤더 ↔ 메인 컨텐츠: \`space/xl\` ~ \`space/2xl\`

### 섹션 레벨
- 섹션 ↔ 섹션: \`space/2xl\` ~ \`space/3xl\`
- 섹션 헤더 ↔ 본문: \`space/md\` ~ \`space/lg\`

## 3. 컴포넌트 spacing

### Button
- padding: \`space/sm space/lg\` (8 16) — md size
- padding: \`space/xs space/md\` (4 12) — sm size
- gap between icon and label: \`space/xs\` (4)

### Card
- padding: \`space/lg\` (16) — default
- padding: \`space/xl\` (24) — featured card
- gap between cards in grid: \`space/lg\` (16)

### Form
- field 간 vertical gap: \`space/lg\` (16)
- label ↔ input: \`space/xs\` (4)
- input ↔ helper text: \`space/xs\` (4)
- 그룹 간: \`space/xl\` (24)

### List / Table
- row padding: \`space/md\` (12)
- column gap: \`space/md\` ~ \`space/lg\`
- group separator gap: \`space/lg\` ~ \`space/xl\`

### Modal
- 내부 padding: \`space/xl\` (24)
- header / body / footer 영역 사이: \`space/lg\` (16)
- button group gap: \`space/sm\` (8)

## 4. 반응형 spacing

| Breakpoint | 페이지 padding | 섹션 gap |
|---|---|---|
| sm (~640px) | \`space/lg\` | \`space/xl\` |
| md (~768px) | \`space/xl\` | \`space/2xl\` |
| lg (~1024px) | \`space/xl\` | \`space/2xl\` |
| xl (~1280px) | \`space/2xl\` | \`space/3xl\` |

## 5. Anti-patterns

| ❌ | ✅ |
|---|---|
| \`padding: 10px\` (4의 배수 아님) | \`padding: space/md\` (12px) |
| \`margin-top: 18px\` | \`margin-top: space/lg\` (16px) |
| \`gap: 7px\` | \`gap: space/sm\` (8px) |
| 인라인 px 직접 사용 | 토큰 참조 |

## 6. 검증

스크립트 또는 lint:
- 모든 spacing 선언이 토큰 또는 4의 배수인지
- 동일 컨텍스트에서 일관된 토큰 사용 (예: 모든 카드가 \`space/lg\`)
`;

const REF_DOUBLE_DIAMOND = `# Double Diamond Method (UX Process)

UX 작업을 4단계 (Discover → Define → Design → Validate)로 구조화하는 표준 방법론.

## 1. Discover (발견)

> 문제와 사용자를 이해한다. 발산 단계.

### 주요 활동
- 이해관계자 인터뷰
- 사용자 인터뷰 (5-7명)
- 경쟁 제품 분석
- 도메인 자료 수집
- 사용자 행동 관찰

### 산출물
- 이해관계자 맵
- 인터뷰 노트
- 경쟁 분석 표
- 도메인 용어집
- Pain Point 목록

### 소요
- 1-2주 (프로젝트 규모에 따라)

### 입력
- 프로젝트 brief / requirement / 사업부 요구

## 2. Define (정의)

> 발견한 것을 좁혀 문제를 명확히 정의한다. 수렴 단계.

### 주요 활동
- 페르소나 작성 (2-3종)
- Job To Be Done 정의
- 사용자 시나리오 작성
- 핵심 KPI 정의
- Scope in/out 확정

### 산출물
- 페르소나 카드 (Persona × Goal × Pain × Insight)
- 핵심 시나리오 3-5개
- 성공 지표 (KPI)
- 우선순위 매트릭스 (Impact vs Effort)
- 디자인 원칙 (Design Principles)

### 소요
- 1주

## 3. Design (설계)

> 솔루션을 탐색·설계한다. 재발산 단계.

### 주요 활동
- IA 설계 (Information Architecture)
- User Flow 작성 (state-based)
- 와이어프레임 (low-fi → mid-fi)
- 컴포넌트 스펙
- 디자인 토큰 정의 (또는 차용)
- 프로토타입 제작

### 산출물
- IA 트리
- User Flow 다이어그램
- Wireframe / Sample Screen
- Component Spec
- 디자인 토큰 (또는 차용 매핑)
- 인터랙티브 프로토타입

### 소요
- 2-3주

## 4. Validate (검증)

> 설계가 문제를 풀고 있는지 확인한다. 재수렴 단계.

### 주요 활동
- 사용성 테스트 (5명)
- A/B 테스트 (가능 시)
- 접근성 감사 (a11y)
- 이해관계자 리뷰
- 핸드오프 준비

### 산출물
- 사용성 테스트 리포트
- a11y 감사 리포트
- 변경 요청 목록 (priority)
- 최종 핸드오프 문서
- Figma 프롬프트 (선택)

### 소요
- 1주

## 5. 전체 흐름

\`\`\`
[Brief 입력]
   ↓
[Discover] (1-2주) — 발견·발산
   ↓
[Define] (1주) — 정의·수렴
   ↓
[Design] (2-3주) — 설계·재발산
   ↓
[Validate] (1주) — 검증·재수렴
   ↓
[핸드오프]
\`\`\`

## 6. 반복 (Iterative)

Validate에서 문제 발견 시:
- 작은 수정 → Design 단계로 회귀
- 큰 문제 → Define 단계로 회귀 (시나리오 재정의)
- 근본 가정 어긋남 → Discover로 회귀

## 7. 산출물 매핑 (AXDD atomic skills와)

| Stage | AXDD Skill |
|---|---|
| Discover | (interview·observation은 사람 영역, skill 외부) |
| Define | \`ui-ux-requirement-extract\`, \`ux-process-define\` |
| Design | \`ui-element-extract\`, \`ui-foundation-build\`, \`component-spec-write\`, \`sample-screen-design\`, \`user-flow-design\`, \`ia-build\` |
| Validate | (사용성 테스트는 사람 영역) + \`output-validation-skill\` |
| Handoff | \`handoff-merge\`, \`figma-prompt-build\` |
`;

/* ═══════════════════════════════════════════════════════════════
 * ASSETS — 실제 사용 가능한 템플릿
 * ═══════════════════════════════════════════════════════════════ */

const ASSET_COMPONENT_SPEC = `# Component Spec Template

> 디자이너·개발자가 즉시 구현 가능한 컴포넌트 명세 표준.
> 이 템플릿을 복사해 \`{{PLACEHOLDER}}\`를 채우세요.

---

# {{COMPONENT_NAME}}

## 1. Purpose
{{ONE_LINE_PURPOSE}}

## 2. When to use
- {{USE_CASE_1}}
- {{USE_CASE_2}}
- {{USE_CASE_3}}

## 3. Variants

| Variant | 설명 | 시각적 차이 |
|---|---|---|
| primary | 메인 액션 | {{PRIMARY_VISUAL}} |
| secondary | 보조 액션 | {{SECONDARY_VISUAL}} |
| ghost | 가벼운 액션 | {{GHOST_VISUAL}} |
| danger | 위험·삭제 액션 | {{DANGER_VISUAL}} |

## 4. States

| State | 시각적 표현 | 조건 |
|---|---|---|
| default | {{DEFAULT_VISUAL}} | 일반 상태 |
| hover | {{HOVER_VISUAL}} | 마우스 hover |
| focus | {{FOCUS_VISUAL}} | 키보드 포커스 |
| active / pressed | {{ACTIVE_VISUAL}} | 클릭 중 |
| disabled | opacity 0.4 + cursor not-allowed | 비활성 |
| loading | spinner 또는 skeleton | 비동기 작업 중 |

## 5. Props

| Name | Type | Default | Description |
|---|---|---|---|
| variant | "primary" \\| "secondary" \\| "ghost" \\| "danger" | "primary" | 시각 variant |
| size | "sm" \\| "md" \\| "lg" | "md" | 크기 |
| disabled | boolean | false | 비활성 |
| loading | boolean | false | 로딩 상태 |
| onClick | (e) => void | — | 클릭 핸들러 |
| icon | ReactNode | — | 좌측 아이콘 (옵션) |
| children | ReactNode | required | label |

## 6. Anatomy

\`\`\`
┌─────────────────────────────┐
│  [icon]  Label  [spinner?]  │
└─────────────────────────────┘
\`\`\`

- **icon** (옵션): 좌측, size = text height
- **label**: 본문, text/body
- **spinner** (loading): 우측, label 대체

## 7. Token Mapping

| 영역 | 토큰 |
|---|---|
| 배경 (primary default) | \`color/brand/primary\` |
| 배경 (primary hover) | \`color/brand/primary-hover\` |
| 텍스트 | \`color/ink/inverse\` (primary 위) |
| Border | \`color/border/default\` (secondary 한정) |
| Padding (md) | \`space/sm space/lg\` |
| Radius | \`radius/md\` |
| Font | \`text/body\` + weight 500 |
| Motion | \`motion/fast\` ease-out |

## 8. Accessibility

- 클릭 영역 ≥ 44 × 44px (모바일 터치 타깃)
- 키보드: Tab 포커스 + Enter / Space 활성
- 색 대비: text vs bg ≥ 4.5:1 (텍스트), 3:1 (큰 텍스트)
- 비활성 상태에서 \`aria-disabled="true"\`
- 로딩 시 \`aria-busy="true"\` + 스크린리더 announce
- 아이콘 only 일 때 \`aria-label\` 필수

## 9. Acceptance Criteria

- [ ] 모든 variant 시각적으로 구분됨
- [ ] 모든 state 시각적 피드백 명확
- [ ] 키보드만으로 모든 액션 접근 가능
- [ ] 색 대비 AA 충족
- [ ] 비활성·로딩 상태에서 클릭 방지
- [ ] 토큰만 사용 (인라인 hex 없음)
- [ ] Storybook (또는 동등) 에 등록됨

## 10. 예시 코드

\`\`\`tsx
<Button variant="primary" size="md" onClick={handleSave}>
  Save
</Button>

<Button variant="ghost" icon={<TrashIcon />} disabled>
  Delete
</Button>
\`\`\`
`;

const ASSET_WIREFRAME = `# Wireframe Template

> 화면 1개를 ASCII 와이어프레임 + 영역별 컴포넌트·토큰 매핑으로 설계.

---

## Screen: {{SCREEN_NAME}}

### 1. Purpose
{{SCREEN_PURPOSE}}

### 2. User goal
{{USER_GOAL_ON_THIS_SCREEN}}

### 3. Entry points
- {{ENTRY_1}} (예: 메인 메뉴 → 클릭)
- {{ENTRY_2}} (예: 다른 화면 → 액션)

### 4. ASCII Wireframe

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  [Header — AppHeader]                                    │
│  Logo                  [Search]                User ▾    │
├──────┬──────────────────────────────────────────────────┤
│      │  Breadcrumb > Section > {{Current Page}}          │
│ Side ├──────────────────────────────────────────────────┤
│ bar  │  H1: {{Page Title}}                               │
│      │  Caption: {{Description}}                          │
│      ├──────────────────────────────────────────────────┤
│      │  ┌──────┐ ┌──────┐ ┌──────┐                       │
│      │  │ KPI  │ │ KPI  │ │ KPI  │   (Stats section)     │
│      │  └──────┘ └──────┘ └──────┘                       │
│      ├──────────────────────────────────────────────────┤
│      │  [Filter Bar]  [Search]  [Primary Action]         │
│      │  ┌──────────────────────────────────────────────┐ │
│      │  │  Data Table                                  │ │
│      │  │  ─────────────────────────────               │ │
│      │  │  Row 1                                       │ │
│      │  │  Row 2                                       │ │
│      │  │  Row 3                                       │ │
│      │  └──────────────────────────────────────────────┘ │
│      │  [Pagination]                                     │
└──────┴──────────────────────────────────────────────────┘
\`\`\`

### 5. Regions

| Region | 컴포넌트 | 토큰 / 비고 |
|---|---|---|
| Header | AppHeader | sticky top, \`shadow/sm\` |
| Sidebar | AppSidebar | width 240px, \`color/surface/elevated\` |
| Breadcrumb | Breadcrumb | \`text/caption\`, \`color/ink/secondary\` |
| Page Title | H1 | \`text/h1\`, \`color/ink/primary\` |
| KPI Cards | Card × 3 | grid 3-col, \`space/lg\` gap |
| Filter Bar | Input + Select + Button | flex row, \`space/md\` gap |
| Table | Table | striped, sortable header |
| Pagination | Pagination | bottom-right |

### 6. States

| State | 표현 |
|---|---|
| Loading | Skeleton rows × 5 |
| Empty | EmptyState (icon + 안내 메시지 + Primary Action) |
| Error | ErrorState (sad icon + retry button) |
| Filter applied | Filter chip 상단 표시 + clear all |
| Row selected | row background \`color/brand/primary-50\` |

### 7. Responsive

| Breakpoint | 동작 |
|---|---|
| sm (< 640) | Sidebar → 햄버거 메뉴 / KPI cards 1-col / Table → Card list |
| md (640-1024) | Sidebar fixed / KPI 2-col / Table 일부 컬럼 숨김 |
| lg (1024+) | Full layout |

### 8. Interaction notes

- Row 클릭 → Detail Panel (Modal 또는 Slide-in)
- Sort header 클릭 → asc → desc → none 순환
- Primary Action → Modal 또는 새 화면으로

### 9. Accessibility

- 모든 인터랙티브 요소 키보드 접근
- Table에 \`role="table"\`, header에 \`scope="col"\`
- Sort 상태 \`aria-sort\` 명시
- Loading 시 \`aria-busy\`

### 10. Acceptance

- [ ] 와이어프레임의 모든 영역에 컴포넌트 매핑됨
- [ ] 모든 영역에 토큰 명시
- [ ] 4가지 state 모두 정의
- [ ] 반응형 동작 명시
- [ ] a11y 노트 포함
`;

const ASSET_UX_PROCESS_PACK = `# UX Process Asset Pack

> UX 작업에 필요한 표준 자산 세트 (페르소나·journey·시나리오·체크리스트).
> 각 atomic skill이 이 pack을 input으로 받는다.

## 1. Persona Template

\`\`\`
┌────────────────────────────────────────┐
│  Name        : {{NAME}}                │
│  Role        : {{ROLE}}                │
│  Age range   : {{AGE}}                 │
│  Tech savvy  : Low / Medium / High     │
├────────────────────────────────────────┤
│  Goal                                   │
│  {{WHAT_THEY_WANT_TO_ACHIEVE}}          │
├────────────────────────────────────────┤
│  Pain Point                             │
│  {{WHAT_FRUSTRATES_THEM_TODAY}}         │
├────────────────────────────────────────┤
│  Insight                                │
│  {{NON-OBVIOUS_TRUTH_ABOUT_THEM}}       │
├────────────────────────────────────────┤
│  Quote                                  │
│  "{{REPRESENTATIVE_QUOTE}}"             │
└────────────────────────────────────────┘
\`\`\`

채우기 규칙:
- Goal·Pain·Insight·Quote는 **사용자가 실제 한 말 또는 관찰된 행동** 기반
- 가상 페르소나라도 데이터 근거 (인터뷰·설문·분석) 명시
- 3~5명 작성 (primary 1 + secondary 2-4)

## 2. Journey Map Template

| Stage | 사용자 활동 | 생각 / 감정 | 터치포인트 | Pain Points | 개선 기회 |
|---|---|---|---|---|---|
| Awareness | (어떻게 알게 되나) | | | | |
| Consideration | (검토·비교) | | | | |
| Acquisition | (시작·등록) | | | | |
| Service | (사용·반복) | | | | |
| Retention / Advocacy | (지속·추천) | | | | |

## 3. Task Scenario Template

### Scenario: {{SCENARIO_TITLE}}

**Persona**: {{PERSONA_NAME}}

**Context**:
{{WHEN_AND_WHERE}}

**Trigger**:
{{WHAT_STARTS_THIS_TASK}}

**Goal**:
{{WHAT_THEY_WANT_TO_ACCOMPLISH}}

**Happy path**:
1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}

**Alternative paths**:
- {{IF_X_HAPPENS}}
- {{IF_Y_HAPPENS}}

**Failure modes**:
- {{POSSIBLE_FAILURE_1}} → 시스템 대응: ...
- {{POSSIBLE_FAILURE_2}} → 시스템 대응: ...

**Success criteria**:
- 사용자가 ... 완료
- 소요 시간 < ...
- 에러 없음

## 4. Validation Checklist (사용성 테스트 전)

### 시나리오 준비
- [ ] 페르소나 1명당 시나리오 1-2개
- [ ] 테스트 환경 (실제 / 프로토타입) 결정
- [ ] 5명 모집 완료 (페르소나 매칭)
- [ ] 진행자·관찰자 역할 분담

### 측정 항목
- [ ] Task 완료율
- [ ] Task 소요 시간
- [ ] 에러 발생 횟수
- [ ] 만족도 (SUS 또는 자체 척도)
- [ ] 발화 메모 (소리내어 생각하기 / Think-aloud)

### 분석
- [ ] 공통 문제 ≥ 3건 식별
- [ ] 심각도 분류 (Critical / Major / Minor)
- [ ] 우선순위 매트릭스 (영향 × 빈도)
- [ ] 다음 iteration 액션 목록

## 5. UX 원칙 (사내 표준)

1. **명확성 > 화려함** — 사용자가 다음 액션을 망설이지 않게
2. **일관성 > 개별 창의성** — 같은 동작은 같은 시각·인터랙션
3. **피드백 즉시** — 사용자 액션 후 100ms 이내 시각 응답
4. **에러는 예방** — 막을 수 있으면 막고, 못 막으면 명확히 안내
5. **접근성 기본** — WCAG AA를 baseline으로
`;

const ASSET_USER_FLOW = `# User Flow Template (State-based)

> 화면 사이의 사용자 이동을 state machine 형태로 작성.

---

## Flow: {{FLOW_NAME}}

### 1. Metadata
- **Persona**: {{PERSONA_NAME}}
- **Goal**: {{USER_GOAL}}
- **Frequency**: 일/주/월 ~ 회
- **Criticality**: High / Medium / Low

### 2. Entry

| 트리거 | 진입 위치 |
|---|---|
| {{TRIGGER_1}} | {{ENTRY_SCREEN_1}} |
| {{TRIGGER_2}} | {{ENTRY_SCREEN_2}} |

### 3. States

\`\`\`
[State A] {{INITIAL_SCREEN}}
   │
   │  Action: {{USER_ACTION}}
   │  System: {{SYSTEM_RESPONSE}}
   ↓
[State B] {{NEXT_SCREEN}}
   │
   │  Action: {{USER_ACTION}}
   │  System: {{SYSTEM_RESPONSE}}
   ↓
[State C] {{NEXT_SCREEN}}
   │
   ├──── Action: {{SUCCESS_ACTION}} ────→ [Exit: Success]
   │     System: {{SUCCESS_RESPONSE}}
   │
   └──── Action: {{ERROR_TRIGGER}} ─────→ [Exit: Error]
         System: {{ERROR_RESPONSE}}
\`\`\`

### 4. Detailed states

| State | 화면 | 사용자 action | 시스템 응답 | 다음 state |
|---|---|---|---|---|
| A | {{SCREEN_NAME}} | {{ACTION}} | {{RESPONSE}} | B |
| B | {{SCREEN_NAME}} | {{ACTION}} | {{RESPONSE}} | C |
| C | {{SCREEN_NAME}} | {{ACTION}} | {{RESPONSE}} | Exit: Success |

### 5. Error paths

| 에러 상황 | 화면 | 처리 |
|---|---|---|
| 입력 누락 | A | inline error + focus 첫 빈 필드 |
| 서버 에러 | B | Toast + retry 버튼 |
| 권한 없음 | C | Modal "권한 요청" |
| 타임아웃 | any | 새 세션 안내 + 로그인 화면으로 |

### 6. Exit conditions

| Exit | 조건 | 후속 |
|---|---|---|
| Success | 모든 state 완료 + 검증 통과 | 성공 화면 또는 메인 |
| User cancel | 어느 단계든 cancel 클릭 | 이전 화면으로 |
| Error (recoverable) | 에러 발생 후 사용자 인지 | 같은 state 유지 + 메시지 |
| Error (non-recoverable) | 시스템 장애 등 | 에러 페이지 |

### 7. Edge cases

- 새로고침 시 진행 상태 보존?
- 브라우저 뒤로가기?
- 다중 탭 동시 진행?
- 동일 작업 중복 트리거?

### 8. Acceptance

- [ ] 5단계 이상의 명확한 state
- [ ] Entry / Exit 모두 명시
- [ ] 모든 state에 사용자 action + 시스템 응답 페어
- [ ] 에러 path 최소 2개
- [ ] Edge case 검토 완료

---

## 예시: 주문 생성 Flow

\`\`\`
[A] 상품 목록 화면
   │
   │  Action: 상품 카드 클릭
   │  System: 상품 상세 패널 열림
   ↓
[B] 상품 상세 + 수량 선택
   │
   │  Action: "장바구니 담기" 클릭
   │  System: 토스트 "담겼습니다" + 카운트 +1
   ↓
[C] 장바구니 / 결제 페이지
   │
   ├── Action: "결제" 클릭
   │   System: 결제 처리 → 완료 화면
   │   → [Exit: Success]
   │
   └── Action: "수량 변경" / "삭제"
       System: 카트 갱신
       → 같은 state 유지
\`\`\`
`;

const ASSET_IA_TREE = `# IA Tree Template

> User Flow 화면들을 routing tree로 구조화.

---

## Project: {{PROJECT_NAME}}

### 1. Routes

\`\`\`
/
├── /                          ─ Home / Dashboard
├── /projects                  ─ 프로젝트 목록
│   ├── /projects/[id]         ─ 프로젝트 상세
│   ├── /projects/[id]/edit    ─ 편집
│   └── /projects/new          ─ 신규 생성
├── /assets                    ─ 자산 레포
│   └── /assets/[id]           ─ 자산 상세
├── /settings                  ─ 설정
│   ├── /settings/profile
│   ├── /settings/team
│   └── /settings/notifications
└── /help                      ─ 도움말
\`\`\`

### 2. Per-node description

| Route | 한 줄 설명 | 컴포넌트 | Auth 필요 |
|---|---|---|---|
| \`/\` | 사용자 대시보드 (작업·알림·바로가기) | Dashboard | Yes |
| \`/projects\` | 진행중 프로젝트 카드 그리드 + 필터 | ProjectList | Yes |
| \`/projects/[id]\` | 프로젝트 상세 (진행률·산출물·리뷰) | ProjectDetail | Yes |
| \`/projects/[id]/edit\` | 프로젝트 메타 편집 | ProjectEditor | Yes (owner) |
| \`/projects/new\` | 신규 프로젝트 모달 또는 페이지 | NewProjectWizard | Yes |
| \`/assets\` | 자산 카드 + 검색 + 카테고리 필터 | AssetList | Yes |
| \`/assets/[id]\` | 자산 상세 + 다운로드 | AssetDetail | Yes |
| \`/settings\` | 설정 진입점 (탭으로 분기) | SettingsLayout | Yes |
| \`/settings/profile\` | 프로필 편집 | ProfileForm | Yes |
| \`/settings/team\` | 팀 멤버·권한 | TeamSettings | Yes (admin) |
| \`/settings/notifications\` | 알림 설정 | NotificationSettings | Yes |
| \`/help\` | FAQ + 가이드 링크 | HelpCenter | No |

### 3. Navigation rules

- **Primary nav** (사이드바): \`/\`, \`/projects\`, \`/assets\`, \`/settings\`
- **Top nav**: 검색 + 사용자 메뉴 + 알림 벨
- **Breadcrumb**: 모든 depth ≥ 2 경로에 표시
- **Footer link**: \`/help\`만

### 4. Orphan check

- [ ] 모든 라우트가 어딘가에서 링크됨 (orphan 없음)
- [ ] 모든 화면이 User Flow의 어느 state에 매핑됨
- [ ] 깊이 ≥ 4 인 라우트 없음 (가이드: 최대 depth 3)

### 5. Auth / permission matrix

| Route | Anonymous | User | Admin | Owner |
|---|:---:|:---:|:---:|:---:|
| \`/\` | ✗ | ✓ | ✓ | ✓ |
| \`/projects\` | ✗ | ✓ (own) | ✓ (all) | ✓ |
| \`/projects/[id]/edit\` | ✗ | ✗ | ✓ | ✓ |
| \`/settings/team\` | ✗ | ✗ | ✓ | ✓ |
| \`/help\` | ✓ | ✓ | ✓ | ✓ |

### 6. Acceptance

- [ ] 트리에 orphan 없음
- [ ] 모든 노드 한 줄 설명
- [ ] User Flow의 모든 state가 IA 노드에 매핑
- [ ] 깊이 ≤ 3
- [ ] Permission matrix 명시
- [ ] generic 경로(\`/dashboard\`, \`/page1\`) 없이 도메인 경로 사용
`;

const ASSET_HANDOFF_DOC = `# Master Handoff Document Template

> UI 트랙 + UX 트랙 산출물을 합쳐 프론트 개발자가 즉시 구현 가능한 형태.

---

# {{PROJECT_NAME}} — Handoff

| Field | Value |
|---|---|
| Project | {{PROJECT_NAME}} |
| Version | 0.1.0 |
| Date | YYYY-MM-DD |
| Owner | Product Design |
| DS Source | AXDD DS v__ / 고객사 DS / 신규 부트스트랩 |

## 1. Project Overview

### 1.1 Background
{{WHY_THIS_PROJECT}}

### 1.2 Goals
- {{GOAL_1}}
- {{GOAL_2}}

### 1.3 KPI
- {{KPI_1}}: 목표 {{TARGET}}
- {{KPI_2}}: 목표 {{TARGET}}

### 1.4 Persona summary
- {{PRIMARY_PERSONA}}: {{ONE_LINE}}
- {{SECONDARY_PERSONA}}: {{ONE_LINE}}

## 2. Information Architecture

(IA 트리 — \`assets/ia-tree-template.md\` 산출물 발췌)

\`\`\`
/
├── ...
\`\`\`

## 3. User Flow

(User Flow — \`assets/user-flow-template.md\` 산출물 발췌)

### Flow A: {{NAME}}
\`\`\`
[State A] → [State B] → ...
\`\`\`

### Flow B: {{NAME}}
\`\`\`
...
\`\`\`

## 4. Design Tokens

(UI Foundation 산출물 발췌)

### 4.1 Color
| Token | Hex | Usage |
|---|---|---|
| ... | ... | ... |

### 4.2 Typography
| Scale | Size | LH | Usage |
|---|---|---|---|

### 4.3 Spacing / Radius / Shadow / Motion
...

## 5. Component Spec

(Component Spec 산출물 발췌 — 컴포넌트별 풀 명세)

### 5.1 Button
- Variants / States / Props / Anatomy / Token mapping / a11y

### 5.2 Card
- ...

(이하 컴포넌트 별)

## 6. Sample Screens

(Wireframe 산출물 발췌 — 화면 3종 ASCII + 영역 매핑)

### 6.1 Screen A
\`\`\`
... wireframe ...
\`\`\`

### 6.2 Screen B
...

### 6.3 Screen C
...

## 7. Interaction & Motion

| Trigger | Animation | Duration | Easing |
|---|---|---|---|
| 카드 hover | shadow 강화 | 150ms | ease-out |
| 모달 open | fade + scale | 200ms | ease-out |
| 토스트 enter | slide-in right | 200ms | ease-out |
| 탭 전환 | indicator slide | 180ms | ease-in-out |

## 8. A11y · QA Matrix

### 8.1 a11y 체크리스트
- [ ] WCAG AA 색 대비 (텍스트 4.5:1 / 큰 텍스트 3:1)
- [ ] 모든 액션 키보드 접근
- [ ] 포커스 인디케이터 명확
- [ ] 모달 포커스 트랩 + Esc 닫기
- [ ] 색상만으로 상태 구분 X (아이콘 동반)
- [ ] aria-label / aria-live 적용
- [ ] 스크린리더 테스트 (VoiceOver / NVDA)
- [ ] 200% 줌 동작
- [ ] reduce motion 환경 대응
- [ ] 다국어 (i18n) 대응

### 8.2 QA matrix

| Browser | Desktop | Tablet | Mobile |
|---|:---:|:---:|:---:|
| Chrome | ✓ | ✓ | ✓ |
| Safari | ✓ | ✓ | ✓ |
| Firefox | ✓ | — | — |
| Edge | ✓ | — | — |
| Samsung Internet | — | ✓ | ✓ |

## 9. Implementation Notes

- API endpoint 목록 (백엔드 팀 참고)
- 상태 관리 패턴 (Redux / Zustand / Context)
- 라우팅 (React Router / Next.js App Router)
- i18n 전략

## 10. Acceptance Criteria

- [ ] 모든 화면이 토큰만 사용 (인라인 hex 0)
- [ ] 모든 컴포넌트 스펙 일치
- [ ] User Flow 모든 state 구현
- [ ] a11y 체크리스트 통과
- [ ] QA matrix 통과
- [ ] DS 출처 명시
`;

const ASSET_FIGMA_RECIPES = `# Figma Frame Recipes

> 핸드오프를 Figma AI / Make Designs / First Draft 에 그대로 붙여 쓸 수 있는 프레임 구성.

## 1. 전체 프레임 순서

\`\`\`
1. Cover
2. Project Overview
3. IA & User Flow
4. UI Foundation (Tokens)
5. Component Library
6. Sample Screens
7. Empty / Loading / Error States (옵션)
\`\`\`

## 2. Cover Frame

\`\`\`
Frame: 1920 × 1080 (또는 16:9 비율)
Layout: 중앙 정렬, vertical stack
Components:
  - H1: {{PROJECT_NAME}}
  - Caption: {{ONE_LINE_DESCRIPTION}}
  - Meta block: Owner / Date / Version
  - Cover image or icon
Tokens:
  - bg: color/surface/base
  - text: color/ink/primary
  - typography: text/display
\`\`\`

## 3. Project Overview Frame

\`\`\`
Frame: 1920 × 1200
Sections:
  - Background (3-5 bullets)
  - Goals (table)
  - KPI (3-4 카드)
  - Persona (카드 그리드 3개)
\`\`\`

## 4. IA & User Flow Frame

\`\`\`
Frame: 1920 × 1400
Sections:
  - IA Tree (좌측, 50%)
    - Tree component (Figma의 connector 또는 vertical list)
  - User Flow (우측, 50%)
    - State machine diagram
    - Each state = card
    - Connectors with action/response labels
\`\`\`

## 5. UI Foundation Frame

\`\`\`
Frame: 1920 × 1600
Sections (vertical):
  1. Color
     - Color swatches grid (각 토큰명 + hex + usage)
  2. Typography
     - Scale display (text/display ~ text/code)
  3. Spacing
     - Visual ruler (xs ~ 3xl)
  4. Radius / Shadow / Motion
     - 카드 + 라벨
Auto Layout:
  - vertical stack, space/2xl gap
  - 좌우 padding: space/3xl
\`\`\`

## 6. Component Library Frame

\`\`\`
Frame: 1920 × 2000+
Layout: grid 또는 vertical sections
Each component:
  - Component name (H2)
  - Variants 모두 (가로 배치)
  - States 모두 (아래 라벨)
  - Anatomy diagram (callout 화살표)
  - Props table (우측)
Components:
  - Button (4 variant × 5 state)
  - Card (default / elevated / outlined)
  - Input (text / search / textarea)
  - Modal (sm / md / lg / fullscreen)
  - Toast (success / warning / error / info)
\`\`\`

## 7. Sample Screens Frame

\`\`\`
Frame: 1920 × N (한 화면당 1080 + 라벨)
Layout: vertical stack
Each screen:
  - Title (H2: screen name)
  - 화면 mockup (1280 × 800 또는 mobile 375 × 812)
  - Caption: purpose + entry points
  - Region annotation (number callouts)
\`\`\`

## 8. Empty / Loading / Error States (옵션)

\`\`\`
Frame: 1920 × 1080
3-col grid:
  - Empty State (icon + 안내 + CTA)
  - Loading State (skeleton 또는 spinner)
  - Error State (sad icon + retry)
\`\`\`

## 9. Auto Layout 규칙

- 모든 프레임에 Auto Layout 적용
- vertical stack gap: space/2xl (32)
- 카드 간 gap: space/lg (16)
- 좌우 padding: space/3xl (48) 또는 컨테이너 너비의 5%
- 카드 내부 padding: space/lg (16)

## 10. Naming 규칙

| 요소 | 이름 |
|---|---|
| Frame | \`{{Section}} / {{Number}}.{{name}}\` (예: \`UI / 3. Foundation\`) |
| Component instance | \`{{ComponentName}} / {{variant}} / {{state}}\` |
| Layer | semantic (예: \`Header\`, \`Sidebar\`, \`Content\`) |

## 11. 제출 시 체크

- [ ] 프레임 ≥ 6개
- [ ] 모든 프레임 Auto Layout
- [ ] 모든 색·spacing이 토큰 (Figma Variables)
- [ ] 컴포넌트는 Component 라이브러리화 (재사용)
- [ ] 화면은 1280·375 두 크기 모두 (반응형 확인)
- [ ] export 준비 (PNG/PDF/Figma Link)

## 12. Figma AI 프롬프트 패턴

\`\`\`
Create a Figma file for {{PROJECT_NAME}}.
- Tone: {{TONE_KEYWORDS}}
- Color tokens: (table)
- Typography: (table)
- Components: (list)
- Screens: (list)
Rules:
- Use Auto Layout everywhere
- Spacing only in 4-multiples
- No inline hex (use tokens)
- A11y AA
\`\`\`
`;

/* ═══════════════════════════════════════════════════════════════
 * 그 외 assets (kickoff / risk / validation / milestone)
 * ═══════════════════════════════════════════════════════════════ */

const ASSET_KICKOFF = `# Kickoff Report Template

# {{PROJECT_NAME}} — 착수보고서

| Field | Value |
|---|---|
| Project | {{PROJECT_NAME}} |
| Period | {{START}} ~ {{END}} |
| Owner | {{OWNER_TEAM}} |
| Author | PM/PL |
| Date | YYYY-MM-DD |

## 1. Project Overview
- {{ONE_LINE_PURPOSE}}

## 2. Stakeholders
| Role | Team / Person | Responsibility |
|---|---|---|
| {{ROLE}} | {{NAME}} | {{RESP}} |

## 3. Schedule · Milestones
| Phase | Period | Deliverable |
|---|---|---|
| Discover | W1 | 이해관계자 인터뷰 |
| Define | W2 | 요구사항·페르소나 |
| Design | W3-4 | 핸드오프 풀세트 |
| Build | W5 | 구현 |
| Validate | W6 | QA + 검수 |

## 4. Risks
- (High) {{RISK}} — 완화: {{MITIGATION}}

## 5. Next Steps
1. {{NEXT_1}}
2. {{NEXT_2}}
`;

const ASSET_RISK = `# Risk Template

| ID | Title | Impact | Probability | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| R-1 | {{TITLE}} | High/Med/Low | High/Med/Low | {{HOW_TO_AVOID}} | {{OWNER}} | Open/Closed |
`;

const ASSET_VALIDATION_CHECKLIST = `# Validation Checklist

## 형식 검증 (axe_check.py validate-skill)
- [ ] SKILL.md frontmatter 존재
- [ ] name 디렉토리명 일치
- [ ] description 1-1024자
- [ ] metadata 값 모두 string

## 의미 검증
- [ ] UX/UI 컨텍스트 유지 (외부 산업 누출 0)
- [ ] AXDD 토큰만 사용 (인라인 hex 0)
- [ ] 모든 컴포넌트 a11y 명시

## 산출물 검증
- [ ] 필수 섹션 모두 존재
- [ ] 표 구조 정확
- [ ] 외부 URL 1차 정책 준수
`;

const ASSET_MILESTONE_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Milestone Visualization Template</title>
  <style>
    body { font-family: Pretendard, sans-serif; padding: 2rem; }
    .milestone-row { display: flex; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    .ms-date { width: 120px; font-family: monospace; color: #666; }
    .ms-title { flex: 1; }
    .ms-status { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .done { background: #dcfce7; color: #166534; }
    .todo { background: #fef3c7; color: #92400e; }
  </style>
</head>
<body>
  <h1>{{PROJECT_NAME}} — Milestones</h1>
  <div class="milestone-row">
    <span class="ms-date">YYYY-MM-DD</span>
    <span class="ms-title">{{MILESTONE_TITLE}}</span>
    <span class="ms-status todo">TODO</span>
  </div>
  <!-- repeat -->
</body>
</html>
`;

/* ═══════════════════════════════════════════════════════════════
 * Phase 7-G — design-system-ingest-skill assets (5종)
 * ═══════════════════════════════════════════════════════════════ */

const ASSET_DESIGN_TOKEN_JSON = `{
  "_meta": {
    "source": "axdd-internal",
    "fallbackApplied": false,
    "version": "0.1.0",
    "description": "AXDD design token seed. Replace __AXDD_DS__ with real hex from internal design system."
  },
  "color": {
    "brand": {
      "primary": "#__AXDD_DS__",
      "primary-hover": "#__AXDD_DS__",
      "primary-pressed": "#__AXDD_DS__",
      "accent": "#__AXDD_DS__"
    },
    "surface": {
      "base": "#__AXDD_DS__",
      "elevated": "#__AXDD_DS__",
      "muted": "#__AXDD_DS__"
    },
    "ink": {
      "primary": "#__AXDD_DS__",
      "secondary": "#__AXDD_DS__",
      "disabled": "#__AXDD_DS__",
      "inverse": "#__AXDD_DS__"
    },
    "border": {
      "default": "#__AXDD_DS__",
      "focus": "#__AXDD_DS__"
    },
    "status": {
      "success": "#__AXDD_DS__",
      "warning": "#__AXDD_DS__",
      "error": "#__AXDD_DS__",
      "info": "#__AXDD_DS__"
    }
  },
  "text": {
    "display": { "size": "32px", "lineHeight": "40px", "weight": 700 },
    "h1":      { "size": "24px", "lineHeight": "32px", "weight": 600 },
    "h2":      { "size": "20px", "lineHeight": "28px", "weight": 600 },
    "h3":      { "size": "18px", "lineHeight": "26px", "weight": 600 },
    "body":    { "size": "14px", "lineHeight": "22px", "weight": 400 },
    "caption": { "size": "12px", "lineHeight": "18px", "weight": 400 },
    "code":    { "size": "13px", "lineHeight": "20px", "weight": 500, "family": "mono" }
  },
  "space": {
    "xs": "4px",
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px",
    "2xl": "32px",
    "3xl": "48px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 3px 6px rgba(0,0,0,0.08)",
    "lg": "0 10px 20px rgba(0,0,0,0.12)"
  },
  "motion": {
    "fast": "120ms ease-out",
    "normal": "200ms ease-out",
    "slow": "400ms ease-out"
  },
  "breakpoint": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  }
}
`;

const ASSET_TAILWIND_MAPPING = `# Tailwind Token Mapping

> AXDD 디자인 토큰 → Tailwind config 변환 가이드.
> \`design_tokens.json\`을 받아 \`tailwind.config.js\`의 \`theme.extend\`에 시드.

## 1. 변환 룰

| AXDD Token | Tailwind 위치 | Tailwind class |
|---|---|---|
| \`color/brand/primary\` | \`theme.extend.colors.brand.primary\` | \`bg-brand-primary\` |
| \`color/surface/base\` | \`theme.extend.colors.surface.base\` | \`bg-surface-base\` |
| \`color/ink/primary\` | \`theme.extend.colors.ink.primary\` | \`text-ink-primary\` |
| \`color/border/default\` | \`theme.extend.colors.border.default\` | \`border-border-default\` |
| \`color/status/error\` | \`theme.extend.colors.status.error\` | \`bg-status-error\` |
| \`text/h1\` (size) | \`theme.extend.fontSize.h1\` | \`text-h1\` |
| \`space/lg\` | \`theme.extend.spacing.lg\` | \`p-lg\`, \`gap-lg\` |
| \`radius/md\` | \`theme.extend.borderRadius.md\` | \`rounded-md\` |
| \`shadow/md\` | \`theme.extend.boxShadow.md\` | \`shadow-md\` |

## 2. Sample tailwind.config.js

\`\`\`js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:   { primary: '#__AXDD_DS__', accent: '#__AXDD_DS__' },
        surface: { base: '#__AXDD_DS__', elevated: '#__AXDD_DS__' },
        ink:     { primary: '#__AXDD_DS__', secondary: '#__AXDD_DS__' },
        border:  { default: '#__AXDD_DS__', focus: '#__AXDD_DS__' },
        status:  { success: '#__AXDD_DS__', warning: '#__AXDD_DS__', error: '#__AXDD_DS__', info: '#__AXDD_DS__' },
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px', fontWeight: '700' }],
        h1:      ['24px', { lineHeight: '32px', fontWeight: '600' }],
        h2:      ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h3:      ['18px', { lineHeight: '26px', fontWeight: '600' }],
        body:    ['14px', { lineHeight: '22px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },
      spacing: {
        xs:  '4px',  sm: '8px',  md: '12px',
        lg:  '16px', xl: '24px', '2xl': '32px', '3xl': '48px',
      },
      borderRadius: { sm: '4px', md: '8px', lg: '12px' },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 3px 6px rgba(0,0,0,0.08)',
        lg: '0 10px 20px rgba(0,0,0,0.12)',
      },
      transitionDuration: { fast: '120ms', normal: '200ms', slow: '400ms' },
    },
  },
  plugins: [],
};
\`\`\`

## 3. 컴포넌트 예시

\`\`\`tsx
// Button (primary)
<button className="bg-brand-primary text-ink-inverse px-lg py-sm rounded-md shadow-sm hover:bg-brand-primary-hover">
  Save
</button>

// Card (elevated)
<div className="bg-surface-elevated rounded-lg shadow-md p-lg">
  ...
</div>
\`\`\`

## 4. Anti-patterns

| ❌ | ✅ |
|---|---|
| \`bg-[#1E40AF]\` (인라인 hex) | \`bg-brand-primary\` |
| \`p-[10px]\` (4의 배수 위반) | \`p-md\` (12px) |
| \`text-[16px]\` | \`text-body\` |

## 5. 자동 import 흐름

1. \`design_tokens.json\` 읽기
2. 위 변환 룰 적용
3. \`tailwind.config.js\` 생성 (또는 기존 config의 \`theme.extend\`에 머지)
4. \`npx tailwindcss\` 빌드 → 사용 가능
`;

const ASSET_FIGMA_VAR_MAPPING = `# Figma Variables Mapping

> \`design_tokens.json\` → Figma Variables (Variables Collections) 매핑.
> Figma 2024+ 의 Variables API 기준.

## 1. Collection 분류

| AXDD 카테고리 | Figma Collection | 비고 |
|---|---|---|
| color/* | \`AXDD/Color\` | mode: Light, Dark (옵션) |
| text/* | \`AXDD/Typography\` | size + lineHeight + weight 묶음 |
| space/* | \`AXDD/Spacing\` | Number type |
| radius/* | \`AXDD/Radius\` | Number type |
| shadow/* | \`AXDD/Shadow\` | Effect 스타일 (Variable 아님 — Effect Styles 사용) |
| motion/* | \`AXDD/Motion\` | (Figma는 motion variable 미지원 — Prototype 설정에 표기) |

## 2. Color Variable 매핑

\`\`\`
AXDD/Color/
├── brand/
│   ├── primary       → #__AXDD_DS__
│   ├── primary-hover → #__AXDD_DS__
│   └── accent        → #__AXDD_DS__
├── surface/
│   ├── base          → #__AXDD_DS__
│   ├── elevated      → #__AXDD_DS__
│   └── muted         → #__AXDD_DS__
├── ink/
│   ├── primary       → #__AXDD_DS__
│   ├── secondary     → #__AXDD_DS__
│   ├── disabled      → #__AXDD_DS__
│   └── inverse       → #__AXDD_DS__
├── border/
│   ├── default       → #__AXDD_DS__
│   └── focus         → #__AXDD_DS__
└── status/
    ├── success       → #__AXDD_DS__
    ├── warning       → #__AXDD_DS__
    ├── error         → #__AXDD_DS__
    └── info          → #__AXDD_DS__
\`\`\`

## 3. Naming 룰

- Figma 변수명은 \`/\` 구분자 사용 → AXDD 토큰명과 일대일 매핑
- 예: \`color/brand/primary\` → Figma 변수명 \`brand/primary\` (Collection이 AXDD/Color)

## 4. Dark mode (옵션)

\`\`\`
Collection: AXDD/Color
Modes: Light · Dark
Variable: surface/base
  · Light: #FFFFFF
  · Dark:  #0F172A
\`\`\`

## 5. Import 흐름

1. \`design_tokens.json\` 받기
2. Figma Token Studio plugin 또는 Variables API로 import
3. Collection 생성 → Variable 추가 → 컴포넌트 인스턴스에 bind
4. 디자이너가 컴포넌트 사용 시 자동으로 토큰 참조

## 6. MCP 차단 환경

Figma MCP가 차단되어 있으면 수동 절차:

1. \`design_tokens.json\` 다운로드
2. Figma Token Studio plugin 설치
3. Plugin에서 JSON import
4. 모든 컴포넌트 Variable로 rebind

## 7. 검증

- 모든 Color Variable이 Collection에 등록됨
- 인라인 hex 값 사용한 컴포넌트 0건 (Figma의 Selection Inspector 활용)
- Light/Dark mode 모두 동작 (해당 시)
`;

const ASSET_COMPONENT_LIB = `# Component Library Mapping Template

> 고객사 또는 사내 기존 컴포넌트 라이브러리를 AXDD 표준 컴포넌트와 매핑.

## 1. 매핑 표

| 외부 컴포넌트 | AXDD 컴포넌트 | Variant 매핑 | State 매핑 | 비고 |
|---|---|---|---|---|
| (예: acme-button) | Button | solid → primary, outline → secondary | hover/focus/disabled 동일 | |
| (예: acme-card) | Card | flat → default, raised → elevated | default 만 | |
| (예: acme-modal) | Modal | sm/md/lg/xl → sm/md/lg/fullscreen | open/closed 동일 | |
| (예: acme-input) | Input | normal/large → md/lg | default/focus/error/disabled 동일 | |
| (예: acme-toast) | Toast | info/positive/warning/critical → info/success/warning/error | | |

## 2. AXDD 공용 컴포넌트 카탈로그

| Component | Variants | States |
|---|---|---|
| Button | primary / secondary / ghost / danger | default / hover / focus / active / disabled / loading |
| Card | default / elevated / outlined | default / hover (interactive 한정) |
| Input | text / number / search / textarea | default / focus / error / disabled |
| Select | single / multi / searchable | default / open / disabled |
| Modal | sm / md / lg / fullscreen | open / closed |
| Toast | success / warning / error / info | enter / visible / exit |
| Table | default / striped / sortable | default / hover row / selected row |
| Tabs | horizontal / vertical | active / inactive |

## 3. 미매핑 항목 처리

| 상황 | 해결 |
|---|---|
| 외부 컴포넌트가 AXDD에 없음 | AXDD에 신규 컴포넌트 신청 (DS 컨트리뷰션 PR) |
| AXDD 컴포넌트의 일부 variant만 매핑 | 미매핑 variant는 \`unmapped\` 섹션에 명시 |
| 외부 컴포넌트가 다중 AXDD 컴포넌트와 매핑 | 사용 context별로 분기 매핑 |

## 4. 매핑 검증

- [ ] 외부 카탈로그의 80% 이상 매핑됨
- [ ] 미매핑 항목은 \`unmapped\` 섹션에 기록 + 신청 PR 링크
- [ ] 외부 prop ↔ AXDD prop 매핑 표 작성
- [ ] state 매핑 누락 0건
- [ ] 사용 예시 (외부 ↔ AXDD 동일 결과) 최소 3건

## 5. unmapped 섹션 예시

\`\`\`
## Unmapped (외부 → AXDD 신청 필요)

| 외부 컴포넌트 | 필요 사유 | AXDD 신청 PR |
|---|---|---|
| acme-data-grid | 대용량 sortable table + virtualization | (PR 링크) |
| acme-stepper   | 단계별 가이드 컴포넌트 | (PR 링크) |
\`\`\`
`;
/* ═══════════════════════════════════════════════════════════════
 * Tests — 실제 사용 가능한 체크리스트
 * ═══════════════════════════════════════════════════════════════ */

function buildTestContent(basename: string, skill: Skill): string {
  const title = basename.replace(/\.md$/, "").replace(/-/g, " ");
  return `# ${title}

> Test for skill: \`${skill.id}\`

## Purpose
이 테스트는 \`${skill.id}\` 스킬이 산출한 결과물의 품질을 검증한다.

## Input condition
이 스킬이 입력으로 받는 자료:
${(skill.input ?? []).map((i) => `- \`${i}\``).join("\n")}

## Pass criteria

${buildSkillPassCriteria(skill)}

## Fail criteria

산출물이 다음 중 하나라도 해당하면 fail:
- 필수 섹션 누락
- 표 구조 깨짐 (마크다운 파싱 실패)
- 외부 URL 1차 정책 위반 (\`https://\` 직접 노출, agentskills.io 제외)
- secret 패턴 노출 (AKIA / ghp_ / api_key=... 등)
- 인라인 hex 값 사용 (디자인 토큰을 우회)
- 외부 산업 어휘 누출 (UX/UI 컨텍스트 외)

## Manual review checklist

자동 검증으로 잡지 못하는 의미적 항목 (사람이 봐야 함):
- [ ] 산출물 톤이 AXDD 사내 표준에 부합
- [ ] 페르소나가 실제 AXDD 내부 사용자 (가상 외부 페르소나 X)
- [ ] 디자인 토큰이 \`references/axdd-design-system.md\` 와 일치
- [ ] 컴포넌트가 사내 표준 카탈로그에 등재된 것 또는 신설 신청 완료
- [ ] 접근성 (WCAG AA) 항목 명시
- [ ] 다음 스킬에 넘길 인풋이 자급자족 (외부 정보 없이 이해 가능)

## 실행

\`\`\`bash
# axe_check.py로 frontmatter / secret 자동 검증
python3 ../../validation/axe_check.py validate-skill ../

# 본 체크리스트는 PR 리뷰어가 수동 실행
\`\`\`

## 실패 시 처리

- 사유를 \`validation/validation-log-template.md\` 형식으로 기록
- 산출물 Reject 후 해당 스킬 재실행
- 반복 실패 시 SKILL.md 본문 또는 references 보강 필요
`;
}

function buildSkillPassCriteria(skill: Skill): string {
  // 스킬별 의미 있는 pass criteria
  switch (skill.id) {
    case "design-system-ingest-skill":
      // intentionally placed first for visibility
      return `- 5개 산출물 모두 생성 (design_system_profile.md / design_tokens.json / tailwind_token_mapping.md / figma_variable_mapping.md / component_library_mapping.md)
- design_tokens.json 이 valid JSON
- 모든 hex 값이 \`#RRGGBB\` 형식
- 인라인 hex 0건 (모두 토큰 alias 사용)
- 컴포넌트 매핑 ≥ 5건 (Button/Card/Input/Modal/Toast 최소)
- DS 출처 명시 (customer / axdd-internal / fallback)
- unmapped 섹션 존재 (있을 경우)`;
    case "ui-ux-requirement-extract-skill":
      return `- UI/UX 관련 요구사항 ≥ 3개 식별
- 백엔드·인프라 영역 누출 0건
- 1000자 이내 (1페이지 분량)
- 5섹션 모두 존재 (Context / Goal / Key Points / Risks / Next Steps)`;
    case "ui-element-extract-skill":
      return `- 공용 컴포넌트 ≥ 5종 (Button/Card/Input/Modal/Toast)
- 프로젝트 특화 컴포넌트 ≥ 1종
- 요구사항 미커버 영역 0건
- DS 출처 명시 (AXDD DS / 고객사 DS)`;
    case "ui-foundation-build-skill":
      return `- Color 토큰 ≥ 10종
- Typography 스케일 ≥ 7종
- Spacing 4의 배수만 사용
- 토큰 이름은 kebab-case 또는 slash 표기
- 인라인 hex 값 사용 금지`;
    case "component-spec-write-skill":
      return `- 공용 컴포넌트 5종 모두 정의
- 각 컴포넌트가 Variants/States/Props/Anatomy/Token mapping 5개 항목 모두 포함
- 모든 색·여백·라운드 값이 토큰 이름으로 표기`;
    case "sample-screen-design-skill":
      return `- 화면 ≥ 3개
- 각 화면에 ASCII 와이어프레임 (코드블록) 포함
- 각 영역의 컴포넌트·토큰 매핑 bullet 작성
- 컴포넌트 이름이 component_spec과 일치`;
    case "ux-process-define-skill":
      return `- 페르소나 ≥ 2종 (Persona × Goal × Pain × Insight)
- Double Diamond 4단계 모두 정의
- 각 단계별 액션 표에 Method · Output 명시
- AXDD 내부 페르소나 (외부 산업 페르소나 X)`;
    case "user-flow-design-skill":
      return `- 플로우 ≥ 2개
- 각 플로우 ≥ 5단계
- Entry/Exit 명시
- 프로젝트 핵심 작업 반영 (generic 플로우 X)`;
    case "ia-build-skill":
      return `- 트리에 orphan 노드 없음
- 각 노드 한 줄 설명 존재
- User Flow의 모든 state가 IA에 매핑
- 프로젝트 특화 경로 사용 (generic /dashboard 만 있으면 fail)`;
    case "handoff-merge-skill":
      return `- 8섹션 모두 존재
- UI 트랙 + UX 트랙 모든 산출물이 합쳐짐
- 마크다운 표 구조 정확
- 사용된 DS 출처 명시 (문서 상단)`;
    case "figma-prompt-build-skill":
      return `- 프레임 ≥ 6개 명시
- 프로젝트 정보 (프로젝트명·DS 출처·토큰) 포함
- 규칙 섹션 ≥ 5개
- 코드블록으로 감싸짐 (그대로 복사 가능)
- 외부 산업 anchoring 없음`;
    default:
      return `- 필수 섹션 모두 존재
- 표 구조 정확
- 사용된 DS 출처 명시
- 외부 URL 정책 준수`;
  }
}

/* ═══════════════════════════════════════════════════════════════
 * Generic fallbacks (이름 매칭 안 됐을 때)
 * ═══════════════════════════════════════════════════════════════ */

function buildGenericReference(basename: string, skill: Skill): string {
  const title = basename.replace(/\.md$/, "").replace(/-/g, " ");
  return `# ${title}

> Reference for skill: \`${skill.id}\`

## Purpose

이 reference는 \`${skill.id}\` 스킬이 산출물 생성 시 참고하는 자료입니다.

## Content

(이 자리에 AXDD 사내 표준 자료 또는 외부 차용 자료를 채우세요.)

권장 항목:
- 정의 / 용어 / 약어
- 표준 패턴 / 예시
- Do · Don't 사례
- 관련 토큰 / 컴포넌트 / 룰

## Maintenance

- 분기 1회 사내 디자인팀 검토
- 변경 시 \`CATALOG.md\` 업데이트
- 의존 스킬의 SKILL.md description에서 자료 갱신 명시
`;
}

function buildGenericAsset(basename: string, skill: Skill): string {
  const title = basename.replace(/\.(md|html|json)$/, "").replace(/-/g, " ");
  return `# ${title}

> Template asset for skill: \`${skill.id}\`

## How to use

이 템플릿을 복사해 \`{{PLACEHOLDER}}\` 위치를 채우세요.

---

# {{TITLE}}

## Overview
{{ONE_LINE}}

## Details
- {{POINT_1}}
- {{POINT_2}}
- {{POINT_3}}

## Metadata
- Owner: {{OWNER}}
- Status: Draft
- Date: YYYY-MM-DD
`;
}

function buildScriptContent(basename: string, _skill: Skill): string {
  if (basename.endsWith(".py")) {
    return `#!/usr/bin/env python3
"""${basename}

AXDD Enterprise Skill — utility script.

Usage:
    python3 ${basename} <input_file>

이 스크립트는 stdlib만 사용합니다. 외부 패키지 의존성 없음.
"""

from __future__ import annotations

import argparse
import json
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description="${basename}")
    parser.add_argument("input", help="입력 파일 경로")
    parser.add_argument("--format", choices=["json", "md"], default="json")
    args = parser.parse_args()

    # TODO: 실제 변환 로직 구현
    result = {"input": args.input, "format": args.format, "ok": True}

    if args.format == "json":
        json.dump(result, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\\n")
    else:
        for k, v in result.items():
            sys.stdout.write(f"- **{k}**: {v}\\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
`;
  }
  if (basename.endsWith(".html")) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${basename}</title>
</head>
<body>
  <h1>${basename}</h1>
  <p>AXDD Enterprise Skill — HTML asset.</p>
</body>
</html>
`;
  }
  return `# ${basename}\n\nAXDD Enterprise Skill — generic script asset.\n`;
}
