/**
 * MOCK: 샌드박스 프리셋.
 *
 * 사용자가 빈 화면 앞에서 막막하지 않도록 미리 준비된 시나리오를 카드로 제공.
 * 클릭 → 프롬프트 자동 입력 → 사용자가 [실행] 누르면 시각화 시작.
 *
 * 실제 운영 시 이 파일은 그대로 둬도 무방 — 프리셋 자체는 정적 콘텐츠.
 * 다만 production에서는 DB 또는 CMS에서 가져오는 게 자연스럽다.
 *
 * UX/UI 카테고리를 우선 강화 (recommended: true).
 * 다른 카테고리는 다른 작업자가 채울 예정.
 */

export type PresetCategory = "ux-ui" | "report" | "infra" | "edge-case";

/**
 * Edge-case 시나리오 ─ 시스템 robustness 검증용.
 * 정보 부족 / 모호 / 무관 입력에 어떻게 반응하는지 시연한다.
 */

export interface SandboxPreset {
  id: string;
  category: PresetCategory;
  title: string;
  /** 카드 본문 짧은 설명 */
  description: string;
  /** 클릭 시 프롬프트 입력창에 들어갈 텍스트 */
  prompt: string;
  /** 매칭되어야 하는 Work Unit (검증용) */
  expectedWorkUnit: string;
  /** 카드 우상단 배지 텍스트 */
  badge: string;
  /** 강조 표시 */
  recommended?: boolean;
  /** 아이콘 이모지 (lucide 아이콘 사용하기 전 간단 처리) */
  emoji: string;
}

export const SANDBOX_PRESETS: SandboxPreset[] = [
  // ─────────── UX/UI (강조 영역) ───────────
  {
    id: "saas-healthcare-dashboard",
    category: "ux-ui",
    title: "헬스케어 SaaS 환자 대시보드",
    description:
      "데스크탑 우선. 차분한 톤. UX 흐름 → IA → UI Foundation → 컴포넌트 스펙 → Figma 핸드오프까지.",
    prompt:
      "신규 헬스케어 SaaS의 환자 대시보드를 기획해줘. 데스크탑 우선, 차분한 톤. UX 흐름과 IA, UI Foundation, 컴포넌트 스펙, Figma 핸드오프 문서까지 풀세트로 만들어줘.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "UX/UI · Healthcare",
    recommended: true,
    emoji: "🩺",
  },
  {
    id: "ecommerce-mobile-redesign",
    category: "ux-ui",
    title: "패션 이커머스 모바일 리디자인",
    description:
      "MZ 타겟. 인스타그램 비주얼 톤. 사용자 플로우 + IA + 핸드오프 문서.",
    prompt:
      "기존 패션 이커머스 모바일 앱을 리디자인하려고 해. MZ 타겟이고 인스타그램 스러운 비주얼 톤을 가져가고 싶어. 사용자 플로우랑 IA 다시 잡고, 핸드오프 문서까지 만들어줘.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "UX/UI · Commerce",
    recommended: true,
    emoji: "🛍️",
  },
  {
    id: "fintech-onboarding-flow",
    category: "ux-ui",
    title: "핀테크 신규 사용자 온보딩",
    description:
      "KYC → 첫 송금 → 카드 발급. 디자인 파운데이션 + 핸드오프 풀세트.",
    prompt:
      "핀테크 신규 사용자 온보딩 화면을 만들어줘. KYC → 첫 송금 → 카드 발급까지의 사용자 플로우를 한번에 잡고, 디자인 파운데이션도 정의해줘. 핸드오프 문서까지 풀세트로.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "UX/UI · Fintech",
    recommended: true,
    emoji: "💳",
  },
  {
    id: "internal-tool-redesign",
    category: "ux-ui",
    title: "사내 어드민 리디자인",
    description:
      "엔터프라이즈 어드민 IA 재정리 + 디자인 시스템 토큰 정의 + 핸드오프.",
    prompt:
      "사내 어드민 툴을 리디자인하려고 해. 엔터프라이즈 톤, 데이터 테이블 위주. IA 재정리, 디자인 시스템 토큰 정의, 컴포넌트 스펙, 핸드오프 문서까지 만들어줘.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "UX/UI · B2B",
    emoji: "🗂️",
  },

  // ─────────── Report (다른 작업자 영역) ───────────
  {
    id: "saas-kickoff-report",
    category: "report",
    title: "신규 프로젝트 착수보고서",
    description:
      "B2B SaaS · 6주 일정 · 리스크 체크리스트 포함. (다른 작업자 강화 예정)",
    prompt:
      "신규 B2B SaaS 프로젝트 착수보고서를 작성해줘. 6주 일정, 5명 팀, 리스크 체크리스트 포함.",
    expectedWorkUnit: "kickoff-report-workunit",
    badge: "Report",
    emoji: "📋",
  },

  // ─────────── Infra (다른 작업자 영역) ───────────
  {
    id: "vercel-cicd-setup",
    category: "infra",
    title: "Vercel CI/CD 셋업",
    description:
      "Next.js + GitHub Actions + 프리뷰 배포. (다른 작업자 강화 예정)",
    prompt:
      "Next.js 프로젝트의 Vercel 배포를 위한 CI/CD를 셋업해줘. GitHub Actions + 프리뷰 배포 + 릴리즈 노트 자동화까지.",
    expectedWorkUnit: "cicd-setup-workunit",
    badge: "Infra",
    emoji: "🚀",
  },

  // ─────────── Edge-case (Robustness 시연) ───────────
  {
    id: "diagnostic-vague",
    category: "edge-case",
    title: "모호한 입력",
    description:
      "도메인·톤·범위 모두 누락. Clarifying Question이 발동되는지 시연.",
    prompt: "디자인해줘",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Edge · Vague",
    emoji: "❓",
  },
  {
    id: "diagnostic-partial",
    category: "edge-case",
    title: "정보 일부 누락",
    description:
      "도메인만 있고 톤·페르소나·일정·디자인시스템 모두 누락. TBD 자동 표시 시연.",
    prompt: "엔터프라이즈 어드민 만들어줘",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Edge · Partial",
    emoji: "🧩",
  },
  {
    id: "diagnostic-unmatched",
    category: "edge-case",
    title: "관련 없는 프롬프트",
    description:
      "등록된 Work Unit과 무관한 입력. 라우팅 실패 → 후보 제안 동작 시연.",
    prompt: "근처에 강아지 사료 추천해줘",
    expectedWorkUnit: "",
    badge: "Edge · No Match",
    emoji: "🤷",
  },
];

export const PRESET_CATEGORY_LABEL: Record<
  PresetCategory,
  { en: string; ko: string }
> = {
  "ux-ui": { en: "UX/UI", ko: "UX·UI 기획" },
  report: { en: "Report", ko: "보고서" },
  infra: { en: "Infra", ko: "인프라" },
  "edge-case": { en: "Edge", ko: "엣지 케이스" },
};
