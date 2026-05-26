/**
 * Domain Profile — 도메인별 디자인·UX 컨텍스트.
 *
 * 모든 스킬 mock은 intent.domain을 이 프로필로 변환해 도메인 적합한
 * 출력을 만든다. LLM이 붙으면 같은 프로필 데이터를 prompt 컨텍스트로
 * 넘겨서 더 정확한 결과를 만들 수 있다.
 *
 * 핵심 원칙:
 * - **사용자 요청 도메인을 절대 덮어쓰지 않는다.**
 * - 콘솔(AXDD SkillOps) 자체의 토큰·컴포넌트를 산출물에 누출하지 않는다.
 * - 도메인 미지정 시 generic 폴백 사용 (구체 도메인명 강요 X)
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
  /** ASCII 와이어프레임 (Figma 가이드용) */
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
  /** 사람 읽는 도메인 이름 (예: "헬스케어 SaaS 환자 대시보드") */
  label: string;
  /** 한 줄 브랜드 정체성 */
  brandShort: string;
  /** 톤 형용사 묶음 */
  toneDescriptors: string[];
  /** 성공 지표 3개 (도메인 특화) */
  successMetrics: string[];
  /** Color tokens — 도메인별 다른 팔레트 */
  colorTokens: DomainToken[];
  /** Typography 성격 */
  typographyPersonality: string;
  /** Motion 가이드 */
  motionGuide: string;
  /** IA 트리 (ASCII) */
  iaTree: string;
  /** Personas 3개 */
  personas: DomainPersona[];
  /** User flows 2개 */
  userFlows: DomainUserFlow[];
  /** Sample screens 3개 */
  sampleScreens: DomainScreen[];
  /** 도메인 핵심 컴포넌트 (Button·Card·Input은 공통, 도메인 특화만) */
  domainComponents: DomainComponent[];
  /** Interaction & Motion 사양 */
  interactions: { trigger: string; animation: string; duration: string; easing: string }[];
  /** A11y 체크리스트 (도메인 특화 항목 포함) */
  a11yChecklist: string[];
  /** Figma 프레임 목록 */
  figmaFrames: string[];
  /** 도메인 키워드 — validation의 도메인 fit 체크에 사용 */
  domainKeywords: string[];
}

