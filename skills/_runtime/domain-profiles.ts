/**
 * Project Context Profile — Phase 6 재정의.
 *
 * 이전 버전(외부 산업 5종)을 폐기하고, AXDD 전사 내부 컨텍스트로 재구성:
 *   - axdd-internal     · AXDD 사내 자체 자산 만들기 (Case B)
 *   - customer-project  · 외부 고객사 프로젝트 수행 (Case C)
 *   - ds-bootstrap      · 자체 DS가 아직 없어 부트스트랩 (Case A)
 *   - generic           · 컨텍스트 미확정 폴백
 *
 * mock-output들이 intent.domain을 이 프로필로 변환해 컨텍스트별 산출물을 만든다.
 * 색 토큰·페르소나·컴포넌트는 **AXDD 컨텍스트 안에서만** 정의 (외부 산업 X).
 *
 * 외부 export 시그니처 (DomainProfile / getDomainProfile / countDomainKeywords)는
 * 호환성을 위해 유지하되, 내용은 전면 교체.
 */

import type { Domain } from "./intent";

export interface DomainToken {
  name: string;
  hex: string;
  usage: string;
}

export interface DomainPersona {
  role: string;
  goal: string;
  pain: string;
  insight: string;
}

export interface DomainUserFlow {
  name: string;
  steps: string[];
}

export interface DomainScreen {
  name: string;
  description: string;
  wireframe: string;
}

export interface DomainComponent {
  name: string;
  variants: string[];
  states: string[];
  purpose: string;
}

export interface DomainProfile {
  id: Domain;
  label: string;
  brandShort: string;
  toneDescriptors: string[];
  successMetrics: string[];
  colorTokens: DomainToken[];
  typographyPersonality: string;
  motionGuide: string;
  iaTree: string;
  personas: DomainPersona[];
  userFlows: DomainUserFlow[];
  sampleScreens: DomainScreen[];
  domainComponents: DomainComponent[];
  interactions: { trigger: string; animation: string; duration: string; easing: string }[];
  a11yChecklist: string[];
  figmaFrames: string[];
  /** 컨텍스트 키워드 — validation 일치 체크에 사용 */
  domainKeywords: string[];
}

// ═══════════════════════════════════════════════════════════════
// AXDD Internal — 사내 자체 자산 만들기 (Case B)
// ═══════════════════════════════════════════════════════════════
const AXDD_INTERNAL: DomainProfile = {
  id: "axdd-internal",
  label: "AXDD 사내 프로젝트",
  brandShort:
    "사내 디자이너·PM·개발자가 함께 쓰는 자산. 전문성과 일관성 우선, 트렌드보다 신뢰",
  toneDescriptors: ["전문성", "일관성", "효율", "차분"],
  successMetrics: [
    "사내 표준 컴포넌트 활용률 ≥ 90%",
    "신규 자산 추가 시 기존 토큰 재사용 비율 ≥ 80%",
    "리뷰 → 머지 평균 소요 ≤ 2 영업일",
  ],
  colorTokens: [
    { name: "color/brand/primary", hex: "__TODO__", usage: "AXDD 디자인팀 정의 — 메인 액션" },
    { name: "color/brand/accent", hex: "__TODO__", usage: "강조 액션 · 활성 상태" },
    { name: "color/surface/base", hex: "__TODO__", usage: "페이지 기본 배경" },
    { name: "color/surface/elevated", hex: "__TODO__", usage: "카드·모달 배경" },
    { name: "color/ink/primary", hex: "__TODO__", usage: "본문 텍스트" },
    { name: "color/ink/secondary", hex: "__TODO__", usage: "보조 텍스트" },
    { name: "color/border/default", hex: "__TODO__", usage: "기본 보더" },
    { name: "color/status/success", hex: "__TODO__", usage: "성공" },
    { name: "color/status/warning", hex: "__TODO__", usage: "경고" },
    { name: "color/status/error", hex: "__TODO__", usage: "에러" },
    { name: "color/status/info", hex: "__TODO__", usage: "정보" },
  ],
  typographyPersonality:
    "Pretendard 또는 사내 표준 폰트. 헤딩 600, 본문 400. 행간 1.5~1.6. 토큰 이름·코드는 mono 사용",
  motionGuide:
    "절제. 120~200ms ease-out 위주. 데이터 로딩 외 자동 애니메이션 최소화 — 효율 중시",
  iaTree: `/
├── /home              ─ 사내 대시보드 (작업·알림·바로가기)
├── /projects          ─ 진행 중인 프로젝트 목록
│   ├── /[id]          ─ 프로젝트 상세
│   ├── /[id]/skills   ─ 사용 중인 스킬
│   └── /[id]/assets   ─ 산출물·자산
├── /design-system     ─ AXDD DS 카탈로그 (토큰·컴포넌트·가이드)
├── /skills            ─ 스킬 라이브러리
└── /governance        ─ 리뷰 큐·승인·릴리즈`,
  personas: [
    {
      role: "사내 디자이너 (UI/UX)",
      goal: "AXDD DS 안에서 일관성 있게 신규 화면·컴포넌트를 추가",
      pain: "프로젝트마다 토큰·룰이 흩어져 다시 정의하는 비효율",
      insight: "한 번 정의된 토큰을 검색·재사용할 수 있어야 한다",
    },
    {
      role: "사내 프론트엔드 개발자",
      goal: "디자이너 핸드오프를 받아 즉시 구현 (토큰 이름 그대로 코드에)",
      pain: "디자인 토큰이 코드와 동기화 안 되어 hex 값을 복사하는 일",
      insight: "토큰 카탈로그가 코드 import로도 접근 가능해야 한다",
    },
    {
      role: "사내 PM / 운영자",
      goal: "프로젝트 진행 상황·리스크·릴리즈 상태를 한눈에 파악",
      pain: "여러 도구를 오가며 상태 확인 (Slack/Confluence/Jira)",
      insight: "한 화면에서 진행률·리뷰 큐·리스크를 함께 봐야 한다",
    },
  ],
  userFlows: [
    {
      name: "신규 화면 추가 (디자이너)",
      steps: [
        "요구사항 MD 업로드",
        "DS 카탈로그에서 컴포넌트 선택",
        "와이어프레임 작성",
        "리뷰 큐 등록",
        "Approve → 핸드오프 문서 생성",
      ],
    },
    {
      name: "토큰 추가 (DS 컨트리뷰터)",
      steps: [
        "신규 토큰 제안",
        "기존 토큰과 충돌 검사",
        "관련 컴포넌트 영향도 평가",
        "리뷰",
        "Approve → 카탈로그에 머지",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Dashboard",
      description: "내 작업 · 알림 · 빠른 액션",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ AXDD Console        [검색]              김디자이너 ▾ │
├──────┬──────────────────────────────────────────────┤
│      │ Hello, 디자이너님                              │
│ Nav  ├──────────────────────────────────────────────┤
│      │ 진행 중   리뷰 대기   완료된 이번 주          │
│      │  ◆ 12      ◆ 3        ◆ 8                    │
│      ├──────────────────────────────────────────────┤
│      │ 내 작업                                       │
│      │ □ DS 토큰 보강 — 2시간 전                     │
│      │ □ 신규 어드민 IA — 어제                       │
└──────┴──────────────────────────────────────────────┘`,
    },
    {
      name: "Design System Catalog",
      description: "토큰·컴포넌트·패턴 한 곳에서",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ Design System          v1.2.0      [편집] [업로드]    │
├──────────────────────────────────────────────────────┤
│ ▾ Color (12)                                          │
│   ▢ brand/primary    #__TODO__   메인 액션              │
│   ▢ brand/accent     #__TODO__   강조                  │
│ ▾ Typography (7)                                      │
│ ▾ Components (12)                                     │
│   ▢ Button   [Primary][Ghost][Danger]                 │
│   ▢ Card     [Default][Elevated]                      │
└──────────────────────────────────────────────────────┘`,
    },
    {
      name: "Project Detail",
      description: "프로젝트 진행·산출물·리뷰",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ ← 프로젝트: 사내 어드민 v2 리디자인                    │
├──────────────────────────────────────────────────────┤
│ 진행률 ████████░░ 80%   리뷰 2건  리스크 1건           │
│ ─────────────────────────────────────────────────    │
│ 산출물                                                │
│ ✓ ui_foundation.md     2일 전                         │
│ ✓ component_spec.md    1일 전                         │
│ ◇ handoff.md           작성 중                        │
└──────────────────────────────────────────────────────┘`,
    },
  ],
  domainComponents: [
    {
      name: "ProjectSummaryCard",
      variants: ["default", "compact", "with-risk"],
      states: ["loading", "loaded", "stale"],
      purpose: "프로젝트 진행률·리뷰·리스크를 한 카드에",
    },
    {
      name: "TokenSwatch",
      variants: ["color", "spacing", "typography"],
      states: ["default", "selected", "deprecated"],
      purpose: "DS 카탈로그에서 토큰을 시각적으로 표현",
    },
    {
      name: "ReviewQueueRow",
      variants: ["pending", "in-review", "approved", "rejected"],
      states: ["default", "hover", "selected"],
      purpose: "리뷰 큐에서 항목 1건",
    },
    {
      name: "SkillChainNode",
      variants: ["pending", "running", "done", "failed"],
      states: ["default", "highlighted"],
      purpose: "Work Unit Flow에서 스킬 1개",
    },
    {
      name: "AxddBreadcrumb",
      variants: ["default", "with-status"],
      states: ["default"],
      purpose: "사내 IA의 위계 표시",
    },
  ],
  interactions: [
    { trigger: "카드 호버", animation: "그림자 강화 + 살짝 떠오름", duration: "150ms", easing: "ease-out" },
    { trigger: "리뷰 Approve", animation: "그린 체크 페이드 인 + 카드 슬라이드 아웃", duration: "300ms", easing: "ease-out" },
    { trigger: "에러 토스트", animation: "우측에서 슬라이드 인 후 5초 후 페이드 아웃", duration: "200ms / 5000ms", easing: "ease-out" },
    { trigger: "탭 전환", animation: "인디케이터 슬라이드", duration: "180ms", easing: "ease-in-out" },
    { trigger: "모달 오픈", animation: "배경 페이드 + 모달 살짝 스케일 업", duration: "200ms", easing: "ease-out" },
  ],
  a11yChecklist: [
    "WCAG AA 색 대비 충족 (텍스트 4.5:1, 큰 텍스트 3:1)",
    "키보드만으로 모든 액션 접근 가능 (Tab/Enter/Esc)",
    "포커스 인디케이터 명확 (2px 솔리드)",
    "모달 오픈 시 포커스 트랩 + Esc 닫기",
    "리뷰 액션은 confirm dialog 또는 토스트 undo 제공",
    "데이터 테이블 헤더 sticky + 키보드 정렬 가능",
    "스크린리더용 aria-label / aria-live region 적용",
    "색상만으로 상태 구분 금지 (아이콘 동반)",
    "긴 텍스트 ellipsis 시 tooltip 제공",
    "에러 메시지는 입력 필드 바로 아래에",
    "로딩 상태는 텍스트 + 시각적 인디케이터 모두",
    "다국어 대응 — 한국어/영어 토글",
  ],
  figmaFrames: [
    "Cover",
    "Project Overview",
    "IA & User Flow",
    "Design Tokens (Color/Type/Spacing)",
    "Component Library (Button/Card/Input/Modal/Toast)",
    "Sample Screens (Dashboard/DS Catalog/Project Detail)",
    "Empty / Loading / Error States",
    "A11y Annotations",
    "Mobile Adaptation (옵션)",
    "Print Spec Sheets",
    "Hand-off Notes",
  ],
  domainKeywords: [
    "axdd", "사내", "내부", "전사", "팀", "프로젝트",
    "디자이너", "개발자", "pm", "운영자",
    "디자인 시스템", "토큰", "컴포넌트", "카탈로그",
    "리뷰", "승인", "릴리즈", "워크유닛", "스킬",
  ],
};

// ═══════════════════════════════════════════════════════════════
// Customer Project — 외부 고객사 프로젝트 (Case C)
// ═══════════════════════════════════════════════════════════════
const CUSTOMER_PROJECT: DomainProfile = {
  id: "customer-project",
  label: "고객사 프로젝트 (외부)",
  brandShort:
    "고객사 디자인 시스템을 차용하되, AXDD 핸드오프 표준은 유지. 고객사 톤을 학습해 일관성 보존",
  toneDescriptors: ["적응적", "전문성", "고객사 톤 차용"],
  successMetrics: [
    "고객사 DS 토큰 사용 비율 ≥ 95%",
    "AXDD 자체 컴포넌트 노출 ≤ 5% (불가피한 경우만)",
    "고객 검수 1회 통과율 ≥ 80%",
  ],
  colorTokens: [
    { name: "customer/brand/primary", hex: "__고객사 정의__", usage: "고객사 메인" },
    { name: "customer/brand/accent", hex: "__고객사 정의__", usage: "고객사 강조" },
    { name: "customer/surface/base", hex: "__고객사 정의__", usage: "고객사 배경" },
    { name: "customer/ink/primary", hex: "__고객사 정의__", usage: "고객사 본문" },
    { name: "axdd/fallback/border", hex: "__AXDD DS__", usage: "고객사 미정의 시 폴백" },
    { name: "axdd/fallback/status-success", hex: "__AXDD DS__", usage: "폴백 성공" },
    { name: "axdd/fallback/status-error", hex: "__AXDD DS__", usage: "폴백 에러" },
  ],
  typographyPersonality:
    "고객사 폰트 패밀리 우선. 미정의 시 AXDD 표준 폴백. 위계는 AXDD 7-step 스케일 유지",
  motionGuide:
    "고객사 모션 가이드가 있으면 그것 우선. 없으면 AXDD 표준 (150~200ms ease-out)",
  iaTree: `/
└── (프로젝트별 — 고객사 요구사항에서 도출)`,
  personas: [
    {
      role: "고객사 의사결정자",
      goal: "요구한 산출물이 고객사 브랜드 가이드를 정확히 반영",
      pain: "외주 결과물이 고객사 톤과 어긋나는 경우",
      insight: "리뷰 단계에서 가이드 위반을 자동 검출해야 한다",
    },
    {
      role: "AXDD 프로젝트 리드",
      goal: "고객사 DS를 빠르게 학습하고 우리 워크플로에 적용",
      pain: "고객사마다 DS 포맷이 달라 매번 다르게 처리",
      insight: "고객사 DS를 표준 인풋 폼으로 받을 수 있어야 한다",
    },
    {
      role: "AXDD 디자이너",
      goal: "고객사 토큰을 우리 컴포넌트에 매핑해 빠르게 화면 작성",
      pain: "토큰 매핑이 수동 — 실수 가능성",
      insight: "토큰 alias 매핑 도구가 필요",
    },
  ],
  userFlows: [
    {
      name: "고객사 DS 적용",
      steps: [
        "고객사 DS 인풋 (Figma URL / MD / 폴더)",
        "표준 인풋 폼으로 변환",
        "AXDD DS 폴백 매핑",
        "충돌 검토",
        "프로젝트 워크유닛 실행",
      ],
    },
    {
      name: "고객 검수",
      steps: [
        "산출물 생성",
        "검수 체크리스트 자동 실행",
        "고객사 가이드 위반 항목 마킹",
        "리뷰 큐 등록",
        "고객 승인 → 릴리즈",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Customer DS Adapter",
      description: "고객사 DS를 표준 인풋 폼으로",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ 고객사 DS 어댑터                                       │
├──────────────────────────────────────────────────────┤
│ 입력 소스: ◉ Figma URL  ○ MD 업로드  ○ 폴더 zip       │
│ [https://figma.com/...                            ]   │
│ [분석 시작]                                           │
│ ─────────────────────────────────────────────────    │
│ 검출된 토큰: 14   매핑 완료: 12   AXDD 폴백: 2        │
└──────────────────────────────────────────────────────┘`,
    },
    {
      name: "고객사 핸드오프",
      description: "고객사 톤으로 작성된 산출물",
      wireframe: `(프로젝트별 다름 — 고객사 DS 와이어프레임)`,
    },
    {
      name: "검수 결과",
      description: "고객사 가이드 일치율 자동 평가",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ 검수 결과 — 고객사 가이드 일치율 94%                   │
├──────────────────────────────────────────────────────┤
│ ✓ 색 토큰 95%      ⚠ Typography 85%   ⚠ Spacing 92%   │
│ 발견된 위반: 3건                                       │
│  · spacing/16px (가이드: 4의 배수 위반)               │
│  · color/#ff5500 (인라인 hex)                         │
└──────────────────────────────────────────────────────┘`,
    },
  ],
  domainComponents: [
    {
      name: "CustomerDsAdapter",
      variants: ["figma-url", "md-upload", "folder-zip"],
      states: ["empty", "analyzing", "ready", "failed"],
      purpose: "고객사 DS를 표준 폼으로 변환",
    },
    {
      name: "TokenAliasMapper",
      variants: ["1to1", "fallback-axdd", "custom"],
      states: ["mapped", "conflict", "fallback"],
      purpose: "고객사 토큰 ↔ AXDD 토큰 매핑",
    },
    {
      name: "GuidelineViolationBadge",
      variants: ["error", "warning"],
      states: ["default", "dismissed"],
      purpose: "고객사 가이드 위반 마킹",
    },
  ],
  interactions: [
    { trigger: "DS 분석 완료", animation: "프로그레스 → 결과 카드 페이드", duration: "300ms", easing: "ease-out" },
    { trigger: "토큰 매핑 충돌", animation: "충돌 카드 하이라이트 + 시그널", duration: "200ms", easing: "ease-out" },
    { trigger: "검수 통과", animation: "그린 체크 + 토스트", duration: "300ms", easing: "ease-out" },
  ],
  a11yChecklist: [
    "고객사 가이드의 a11y 요구사항 적용",
    "AXDD 기본 a11y 폴백 (WCAG AA)",
    "고객사 / AXDD 출처 명시",
  ],
  figmaFrames: [
    "Cover (고객사 브랜드)",
    "Project Overview",
    "고객사 DS 차용 토큰",
    "Component Library (고객사 + 폴백)",
    "Sample Screens",
    "Hand-off Notes",
  ],
  domainKeywords: [
    "고객사", "고객", "client", "customer", "외주",
    "프로젝트", "검수", "리뷰", "납품", "릴리즈",
    "디자인 시스템", "토큰", "차용", "어댑터", "폴백",
  ],
};

// ═══════════════════════════════════════════════════════════════
// DS Bootstrap — 자체 DS가 아직 없을 때 (Case A)
// ═══════════════════════════════════════════════════════════════
const DS_BOOTSTRAP: DomainProfile = {
  id: "ds-bootstrap",
  label: "Design System Bootstrap (초안 생성)",
  brandShort:
    "AXDD가 아직 자체 DS가 없을 때 요구사항 + 일반 원칙만으로 초안 생성. 결과물은 our-design-system.md 후보",
  toneDescriptors: ["전문성", "체계적", "확장 가능"],
  successMetrics: [
    "토큰 풀세트 (Color/Typography/Spacing/Radius/Shadow/Motion) 모두 정의",
    "공용 컴포넌트 5종 스펙 작성",
    "출처·근거가 모든 토큰에 명시",
  ],
  colorTokens: [
    { name: "color/brand/primary", hex: "#__제안 1__", usage: "초안 — 검토 필요" },
    { name: "color/brand/accent", hex: "#__제안 2__", usage: "초안 — 검토 필요" },
    { name: "color/surface/base", hex: "#__제안 3__", usage: "초안 — 검토 필요" },
    { name: "color/ink/primary", hex: "#__제안 4__", usage: "초안 — 검토 필요" },
    { name: "color/status/success", hex: "#__제안 5__", usage: "초안" },
    { name: "color/status/warning", hex: "#__제안 6__", usage: "초안" },
    { name: "color/status/error", hex: "#__제안 7__", usage: "초안" },
  ],
  typographyPersonality:
    "표준 위계 7-step (display/h1/h2/h3/body/caption/code). 폰트 패밀리는 디자인팀 결정 보류",
  motionGuide:
    "표준 3-tier (fast 120ms / normal 200ms / slow 400ms). 디자인팀 검토 후 확정",
  iaTree: `/
└── (DS Bootstrap은 토큰·컴포넌트 카탈로그만 — 페이지 IA 없음)`,
  personas: [
    {
      role: "디자인 시스템 설계자",
      goal: "AXDD에 맞는 토큰·컴포넌트 카탈로그 초안 빠르게 생성",
      pain: "처음부터 모든 결정을 하는 부담",
      insight: "일반 원칙 기반 초안이 있으면 검토·수정 모드로 일할 수 있다",
    },
    {
      role: "DS 컨트리뷰터",
      goal: "초안에 자기 의견·수정안 반영",
      pain: "리뷰 단계가 불명확",
      insight: "Human Gate로 단계별 승인 필요",
    },
  ],
  userFlows: [
    {
      name: "Bootstrap 실행",
      steps: [
        "요구사항 MD 입력",
        "토큰 초안 생성 (color/type/spacing)",
        "컴포넌트 스펙 초안",
        "Human Review",
        "Approve → data/our-design-system.md 갱신",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Bootstrap 진행",
      description: "단계별 진행 상황",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ DS Bootstrap 진행 — 2/3 완료                           │
├──────────────────────────────────────────────────────┤
│ ✓ 요구사항 추출    ─ ui_ux_requirement_summary.md      │
│ ✓ 토큰 풀세트      ─ ui_foundation.md  [검토 대기]     │
│ ◇ 컴포넌트 스펙    ─ 진행 중...                       │
│ ─────────────────────────────────────────────────    │
│ [Approve & 다음 단계]  [Reject — 수정 요청]           │
└──────────────────────────────────────────────────────┘`,
    },
  ],
  domainComponents: [
    {
      name: "TokenProposalCard",
      variants: ["pending-review", "approved", "rejected"],
      states: ["default", "expanded"],
      purpose: "Bootstrap 단계에서 제안된 토큰 1개",
    },
  ],
  interactions: [
    { trigger: "Bootstrap 시작", animation: "프로그레스 바 등장", duration: "300ms", easing: "ease-out" },
    { trigger: "Approve", animation: "체크 + 다음 단계 페이드 인", duration: "300ms", easing: "ease-out" },
  ],
  a11yChecklist: [
    "초안 토큰이 WCAG AA 대비 자동 통과",
    "리젝트 시 사유 입력 강제",
  ],
  figmaFrames: [
    "Bootstrap Overview",
    "Color Token Proposal",
    "Typography Proposal",
    "Spacing Proposal",
    "Component Proposal",
  ],
  domainKeywords: [
    "디자인 시스템", "ds", "bootstrap", "초안", "부트스트랩",
    "토큰", "팔레트", "타이포", "스페이싱", "컴포넌트",
    "제안", "리뷰", "승인", "확정",
  ],
};

// ═══════════════════════════════════════════════════════════════
// Generic — unknown 폴백
// ═══════════════════════════════════════════════════════════════
const GENERIC: DomainProfile = {
  id: "generic",
  label: "AXDD 일반 컨텍스트",
  brandShort:
    "프로젝트 컨텍스트가 아직 확정되지 않음. clarifying 질문 후 axdd-internal / customer-project / ds-bootstrap 중 하나로 좁힘",
  toneDescriptors: ["중립", "전문성"],
  successMetrics: [
    "사용자에게 필요한 추가 정보를 명확히 안내",
    "컨텍스트 확정 후 적절한 워크유닛으로 라우팅",
  ],
  colorTokens: [
    { name: "color/brand/primary", hex: "__TODO__", usage: "AXDD DS 카탈로그 참조" },
  ],
  typographyPersonality: "AXDD DS 카탈로그 참조 — 미정의 시 시스템 폰트",
  motionGuide: "AXDD 표준 — 150ms ease-out",
  iaTree: `/
└── (컨텍스트 확정 후 결정)`,
  personas: [
    {
      role: "사내 사용자",
      goal: "이 콘솔로 어떤 작업을 할 수 있는지 알아보기",
      pain: "어디서부터 시작해야 할지 모름",
      insight: "프리셋 또는 clarifying 질문으로 안내 필요",
    },
  ],
  userFlows: [
    {
      name: "컨텍스트 확정",
      steps: [
        "프롬프트 입력",
        "Intent 분석",
        "필요한 정보 clarifying",
        "워크유닛 라우팅",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Clarifying",
      description: "컨텍스트 확정 질문",
      wireframe: `┌─────────────────────────────────────────────────────┐
│ 어떤 작업이신가요?                                     │
├──────────────────────────────────────────────────────┤
│ ◯ AXDD 사내 자체 자산 (Case B)                         │
│ ◯ 외부 고객사 프로젝트 (Case C)                        │
│ ◯ AXDD DS 초안 만들기 (Case A)                         │
│ ◯ 요구사항부터 정리 (Case D)                           │
└──────────────────────────────────────────────────────┘`,
    },
  ],
  domainComponents: [],
  interactions: [],
  a11yChecklist: ["AXDD DS a11y baseline 참조"],
  figmaFrames: ["Cover", "Clarifying"],
  domainKeywords: ["axdd", "사내", "프로젝트", "디자인", "ds"],
};

// ═══════════════════════════════════════════════════════════════
// Registry + Helpers
// ═══════════════════════════════════════════════════════════════

const PROFILES: Record<Domain, DomainProfile> = {
  "axdd-internal": AXDD_INTERNAL,
  "customer-project": CUSTOMER_PROJECT,
  "ds-bootstrap": DS_BOOTSTRAP,
  generic: GENERIC,
  unknown: GENERIC,
};

export function getDomainProfile(id?: Domain): DomainProfile {
  if (!id) return GENERIC;
  return PROFILES[id] ?? GENERIC;
}

/**
 * 컨텍스트 키워드 카운트 — validation의 일치성 검증에 사용.
 *
 * (이전 버전 시그니처 호환 유지 — 이름만 유지하고 내부 의미는 새 컨텍스트에 맞춤)
 *
 * @param text 산출물 본문
 * @param target 사용자 요청 컨텍스트 (이 키워드가 많이 등장해야 OK)
 * @param others 다른 컨텍스트 (이 키워드가 많이 등장하면 누출)
 */
export function countDomainKeywords(
  text: string,
  target: Domain,
  others: Domain[] = [],
): { targetHits: number; otherHits: number; detail: Record<string, number> } {
  const lower = text.toLowerCase();
  const detail: Record<string, number> = {};

  const targetProfile = getDomainProfile(target);
  let targetHits = 0;
  for (const kw of targetProfile.domainKeywords) {
    const occ = (lower.match(new RegExp(kw.toLowerCase(), "g")) || []).length;
    targetHits += occ;
  }

  let otherHits = 0;
  for (const dom of others) {
    if (dom === target || dom === "generic" || dom === "unknown") continue;
    const profile = getDomainProfile(dom);
    let domHits = 0;
    for (const kw of profile.domainKeywords) {
      // target 키워드와 겹치는 건 누출로 안 침
      if (targetProfile.domainKeywords.includes(kw)) continue;
      const occ = (lower.match(new RegExp(kw.toLowerCase(), "g")) || []).length;
      domHits += occ;
    }
    detail[dom] = domHits;
    otherHits += domHits;
  }

  return { targetHits, otherHits, detail };
}

export const ALL_DOMAINS: Domain[] = [
  "axdd-internal",
  "customer-project",
  "ds-bootstrap",
  "generic",
];