// ═══════════════════════════════════════════════════════════════
// 헬스케어 SaaS (환자 대시보드)
// ═══════════════════════════════════════════════════════════════
const HEALTHCARE: DomainProfile = {
  id: "헬스케어",
  label: "헬스케어 SaaS 환자 대시보드",
  brandShort: "신뢰감 있는 의료 톤, 차분한 화이트 + 청록, 정보 안전 최우선",
  toneDescriptors: ["신뢰", "차분", "안정감", "위계 명확"],
  successMetrics: [
    "주요 정보(다음 진료/복약) 첫 화면 도달 ≤ 1 클릭",
    "민감정보 화면 평균 체류 시간 ≤ 8초",
    "예약 변경/확인 완료율 ≥ 92%",
  ],
  colorTokens: [
    { name: "primary/teal-600", hex: "#0d9488", usage: "주요 CTA · 활성 상태" },
    { name: "primary/teal-50", hex: "#f0fdfa", usage: "선택된 카드 배경" },
    { name: "accent/sky-500", hex: "#0ea5e9", usage: "안내 링크 · 정보 아이콘" },
    { name: "surface/white", hex: "#ffffff", usage: "카드 베이스" },
    { name: "surface/cream", hex: "#fafaf9", usage: "페이지 배경 (눈 피로 감소)" },
    { name: "ink-50", hex: "#fafafa", usage: "구분선 배경" },
    { name: "ink-300", hex: "#d4d4d8", usage: "보조 보더" },
    { name: "ink-500", hex: "#71717a", usage: "보조 텍스트" },
    { name: "ink-900", hex: "#18181b", usage: "본문 텍스트" },
    { name: "status/critical", hex: "#dc2626", usage: "응급 알림 · 위험 수치" },
    { name: "status/normal", hex: "#16a34a", usage: "정상 수치 · 완료" },
    { name: "status/caution", hex: "#ca8a04", usage: "주의 · 검토 필요" },
    { name: "data/glucose", hex: "#7c3aed", usage: "혈당 시각화" },
    { name: "data/pressure", hex: "#dc2626", usage: "혈압 시각화" },
  ],
  typographyPersonality:
    "Pretendard 또는 Noto Sans KR. 헤딩은 600, 본문 400. 행간은 1.6 (의료 정보 가독성). 숫자(수치) 강조 시 mono 사용",
  motionGuide:
    "절제. snap 120ms 이하 위주. 위험 알림만 살짝 진동(섭동). 자동 전환 금지 (사용자 자율성)",
  iaTree: `/
├── /home              ─ 다음 진료 / 오늘의 복약 / 알림
├── /appointments      ─ 진료 예약 (일정·취소·변경)
│   └── /:id/detail
├── /medications       ─ 복약 관리
│   ├── /schedule      ─ 시간대별
│   └── /history       ─ 복약 이력
├── /records           ─ 진료 기록
│   ├── /labs          ─ 검사 결과
│   └── /imaging       ─ 영상 검사
├── /vitals            ─ 건강 지표 (혈당·혈압·체중)
├── /messages          ─ 의료진 메시지
└── /settings
    └── /privacy       ─ 개인정보·동의 관리`,
  personas: [
    {
      role: "환자 (40대, 만성질환 관리 중)",
      goal: "다음 진료 일정과 복약 정보를 빠르게 확인",
      pain: "여러 병원·검사 결과가 분산되어 한눈에 보기 어려움",
      insight: "홈 화면에서 '오늘 해야 할 일' 단일 카드로 통합 필요",
    },
    {
      role: "보호자 (자녀, 부모님 케어)",
      goal: "원격으로 부모님의 복약 이행 여부 모니터링",
      pain: "본인 명의가 아니라 정보 접근 어려움",
      insight: "위임 권한 + 알림 공유 기능 필수",
    },
    {
      role: "신규 환자 (20대, 첫 가입)",
      goal: "처음 가입해서 진료 예약까지 5분 내 완료",
      pain: "의료 용어가 어려움 / 보험 정보 입력 부담",
      insight: "온보딩 단계별 분할 + 용어 툴팁",
    },
  ],
  userFlows: [
    {
      name: "다음 진료 확인 → 알림 설정",
      steps: [
        "Entry — 홈 진입 (로그인 직후 또는 알림 클릭)",
        "Today 카드에서 '다음 진료 D-2' 확인",
        "카드 클릭 → /appointments/:id/detail",
        "일정·장소·준비물 확인",
        "[알림 추가] 버튼 → 24h 전 알림 활성화",
        "Exit — 홈으로 돌아옴, 알림 활성화 토스트 표시",
      ],
    },
    {
      name: "복약 알림 → 체크",
      steps: [
        "Entry — 정해진 시간에 복약 알림 (푸시)",
        "알림 탭 → /medications/schedule 열림",
        "복용해야 할 약 목록 확인",
        "[복용 완료] 체크박스 클릭",
        "이력에 자동 기록 + 다음 복약 시간 안내",
        "Exit — 알림 닫힘, 보호자에게 자동 공유 (옵션)",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Home — 오늘의 케어",
      description:
        "다음 진료·오늘의 복약·최근 검사 결과를 한 화면에. 의료진 메시지 알림.",
      wireframe: `+----------------------------------------------------+
| 안녕하세요, 김환자님            [알림 3] [프로필] |
+----------------------------------------------------+
| 🩺 다음 진료 (D-2)                                 |
| ──────────                                         |
| 내과 · 5/29(목) 오전 10:00 · 신촌세브란스           |
| [길찾기] [준비물 확인] [알림 추가]                  |
+----------------------------------------------------+
| 💊 오늘의 복약                          3/4 완료   |
| ──────────                                         |
| ☑ 아침 — 메트포르민 500mg                          |
| ☑ 점심 — 메트포르민 500mg                          |
| ☑ 저녁 — 메트포르민 500mg                          |
| ☐ 취침 전 — 인슐린 (D-Day 06:00 알림 예정)         |
+----------------------------------------------------+
| 📊 최근 검사 결과                                  |
| 공복혈당 102 mg/dL (정상)  HbA1c 6.4% (주의)        |
+----------------------------------------------------+`,
    },
    {
      name: "Appointments Detail",
      description: "진료 상세. 준비물·교통편·과거 진료 기록 링크.",
      wireframe: `+----------------------------------------------------+
| ← 진료 상세                                        |
+----------------------------------------------------+
| 📅 2026-05-29 (목) 오전 10:00                      |
| 신촌세브란스병원 · 내과 외래 · 304호                |
| 담당의: 김민수 교수                                 |
|                                                    |
| 📌 준비사항                                        |
| · 8시간 공복                                       |
| · 평소 복용 약 목록 지참                           |
| · 보험증 / 신분증                                   |
|                                                    |
| 🗒 지난 진료 기록 (3건) →                          |
| [변경] [취소] [길찾기]                              |
+----------------------------------------------------+`,
    },
    {
      name: "Vitals — 혈당 추이",
      description: "혈당 그래프 + 임계치 라인 + 메모 기능.",
      wireframe: `+----------------------------------------------------+
| 혈당 추이                          [주] [월] [분기] |
+----------------------------------------------------+
|     250                                            |
|     200 ▁                                          |
|     150 ▁▂▃   ─── 임계치(140)                      |
|     100 ▃▄▅▄▅▄▃▂                                   |
|      70 ─────────────── 저혈당 임계(70)            |
|         월 화 수 목 금 토 일                       |
+----------------------------------------------------+
| 평균 102 / 최고 156 / 최저 84  (단위 mg/dL)         |
| 📝 메모 추가 · 의료진에게 공유 →                    |
+----------------------------------------------------+`,
    },
  ],
  domainComponents: [
    {
      name: "PatientCard",
      variants: ["compact", "full"],
      states: ["default", "alert", "stable"],
      purpose: "환자/진료 정보를 안전하게 노출. 민감 정보는 mask 모드.",
    },
    {
      name: "MedicationScheduleRow",
      variants: ["scheduled", "taken", "missed", "snoozed"],
      states: ["default", "due-soon", "overdue"],
      purpose: "복약 시간대별 row. 체크/스누즈.",
    },
    {
      name: "VitalChart",
      variants: ["line", "bar", "range"],
      states: ["normal", "warning", "critical"],
      purpose: "건강 지표 시각화. 임계치 라인 자동 표시.",
    },
    {
      name: "AppointmentSlot",
      variants: ["available", "booked", "tentative"],
      states: ["default", "selected", "disabled"],
      purpose: "예약 슬롯 선택 UI.",
    },
    {
      name: "ConsentBadge",
      variants: ["required", "optional", "granted"],
      states: ["pending", "granted", "revoked"],
      purpose: "개인정보 동의 상태 표시 (의료법 준수).",
    },
  ],
  interactions: [
    { trigger: "응급 수치 감지", animation: "카드 외곽 1회 펄스 + 좌측 빨강 indicator", duration: "300ms", easing: "ease-out" },
    { trigger: "복약 완료 체크", animation: "체크박스 fill + 1회 scale 1.1", duration: "180ms", easing: "ease-out" },
    { trigger: "예약 변경 confirm", duration: "240ms", animation: "slide panel + dim backdrop", easing: "cubic-bezier(0.32,0.72,0,1)" },
    { trigger: "민감 정보 reveal", animation: "fade + 마스킹 해제", duration: "200ms", easing: "ease-in-out" },
    { trigger: "탭 전환", animation: "underline slide", duration: "150ms", easing: "ease-out" },
  ],
  a11yChecklist: [
    "본문 색 대비 4.5:1 이상 (의료 정보 명확성)",
    "수치는 mono 폰트 + 단위 명시 (예: 102 mg/dL)",
    "응급 알림은 색만이 아닌 아이콘 + ARIA live region",
    "민감 정보 기본 마스킹 + 보기 시 명시적 인터랙션",
    "키보드만으로 예약 변경·취소 가능",
    "스크린리더용 한국어 라벨 (의료 약어 풀어 읽기)",
    "고령 사용자 고려: 본문 16px 이상 옵션",
    "고대비 모드 토글 제공",
    "오작동 방지 — 위험 액션(취소·삭제)은 2단계 확인",
    "동의 항목은 명시적 체크 (default 체크 금지)",
    "긴 폼은 단계별 분할 + 진행률 표시",
    "포커스 visible 2px outline",
  ],
  figmaFrames: [
    "Cover · Brand & Tone",
    "IA Tree",
    "User Flow — 다음 진료 확인",
    "User Flow — 복약 알림",
    "UI Foundation — Color/Typography/Spacing",
    "Component Library (PatientCard, MedicationScheduleRow, VitalChart, AppointmentSlot, ConsentBadge)",
    "Screen — Home (오늘의 케어)",
    "Screen — Appointments Detail",
    "Screen — Vitals (혈당 추이)",
    "Empty / Loading / Error States",
    "Accessibility Audit Notes",
  ],
  // generic 단어 (예약/검사/건강) 제거하고 의료 특화 키워드만 유지
  domainKeywords: ["환자", "복약", "진료", "혈당", "혈압", "의료진", "헬스케어", "병원", "처방", "투약", "보호자", "임상"],
};

// ═══════════════════════════════════════════════════════════════
// 핀테크 (송금·자산관리)
// ═══════════════════════════════════════════════════════════════
const FINTECH: DomainProfile = {
  id: "핀테크",
  label: "핀테크 모바일 앱",
  brandShort: "신뢰·전문성·정확. 짙은 청 + 골드 액센트, 숫자 우선 디자인",
  toneDescriptors: ["전문성", "정확", "신뢰", "안정"],
  successMetrics: [
    "첫 송금 완료까지 ≤ 90초 (KYC 후)",
    "KYC 신청 → 승인 완료율 ≥ 85%",
    "보안 위협 감지 → 사용자 인지까지 ≤ 5초",
  ],
  colorTokens: [
    { name: "primary/navy-900", hex: "#0c1c3a", usage: "헤더 · 강조 CTA" },
    { name: "primary/navy-700", hex: "#1e3a8a", usage: "활성 상태" },
    { name: "accent/gold-500", hex: "#d4a373", usage: "프리미엄 · VIP 표시" },
    { name: "surface/white", hex: "#ffffff", usage: "카드 베이스" },
    { name: "surface/slate-50", hex: "#f8fafc", usage: "페이지 배경" },
    { name: "ink-500", hex: "#64748b", usage: "보조 텍스트" },
    { name: "ink-900", hex: "#0f172a", usage: "수치 · 본문" },
    { name: "status/profit", hex: "#15803d", usage: "수익 · 입금" },
    { name: "status/loss", hex: "#b91c1c", usage: "손실 · 출금" },
    { name: "status/pending", hex: "#ca8a04", usage: "보류 · 검토 중" },
    { name: "chart/asset-stock", hex: "#0ea5e9", usage: "주식 시각화" },
    { name: "chart/asset-bond", hex: "#8b5cf6", usage: "채권 시각화" },
  ],
  typographyPersonality:
    "Pretendard 또는 Inter. 수치는 tabular-nums + mono 변형. 헤딩은 700, 본문 400~500. 금액은 항상 천 단위 콤마",
  motionGuide:
    "절제. 200ms 이하. 금액 변경은 count-up. 위협 알림은 즉시 모달.",
  iaTree: `/
├── /home              ─ 자산 요약 + 빠른 송금
├── /transfer          ─ 송금
│   ├── /domestic
│   └── /international
├── /accounts          ─ 계좌 관리
├── /assets            ─ 자산 (주식·채권·예적금)
│   └── /portfolio
├── /cards             ─ 카드 (발급·관리)
├── /history           ─ 거래 내역
├── /kyc               ─ KYC (신규 가입)
└── /security
    ├── /2fa
    └── /devices`,
  personas: [
    {
      role: "20대 신규 사용자 (KYC 신청 + 첫 송금)",
      goal: "가입 → KYC → 첫 송금까지 한 번에",
      pain: "신분증 촬영 실패 · 보안 단계가 많아 이탈",
      insight: "KYC 진행률 표시 + 단계별 친절한 안내",
    },
    {
      role: "30~40대 자산 관리자",
      goal: "자산 포트폴리오를 한 화면에서 비교·재조정",
      pain: "여러 계좌·카드 통합 보기 어려움",
      insight: "통합 대시보드 + 카테고리별 색상 코드",
    },
    {
      role: "프리미엄 VIP",
      goal: "전담 매니저 채팅 + 우선 처리",
      pain: "콜센터 대기 시간",
      insight: "골드 액센트 컴포넌트 + 1:1 채널",
    },
  ],
  userFlows: [
    {
      name: "신규 KYC + 첫 송금",
      steps: [
        "Entry — 가입 직후 KYC 페이지",
        "신분증 촬영 (가이드 오버레이)",
        "얼굴 인증 (안내 음성 + 동의)",
        "계좌 인증 (1원 송금 확인)",
        "KYC 완료 토스트 → /transfer 자동 이동",
        "받는 분 / 금액 / 메모 입력",
        "보안 비밀번호 입력 → 송금 성공",
        "Exit — 성공 화면 + 거래 내역 추가",
      ],
    },
    {
      name: "자산 포트폴리오 재조정",
      steps: [
        "Entry — /assets 진입",
        "현재 비중 차트 확인 (주식 60 / 채권 30 / 현금 10)",
        "재조정 시뮬레이션 (드래그)",
        "예상 수익률 / 리스크 확인",
        "[적용] → 보안 비밀번호",
        "Exit — 재조정 완료 알림",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Home — 자산 요약",
      description: "총 자산 + 빠른 송금 + 최근 거래",
      wireframe: `+----------------------------------------------------+
| 안녕하세요, 김송금님              [알림] [프로필] |
+----------------------------------------------------+
| 💰 총 자산                              ↑ +2.3%   |
| ₩ 24,580,000                                       |
| ──────────────────────────────                     |
| 예금 12,000,000  주식 8,400,000  채권 4,180,000    |
+----------------------------------------------------+
| ⚡ 빠른 송금                                       |
| [김지인 →] [엄마 →] [부동산 임대 →] [추가 +]       |
+----------------------------------------------------+
| 📋 최근 거래 (3건)                                 |
| 5/27  카페이도 +5,000원         커피 환불          |
| 5/26  쿠팡    -42,300원         구매               |
| 5/25  김지인  -100,000원        용돈               |
+----------------------------------------------------+`,
    },
    {
      name: "Transfer — 받는 분 / 금액",
      description: "송금 화면. 보안 단계 명확.",
      wireframe: `+----------------------------------------------------+
| ← 송금                                             |
+----------------------------------------------------+
| 받는 분                                            |
| ┌────────────────────────────┐ [최근] [주소록]    |
| │ 010-XXXX-XXXX             │                     |
| └────────────────────────────┘                    |
| 금액                                               |
| ┌────────────────────────────┐                    |
| │ ₩ 100,000                  │ 잔액 12,000,000원  |
| └────────────────────────────┘                    |
| 메모                                               |
| ┌────────────────────────────┐                    |
| │ 5월 용돈                   │                    |
| └────────────────────────────┘                    |
|                                                    |
|                          [송금하기 (보안 확인)]    |
+----------------------------------------------------+`,
    },
    {
      name: "Portfolio — 자산 차트",
      description: "포트폴리오 분포 + 재조정 시뮬레이션",
      wireframe: `+----------------------------------------------------+
| 자산 포트폴리오                       [재조정]     |
+----------------------------------------------------+
|         ╭─────╮                                    |
|        │ 60%  │  주식  8,400,000원                  |
|        │ 주식 │  ────────                          |
|         ╰─────╯  채권  4,180,000원  30%             |
|         ─────                                      |
|         예금  12,000,000원  10%                     |
+----------------------------------------------------+
| 1y 수익률  +12.4% (KOSPI +8.1% 대비 +4.3%)         |
+----------------------------------------------------+`,
    },
  ],
  domainComponents: [
    { name: "AmountField", variants: ["KRW", "USD", "crypto"], states: ["default", "focus", "error", "warning"], purpose: "금액 입력. 천 단위 자동 콤마. 잔액 표시." },
    { name: "TransactionRow", variants: ["incoming", "outgoing", "pending", "refunded"], states: ["default", "expanded"], purpose: "거래 내역 row. 색상으로 in/out 즉시 인지." },
    { name: "AssetChart", variants: ["donut", "stacked-bar", "line"], states: ["realtime", "static"], purpose: "자산 분포·추이 시각화." },
    { name: "KYCStepIndicator", variants: ["linear", "circular"], states: ["pending", "active", "done", "failed"], purpose: "KYC 진행률. 단계별 명확 표시." },
    { name: "SecurityVerification", variants: ["password", "biometric", "otp"], states: ["idle", "verifying", "success", "error"], purpose: "보안 단계 통합 컴포넌트." },
  ],
  interactions: [
    { trigger: "송금 성공", animation: "체크 아이콘 + 카운트업 잔액", duration: "400ms", easing: "ease-out" },
    { trigger: "금액 입력", animation: "tabular-nums 즉시 반영", duration: "0ms", easing: "linear" },
    { trigger: "보안 비번 실패", animation: "shake (-4 → +4 → 0)", duration: "240ms", easing: "ease-in-out" },
    { trigger: "포트폴리오 드래그", animation: "donut slice 비율 실시간", duration: "0ms", easing: "linear" },
    { trigger: "위협 감지 모달", animation: "scale 0.96 → 1.0 + dim", duration: "200ms", easing: "cubic-bezier(0.32,0.72,0,1)" },
  ],
  a11yChecklist: [
    "금액은 tabular-nums + 통화 단위 ARIA label",
    "보안 입력 필드는 password type + show/hide 토글",
    "거래 in/out은 색만 아닌 +/- 부호 표시",
    "KYC 단계 진행률 ARIA live region",
    "위협 알림은 즉시 모달 + 스크린리더 announcing",
    "키보드만으로 송금 가능 (Tab 순서 명확)",
    "본문 색 대비 4.5:1 이상",
    "금액 입력 시 천 단위 콤마 announcing",
    "에러 메시지는 필드 옆 명시 + 자동 포커스 이동",
    "장시간 미사용 자동 로그아웃 + 사전 알림",
    "전자서명·생체인증 fallback (비밀번호)",
    "포커스 visible 2px outline (특히 금액 필드)",
  ],
  figmaFrames: [
    "Cover · Brand (Navy + Gold)",
    "IA Tree",
    "User Flow — KYC + 첫 송금",
    "User Flow — 자산 재조정",
    "UI Foundation — Color/Typography (tabular-nums)",
    "Component Library (AmountField, TransactionRow, AssetChart, KYCStepIndicator, SecurityVerification)",
    "Screen — Home (자산 요약)",
    "Screen — Transfer (송금)",
    "Screen — Portfolio (자산 차트)",
    "Empty / Loading / Error States",
    "Security & Threat Modals",
  ],
  // generic 단어 (카드/거래/보안/수익) 제거. 금융 특화 키워드만 유지
  domainKeywords: ["송금", "계좌", "자산", "포트폴리오", "주식", "채권", "예금", "KYC", "핀테크", "금융", "환율", "외환", "시세"],
};

// ═══════════════════════════════════════════════════════════════
// 이커머스 (패션 모바일)
// ═══════════════════════════════════════════════════════════════
const ECOMMERCE: DomainProfile = {
  id: "이커머스",
  label: "패션 이커머스 모바일 앱",
  brandShort: "MZ 타겟, 인스타그램 비주얼, 컬러 임팩트 + 큐레이션",
  toneDescriptors: ["트렌디", "활발", "큐레이션", "비주얼 강조"],
  successMetrics: [
    "홈 → 상품 상세 평균 클릭 깊이 ≤ 2",
    "장바구니 추가 → 결제 완료율 ≥ 28%",
    "큐레이션 카드 CTR ≥ 7%",
  ],
  colorTokens: [
    { name: "primary/coral-500", hex: "#ff6b6b", usage: "주요 CTA · 가격 강조" },
    { name: "primary/pink-500", hex: "#ec4899", usage: "프로모션 · 핫딜" },
    { name: "accent/black", hex: "#0a0a0a", usage: "헤더 · 강조" },
    { name: "surface/white", hex: "#ffffff", usage: "상품 카드 베이스" },
    { name: "surface/cream", hex: "#fff7ed", usage: "큐레이션 섹션" },
    { name: "ink-500", hex: "#737373", usage: "보조 텍스트" },
    { name: "ink-900", hex: "#171717", usage: "상품명 · 본문" },
    { name: "status/sale", hex: "#dc2626", usage: "세일 · 한정" },
    { name: "status/new", hex: "#10b981", usage: "신상품" },
    { name: "status/lowstock", hex: "#f59e0b", usage: "재고 부족" },
    { name: "brand/instagram-grad", hex: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", usage: "SNS 공유 액션" },
  ],
  typographyPersonality:
    "Pretendard. 헤딩은 800 (impact), 본문 400. 가격은 700 + 큰 size. 이모지 적극 사용",
  motionGuide:
    "활발. 200~400ms. 카드 hover scale, 장바구니 추가 시 floating 애니메이션. 핫딜 카운트다운 펄스.",
  iaTree: `/
├── /home              ─ 큐레이션 + 핫딜
├── /category          ─ 카테고리 (의류·신발·잡화)
│   └── /:type
├── /search            ─ 검색 + 필터
├── /product/:id       ─ 상품 상세
│   └── /reviews
├── /cart              ─ 장바구니
├── /checkout          ─ 결제
│   ├── /address
│   └── /payment
├── /mypage
│   ├── /orders
│   ├── /reviews
│   └── /wishlist
└── /promotion/:code   ─ 프로모션 페이지`,
  personas: [
    {
      role: "MZ 쇼퍼 (20대 후반, SNS 영향력 큼)",
      goal: "트렌디한 아이템을 빠르게 발견 + 구매",
      pain: "선택지가 많아 결정 피로",
      insight: "큐레이션 + '나와 비슷한 사람들이 산' 추천",
    },
    {
      role: "구매 비교형 (30대, 가성비 추구)",
      goal: "여러 상품을 비교 + 리뷰 정독 후 구매",
      pain: "리뷰 신뢰도 / 사진 왜곡",
      insight: "사이즈 표 + 실제 착용 사진 + 키/체형 표시 리뷰",
    },
    {
      role: "셀러 (입점 브랜드)",
      goal: "상품 등록 + 노출 + 판매 분석",
      pain: "이미지 등록 번거로움",
      insight: "AI 배경 제거 + 자동 카테고리 분류",
    },
  ],
  userFlows: [
    {
      name: "큐레이션 발견 → 구매",
      steps: [
        "Entry — 홈 진입 (큐레이션 카드 4개)",
        "“이번 주 인기 코디” 카드 클릭",
        "큐레이션 상세 (6개 아이템)",
        "마음에 드는 1개 → 상품 상세",
        "리뷰 (5건) 빠르게 스캔 + 사이즈 표 확인",
        "장바구니 추가 (floating 애니메이션)",
        "[결제하기] → 주소·결제 단계",
        "Exit — 주문 완료 + 카운트다운 (배송 예정)",
      ],
    },
    {
      name: "검색 → 필터 → 정렬",
      steps: [
        "Entry — 검색바 ‘블랙 셔츠’",
        "결과 화면 (240건)",
        "[필터] 사이즈·색상·가격대",
        "필터 적용 (32건)",
        "정렬 ‘리뷰 많은순’",
        "상품 카드 그리드 → 상품 상세",
        "Exit — 장바구니 또는 위시리스트",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Home — 큐레이션 그리드",
      description: "이번 주 인기 코디 + 핫딜 카운트다운",
      wireframe: `+----------------------------------------------------+
| FASHION                          [검색] [장바구니]  |
+----------------------------------------------------+
| 🔥 핫딜 — 오늘 23:59까지                            |
| ┌──────────┐ ┌──────────┐ ┌──────────┐             |
| │ 50% OFF  │ │ 40% OFF  │ │ 30% OFF  │             |
| │ 셔츠 19,900│ │ 팬츠 29,900│ │ 가방 49,900│           |
| └──────────┘ └──────────┘ └──────────┘             |
+----------------------------------------------------+
| ✨ 이번 주 인기 코디                                |
| ┌─────────────┐  ┌─────────────┐                  |
| │ [코디 이미지]│  │ [코디 이미지]│                  |
| │ 봄 캐주얼    │  │ 미니멀 룩    │                  |
| │ 4 items     │  │ 5 items     │                  |
| └─────────────┘  └─────────────┘                  |
+----------------------------------------------------+
| 👀 당신이 좋아할 만한                               |
| ┌────┐ ┌────┐ ┌────┐ ┌────┐                       |
| │ 상품│ │ 상품│ │ 상품│ │ 상품│                       |
| └────┘ └────┘ └────┘ └────┘                       |
+----------------------------------------------------+`,
    },
    {
      name: "Product Detail",
      description: "이미지 갤러리 + 사이즈 + 리뷰 + 장바구니 추가",
      wireframe: `+----------------------------------------------------+
| ← 상품                          [♥] [공유]          |
+----------------------------------------------------+
|   ┌──────────────────┐                              |
|   │   [상품 이미지]  │  • • • • (4)                |
|   └──────────────────┘                              |
+----------------------------------------------------+
| 미니멀 오버사이즈 셔츠                              |
| ₩39,000  ~~49,000~~  20% 할인                       |
| ⭐ 4.7 (1,234) 리뷰                                  |
+----------------------------------------------------+
| 사이즈   [S] [M] [L] [XL]                           |
| 색상     [● 블랙] [○ 화이트] [○ 베이지]              |
+----------------------------------------------------+
| 📝 리뷰 (사이즈 정보 포함) →                        |
| 👤 170cm / 60kg — M 추천                            |
| “생각보다 핏이 좋아요”                              |
+----------------------------------------------------+
| [장바구니]              [바로 구매]                  |
+----------------------------------------------------+`,
    },
    {
      name: "Cart",
      description: "장바구니 + 추천 + 결제 진입",
      wireframe: `+----------------------------------------------------+
| 장바구니 (3)                                       |
+----------------------------------------------------+
| ☑ [이미지] 미니멀 셔츠   M  ₩39,000   [수량 1 ▾]  |
| ☑ [이미지] 슬랙스        L  ₩59,000   [수량 1 ▾]  |
| ☐ [이미지] 토트백        ─  ₩89,000   [수량 1 ▾]  |
+----------------------------------------------------+
| 함께 사면 좋은 →                                    |
| ┌────┐ ┌────┐                                      |
| │ 양말│ │ 모자│                                      |
| └────┘ └────┘                                      |
+----------------------------------------------------+
| 총 결제 금액               ₩98,000                  |
| (배송비 무료)                                      |
|                            [결제하기]               |
+----------------------------------------------------+`,
    },
  ],
  domainComponents: [
    { name: "ProductCard", variants: ["grid", "horizontal", "compact"], states: ["default", "wishlisted", "soldout"], purpose: "상품 카드. 가격·할인·태그 강조." },
    { name: "PriceTag", variants: ["regular", "discounted", "hot-deal"], states: ["default", "ending-soon"], purpose: "가격 + 할인율 + 카운트다운." },
    { name: "SizeSelector", variants: ["fashion", "shoes"], states: ["available", "out-of-stock", "selected"], purpose: "사이즈 선택. 재고 표시." },
    { name: "ReviewCard", variants: ["text", "photo", "fit-info"], states: ["default", "verified", "helpful"], purpose: "리뷰 + 키/체형 정보." },
    { name: "CartItem", variants: ["normal", "low-stock", "out-of-stock"], states: ["default", "removed"], purpose: "장바구니 항목 + 수량 조절." },
  ],
  interactions: [
    { trigger: "장바구니 추가", animation: "상품 이미지 → 장바구니 아이콘으로 floating", duration: "400ms", easing: "ease-out" },
    { trigger: "핫딜 카운트다운", animation: "초 단위 펄스 (마지막 30초 빠르게)", duration: "1000ms loop", easing: "ease-in-out" },
    { trigger: "상품 카드 hover", animation: "scale 1.0 → 1.02 + shadow grow", duration: "200ms", easing: "ease-out" },
    { trigger: "위시리스트 ♥", animation: "scale 1.0 → 1.3 → 1.0 + heart fill", duration: "300ms", easing: "spring(1.5)" },
    { trigger: "이미지 갤러리 스와이프", animation: "translateX + indicator", duration: "250ms", easing: "cubic-bezier(0.32,0.72,0,1)" },
  ],
  a11yChecklist: [
    "상품 이미지 alt 텍스트 (제품명 + 색상)",
    "가격은 통화 단위 ARIA label",
    "할인율·카운트다운 ARIA live (assertive 아님, polite)",
    "장바구니 수량 변경 announcing",
    "사이즈/색상 선택은 라디오 그룹",
    "리뷰 별점 ARIA value (4.7 of 5)",
    "키보드만으로 결제 가능",
    "본문 색 대비 4.5:1, 가격 5:1 이상",
    "장바구니 추가 토스트 4초 (충분히 읽을 시간)",
    "상품 카드 hover 효과는 키보드 focus에도",
    "포커스 visible 2px outline",
    "재고 부족 색만 아닌 텍스트 명시 ('재고 3개')",
  ],
  figmaFrames: [
    "Cover · Brand (Coral + Black)",
    "IA Tree",
    "User Flow — 큐레이션 → 구매",
    "User Flow — 검색 → 필터",
    "UI Foundation — Color/Typography (Impact)",
    "Component Library (ProductCard, PriceTag, SizeSelector, ReviewCard, CartItem)",
    "Screen — Home (큐레이션)",
    "Screen — Product Detail",
    "Screen — Cart",
    "Empty Cart / Sold Out / Error States",
    "Promotion Modals",
  ],
  // generic 단어 (상품/결제/리뷰/사이즈/할인) 제거. 커머스 특화 키워드만 유지
  domainKeywords: ["장바구니", "큐레이션", "이커머스", "쇼핑", "핫딜", "위시리스트", "패션", "셀러", "구매"],
};

// ═══════════════════════════════════════════════════════════════
// 어드민 / B2B (사내 어드민 데이터 테이블 위주)
// ═══════════════════════════════════════════════════════════════
const ADMIN: DomainProfile = {
  id: "어드민",
  label: "엔터프라이즈 어드민 콘솔",
  brandShort: "차분한 엔터프라이즈 톤. 데이터 밀도 우선, 키보드 친화",
  toneDescriptors: ["엔터프라이즈", "효율", "차분", "구조적"],
  successMetrics: [
    "테이블 100건 페이지에서 평균 작업 완료 ≤ 30초",
    "키보드 only 작업 가능 비율 ≥ 95%",
    "필터 / 정렬 / 일괄 액션 발견율 ≥ 80%",
  ],
  colorTokens: [
    { name: "primary/blue-600", hex: "#2563eb", usage: "주요 CTA · 활성 row" },
    { name: "primary/blue-50", hex: "#eff6ff", usage: "선택된 row 배경" },
    { name: "accent/violet-500", hex: "#8b5cf6", usage: "어드민 권한 표시" },
    { name: "surface/white", hex: "#ffffff", usage: "테이블 row" },
    { name: "surface/slate-50", hex: "#f8fafc", usage: "헤더 / zebra" },
    { name: "ink-300", hex: "#cbd5e1", usage: "테이블 보더" },
    { name: "ink-500", hex: "#64748b", usage: "보조 텍스트" },
    { name: "ink-900", hex: "#0f172a", usage: "본문" },
    { name: "status/active", hex: "#16a34a", usage: "활성 / 정상" },
    { name: "status/paused", hex: "#ca8a04", usage: "일시중지" },
    { name: "status/error", hex: "#dc2626", usage: "에러 / 실패" },
    { name: "data/highlight", hex: "#fef3c7", usage: "검색 강조" },
  ],
  typographyPersonality:
    "Pretendard 또는 Inter. 헤딩 600, 본문 400. 데이터 셀은 tabular-nums + 13px (밀도). 검색 강조는 bold + bg",
  motionGuide:
    "절제. 100~200ms. 자동 전환·애니메이션 최소화. 데이터 변경은 즉시 반영.",
  iaTree: `/
├── /dashboard         ─ 핵심 지표 + 최근 활동
├── /users             ─ 사용자 (목록·생성·권한)
│   └── /:id
├── /organizations     ─ 조직 / 팀
├── /resources         ─ 리소스 관리
│   ├── /servers
│   └── /databases
├── /logs              ─ 시스템 로그 (실시간)
├── /audit             ─ 감사 로그
├── /reports           ─ 리포트 / Export
└── /settings
    ├── /roles
    └── /api-keys`,
  personas: [
    {
      role: "데이터 분석가 (40대, 매일 사용)",
      goal: "수십 페이지 테이블에서 특정 row를 빠르게 찾고 일괄 처리",
      pain: "필터·정렬·검색이 분산, 키보드 단축키 부족",
      insight: "Cmd+K 통합 검색 / 컬럼 단위 필터 / 키보드 navigation",
    },
    {
      role: "운영자 (24/7 모니터링)",
      goal: "실시간 알림 + 빠른 조치",
      pain: "알림 누락, 화면 전환 부담",
      insight: "단일 대시보드 + 임계치 기반 알림 + 인라인 액션",
    },
    {
      role: "시스템 관리자 (권한 부여)",
      goal: "역할별 권한 정확히 부여 + 감사 추적",
      pain: "권한 매트릭스 복잡",
      insight: "역할 템플릿 + 변경 이력 자동 감사",
    },
  ],
  userFlows: [
    {
      name: "사용자 일괄 비활성화",
      steps: [
        "Entry — /users 진입",
        "필터: 마지막 로그인 > 90일",
        "결과 142명 — 컬럼 정렬",
        "헤더 체크박스로 전체 선택",
        "[일괄 액션] → 비활성화",
        "확인 모달 (영향 받는 시스템 표시)",
        "[확인] → 진행 progress",
        "Exit — 완료 토스트 + 감사 로그 자동 기록",
      ],
    },
    {
      name: "임계치 알림 → 조치",
      steps: [
        "Entry — 대시보드에 빨강 알림 (CPU 95%)",
        "알림 클릭 → /resources/servers/:id",
        "실시간 그래프 확인",
        "[프로세스 보기] 인라인 모달",
        "특정 프로세스 [Kill]",
        "확인 + 보안 비밀번호",
        "Exit — 정상 복귀 알림 + 감사 로그",
      ],
    },
  ],
  sampleScreens: [
    {
      name: "Dashboard",
      description: "KPI + 실시간 알림 + 최근 활동",
      wireframe: `+----------------------------------------------------+
| Admin · Acme Corp                  [⌘K] [👤]      |
+----------------------------------------------------+
| Sidebar       │ KPI Cards                          |
|               │ ┌──────┐ ┌──────┐ ┌──────┐         |
| Dashboard ◀   │ │Users  │ │Active│ │Errors│         |
| Users         │ │ 12,420│ │  98%│ │   3  │         |
| Resources     │ └──────┘ └──────┘ └──────┘         |
| Logs          │ ───────────────────────             |
| Audit         │ Alerts (3)                         |
| Reports       │ 🔴 server-04 CPU 95% [Investigate]│
| Settings      │ 🟡 disk-7 80% used                 |
|               │ 🟢 backup completed                |
+----------------------------------------------------+`,
    },
    {
      name: "Users — 데이터 테이블",
      description: "필터·정렬·일괄 액션",
      wireframe: `+----------------------------------------------------+
| Users  (12,420)              [+ New] [⌘K Search] |
+----------------------------------------------------+
| Filter: [All] [Active] [Inactive] [Admin]          |
| ───────────────────────────────────────            |
| ☐  ID    Name           Email          Role   LastLogin
| ☐ 0001  Alice Park     a@acme.com     Admin   2h ago
| ☐ 0002  Bob Kim        b@acme.com     Member  1d ago
| ☑ 0003  Carol Lee      c@acme.com     Member  92d ago
| ☑ 0004  Dan Choi       d@acme.com     Member  120d ago
| ───────────────────────────────────────            |
| 2 selected  [Activate] [Deactivate] [Delete]       |
+----------------------------------------------------+`,
    },
    {
      name: "Resource Detail",
      description: "리소스 모니터링 + 인라인 액션",
      wireframe: `+----------------------------------------------------+
| ← Resources / server-04                            |
+----------------------------------------------------+
| 🔴 CPU 95%  RAM 72%  Disk 45%  Network 320 MB/s    |
+----------------------------------------------------+
| CPU History (last 1h)                              |
|    100  ──▁▂▃▄▅▆▇▇█████▇▆▅▄  ─── 95% threshold     |
|     50  ──                                         |
|      0  ──                                         |
+----------------------------------------------------+
| Top Processes                                      |
| PID    Name              CPU    Action             |
| 1042   ingestion-worker  68%    [Kill] [Restart]   |
| 1086   reporter          14%    [Kill] [Restart]   |
+----------------------------------------------------+`,
    },
  ],
  domainComponents: [
    { name: "DataTable", variants: ["dense", "comfortable"], states: ["default", "loading", "empty", "error"], purpose: "데이터 테이블. 정렬·필터·선택·일괄 액션." },
    { name: "FilterBar", variants: ["inline", "drawer"], states: ["collapsed", "expanded", "applied"], purpose: "다중 필터. 적용 시 칩 표시." },
    { name: "BulkActionBar", variants: ["floating", "sticky"], states: ["hidden", "visible"], purpose: "N개 선택 시 등장하는 액션 바." },
    { name: "StatusBadge", variants: ["dot", "pill", "label"], states: ["active", "paused", "error", "unknown"], purpose: "상태 표시 (색 + 텍스트 병행)." },
    { name: "CommandPalette", variants: ["modal"], states: ["closed", "open", "searching", "results"], purpose: "⌘K 통합 검색 / 액션 실행." },
  ],
  interactions: [
    { trigger: "테이블 row hover", animation: "bg fade", duration: "100ms", easing: "ease-out" },
    { trigger: "row 선택", animation: "체크박스 + bg highlight", duration: "120ms", easing: "ease-out" },
    { trigger: "일괄 액션 바 등장", animation: "slide-up from bottom", duration: "200ms", easing: "cubic-bezier(0.32,0.72,0,1)" },
    { trigger: "⌘K 열기", animation: "scale + dim backdrop", duration: "180ms", easing: "ease-out" },
    { trigger: "알림 발생", animation: "사이드바 알림 dot 펄스", duration: "1500ms loop", easing: "ease-in-out" },
  ],
  a11yChecklist: [
    "테이블 헤더 sticky + 스크린리더 row/col 인식",
    "키보드만으로 정렬·필터·선택 가능 (Tab + Space + Arrow)",
    "⌘K 단축키 공개 (도움말 1회 노출)",
    "일괄 액션은 위험도별 색 + 확인 모달",
    "감사 로그는 자동 기록 + 사용자에게 ARIA announcing",
    "본문 색 대비 4.5:1, 데이터 셀 4.5:1 이상",
    "활성/비활성 상태는 색만 아닌 텍스트 + 아이콘",
    "긴 텍스트 셀은 ellipsis + tooltip on focus",
    "Empty/Loading/Error 상태 3종 모두 제공",
    "포커스 visible 2px outline (테이블 row도)",
    "오류 메시지는 필드 옆 inline + 자동 announcing",
    "Cmd+Z 같은 위험 액션 되돌리기 (가능한 경우)",
  ],
  figmaFrames: [
    "Cover · Brand (Blue + Slate)",
    "IA Tree",
    "User Flow — 사용자 일괄 비활성화",
    "User Flow — 임계치 알림 조치",
    "UI Foundation — Color/Typography (data density)",
    "Component Library (DataTable, FilterBar, BulkActionBar, StatusBadge, CommandPalette)",
    "Screen — Dashboard",
    "Screen — Users Table",
    "Screen — Resource Detail",
    "Empty / Loading / Error States",
    "Command Palette States",
  ],
  // 가장 generic. "사용자/데이터/권한/운영/관리자/테이블"이 다른 도메인 문서에도 너무 자주 나옴
  // 어드민 특화 키워드만 유지
  domainKeywords: ["어드민", "백오피스", "감사 로그", "일괄 액션", "DataTable", "리소스 모니터링", "권한 매트릭스"],
};

// ═══════════════════════════════════════════════════════════════
// SaaS — 일반 (generic 폴백 + saas 도메인 명시 시)
// ═══════════════════════════════════════════════════════════════
const SAAS_GENERIC: DomainProfile = {
  id: "saas",
  label: "SaaS 프로덕트",
  brandShort: "엔터프라이즈 SaaS, 미니멀 + 가독성",
  toneDescriptors: ["전문성", "미니멀", "기능 명확"],
  successMetrics: [
    "온보딩 완료율 ≥ 70%",
    "주요 기능 첫 사용까지 ≤ 5분",
    "DAU/MAU ≥ 30%",
  ],
  colorTokens: [
    { name: "primary/indigo-500", hex: "#6366f1", usage: "주요 CTA" },
    { name: "primary/indigo-50", hex: "#eef2ff", usage: "강조 배경" },
    { name: "accent/cyan-500", hex: "#06b6d4", usage: "활성 / 강조" },
    { name: "surface/white", hex: "#ffffff", usage: "카드 베이스" },
    { name: "surface/gray-50", hex: "#f9fafb", usage: "페이지 배경" },
    { name: "ink-300", hex: "#d1d5db", usage: "보더" },
    { name: "ink-500", hex: "#6b7280", usage: "보조 텍스트" },
    { name: "ink-900", hex: "#111827", usage: "본문" },
    { name: "status/success", hex: "#10b981", usage: "성공" },
    { name: "status/warning", hex: "#f59e0b", usage: "경고" },
    { name: "status/error", hex: "#ef4444", usage: "에러" },
  ],
  typographyPersonality: "Pretendard 또는 Inter. 헤딩 600, 본문 400. 가독성 우선",
  motionGuide: "절제. 150~240ms. 페이지 전환은 fade.",
  iaTree: `/
├── /home          ─ 핵심 기능 진입
├── /workspace
│   └── /:id
├── /reports
├── /integrations
├── /billing
└── /settings
    └── /team`,
  personas: [
    { role: "팀 리드", goal: "팀 전체 진행 상황을 한눈에", pain: "분산된 도구", insight: "통합 대시보드" },
    { role: "신규 사용자", goal: "5분 안에 첫 가치 경험", pain: "복잡한 온보딩", insight: "단계별 가이드" },
    { role: "파워 유저", goal: "단축키와 자동화로 효율화", pain: "반복 작업", insight: "Cmd+K + 매크로" },
  ],
  userFlows: [
    {
      name: "온보딩 → 첫 기능 사용",
      steps: ["가입", "워크스페이스 생성", "팀원 초대 (선택)", "샘플 데이터로 첫 액션", "성공 경험", "Exit"],
    },
    {
      name: "리포트 생성 → 공유",
      steps: ["/reports 진입", "템플릿 선택", "데이터 소스 연결", "프리뷰", "Export / 공유", "Exit"],
    },
  ],
  sampleScreens: [
    {
      name: "Home",
      description: "핵심 기능 진입점",
      wireframe: `+----------------------------------------------------+
| SaaS · Workspace                       [profile] |
+----------------------------------------------------+
| Sidebar    │ Welcome back, Lee                    |
| Home◀      │ ──                                    |
| Workspace  │ Quick Actions                         |
| Reports    │ [New Report] [Invite] [Connect Data] |
| Settings   │                                       |
|            │ Recent Activity                       |
|            │ ...                                   |
+----------------------------------------------------+`,
    },
    {
      name: "Workspace Detail",
      description: "단일 워크스페이스 작업 화면",
      wireframe: `+----------------------------------------------------+
| ← Workspace / Acme Q2                              |
+----------------------------------------------------+
| Tabs: [Overview] [Tasks] [Reports] [Members]       |
| ──                                                  |
| Content area ...                                   |
+----------------------------------------------------+`,
    },
    {
      name: "Reports",
      description: "리포트 생성 + Export",
      wireframe: `+----------------------------------------------------+
| Reports                          [+ New Report]    |
+----------------------------------------------------+
| Templates: [Sales] [Usage] [Custom]                |
| ──                                                  |
| Preview area + Export options                      |
+----------------------------------------------------+`,
    },
  ],
  domainComponents: [
    { name: "WorkspaceCard", variants: ["compact", "detailed"], states: ["default", "active", "archived"], purpose: "워크스페이스 카드." },
    { name: "OnboardingStep", variants: ["linear", "circular"], states: ["pending", "active", "done"], purpose: "온보딩 단계 표시." },
    { name: "IntegrationTile", variants: ["small", "large"], states: ["available", "connected", "error"], purpose: "외부 도구 연결 타일." },
    { name: "ReportPreview", variants: ["table", "chart"], states: ["loading", "ready", "empty"], purpose: "리포트 미리보기." },
  ],
  interactions: [
    { trigger: "카드 hover", animation: "translateY -2px + shadow", duration: "200ms", easing: "ease-out" },
    { trigger: "온보딩 단계 완료", animation: "체크 + 다음 단계 unfold", duration: "300ms", easing: "ease-out" },
    { trigger: "Integration 연결", animation: "Connected 토스트 + 아이콘 색 변경", duration: "240ms", easing: "ease-in-out" },
    { trigger: "리포트 export", animation: "progress bar + 완료 모달", duration: "변동", easing: "linear" },
    { trigger: "사이드바 토글", animation: "width transition", duration: "180ms", easing: "cubic-bezier(0.32,0.72,0,1)" },
  ],
  a11yChecklist: [
    "본문 색 대비 4.5:1 이상",
    "키보드만으로 모든 기능 접근",
    "포커스 visible 2px outline",
    "에러 메시지는 inline + 자동 announcing",
    "모달은 focus trap + Escape",
    "사이드바 nav aria-current",
    "동적 콘텐츠 aria-live",
    "온보딩 단계는 ARIA progress",
    "스크린리더용 라벨 (한국어)",
    "고대비 모드 호환",
  ],
  figmaFrames: [
    "Cover · Brand",
    "IA Tree",
    "User Flow — Onboarding",
    "User Flow — Report",
    "UI Foundation",
    "Component Library",
    "Screen — Home",
    "Screen — Workspace",
    "Screen — Reports",
    "Empty / Loading / Error States",
  ],
  // SaaS는 product type이지 domain이 아니므로 keywords에서 제외.
  // (productType 필드로 따로 분류됨)
  domainKeywords: ["워크스페이스", "리포트", "온보딩 단계"],
};

// ═══════════════════════════════════════════════════════════════
// Generic — 도메인 미지정 시 fallback
// ═══════════════════════════════════════════════════════════════
const GENERIC: DomainProfile = {
  ...SAAS_GENERIC,
  id: "unknown",
  label: "일반 프로덕트 (도메인 미지정)",
  brandShort:
    "도메인이 명시되지 않아 일반 SaaS 톤으로 작성. 사용자 도메인 확정 후 재실행 권장",
  domainKeywords: [],
};

// ═══════════════════════════════════════════════════════════════
// 매핑
// ═══════════════════════════════════════════════════════════════
const PROFILES: Record<Domain, DomainProfile> = {
  헬스케어: HEALTHCARE,
  핀테크: FINTECH,
  이커머스: ECOMMERCE,
  어드민: ADMIN,
  saas: SAAS_GENERIC,
  교육: GENERIC, // TODO: 별도 프로필
  엔터테인먼트: GENERIC, // TODO: 별도 프로필
  unknown: GENERIC,
};

export function getDomainProfile(domain?: Domain): DomainProfile {
  return PROFILES[domain ?? "unknown"] ?? GENERIC;
}

/**
 * 도메인 fit 검증.
 *
 * 누출 카운트에서 제외할 것:
 *   - **saas** profile — productType이지 domain이 아님. 같은 의미.
 *   - 자기 자신과 unknown
 */
const NON_DOMAIN_PROFILES: Domain[] = ["saas", "unknown"];

export function countDomainKeywords(
  text: string,
  domain: Domain,
): {
  domainHits: number;
  otherDomainHits: number;
  details: Record<string, number>;
} {
  const lower = text.toLowerCase();
  const profile = getDomainProfile(domain);
  const domainHits = profile.domainKeywords.reduce((sum, kw) => {
    const matches = lower.split(kw.toLowerCase()).length - 1;
    return sum + matches;
  }, 0);

  // 다른 도메인 키워드 누출 카운트 (productType은 제외)
  const others = (Object.keys(PROFILES) as Domain[])
    .filter((d) => d !== domain && !NON_DOMAIN_PROFILES.includes(d))
    .map((d) => PROFILES[d]);
  const details: Record<string, number> = {};
  let otherDomainHits = 0;
  for (const p of others) {
    const hits = p.domainKeywords.reduce((sum, kw) => {
      const matches = lower.split(kw.toLowerCase()).length - 1;
      return sum + matches;
    }, 0);
    if (hits > 0) details[p.id] = hits;
    otherDomainHits += hits;
  }
  return { domainHits, otherDomainHits, details };
}
