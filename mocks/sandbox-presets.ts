/**
 * MOCK: 샌드박스 프리셋 — Phase 6 재정의 (AXDD 4-Case 시나리오).
 *
 * 사용자가 빈 화면 앞에서 막막하지 않도록 미리 준비된 시나리오를 카드로 제공.
 * 클릭 → 프롬프트 자동 입력 → 사용자가 [실행] 누르면 시각화 시작.
 *
 * 외부 산업 도메인(헬스케어/핀테크/이커머스) 시나리오는 모두 제거.
 * AXDD 전사 내부 작업 컨텍스트로 4-Case (A/B/C/D) 시나리오만 노출.
 */

export type PresetCategory = "ax-internal" | "ax-customer" | "ax-bootstrap" | "report" | "infra" | "edge-case";

export interface SandboxPreset {
  id: string;
  category: PresetCategory;
  title: string;
  /** 4-Case 매트릭스 식별 (UI 배지용) */
  caseId?: "case-a" | "case-b" | "case-c" | "case-d";
  description: string;
  prompt: string;
  expectedWorkUnit: string;
  badge: string;
  recommended?: boolean;
  emoji: string;
}

export const SANDBOX_PRESETS: SandboxPreset[] = [
  // ─────────── Case A · DS Bootstrap ───────────
  {
    id: "axdd-ds-bootstrap",
    category: "ax-bootstrap",
    caseId: "case-a",
    title: "AXDD DS 초안 부트스트랩",
    description:
      "AXDD 자체 디자인 시스템이 아직 없을 때, 요구사항만으로 토큰·공용 컴포넌트 초안 풀세트 생성.",
    prompt:
      "AXDD 사내에서 쓸 디자인 시스템을 부트스트랩해줘. 사내 어드민·콘솔·내부 툴이 공통으로 쓸 수 있게 토큰(color/typography/spacing/radius/shadow/motion) 풀세트와 공용 컴포넌트 5종 스펙 초안을 만들어줘. 톤은 전문성·효율 중심.",
    expectedWorkUnit: "design-system-bootstrap-workunit",
    badge: "Case A · Bootstrap",
    recommended: true,
    emoji: "🧱",
  },

  // ─────────── Case B · AXDD 내부 신규 ───────────
  {
    id: "axdd-internal-admin-screen",
    category: "ax-internal",
    caseId: "case-b",
    title: "사내 어드민 신규 화면 추가",
    description:
      "AXDD DS 차용. 사내 어드민에 새 화면(예: 데이터 테이블 + 필터 + 권한 매트릭스) 추가.",
    prompt:
      "AXDD 사내 어드민에 신규 화면 1세트를 추가하려고 해. AXDD DS를 그대로 차용하고, 데이터 테이블 + 필터 + 행별 액션이 포함된 운영자 워크플로우를 IA + 컴포넌트 스펙 + 핸드오프까지 풀세트로 만들어줘.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Case B · AXDD 내부",
    recommended: true,
    emoji: "🗂️",
  },
  {
    id: "axdd-internal-skill-builder",
    category: "ax-internal",
    caseId: "case-b",
    title: "사내 스킬 빌더 UI",
    description:
      "AXDD 콘솔에 새 'Skill Builder' 기능 추가. SKILL.md 작성 도우미 화면.",
    prompt:
      "AXDD SkillOps Console에 사내 디자이너·개발자가 직접 스킬을 만들 수 있는 'Skill Builder' 기능을 추가하려고 해. SKILL.md 작성 단계별 가이드 + 미리보기 + 즉시 등록까지의 UX 흐름과 IA, 컴포넌트 스펙을 만들어줘. AXDD DS 차용.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Case B · AXDD 내부",
    emoji: "🧰",
  },

  // ─────────── Case C · 고객사 프로젝트 ───────────
  {
    id: "customer-project-handoff",
    category: "ax-customer",
    caseId: "case-c",
    title: "고객사 프로젝트 핸드오프",
    description:
      "외부 고객사 프로젝트. 고객사 DS를 인풋으로 받아 AXDD 핸드오프 표준으로 산출.",
    prompt:
      "외부 고객사 프로젝트의 핸드오프 문서를 만들어줘. 고객사가 별도 디자인 시스템을 가지고 있어서 우리 AXDD DS는 폴백으로만 쓸 거야. 고객사 가이드 일치율을 자동 검수하고, IA + 컴포넌트 스펙 + 핸드오프 풀세트 작성.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Case C · 고객사",
    recommended: true,
    emoji: "🤝",
  },

  // ─────────── Case D · 요구사항만 ───────────
  {
    id: "requirement-only-extract",
    category: "ax-internal",
    caseId: "case-d",
    title: "요구사항부터 정리 (Case D)",
    description:
      "고객/사업부가 넘긴 PRD에서 UI/UX 요구사항만 1페이지로 추출 (이후 Case A/B로 전이).",
    prompt:
      "사내 사업부가 넘긴 PRD 문서가 있는데 UI/UX 관련 요구사항만 1페이지로 정리해줘. 백엔드·API·인프라 요구사항은 제외. 정리되면 다음 단계(DS 부트스트랩 또는 AXDD DS 차용)로 어떻게 진행할지도 안내해줘.",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Case D · 요구사항",
    emoji: "📝",
  },

  // ─────────── Report ───────────
  {
    id: "axdd-kickoff-report",
    category: "report",
    title: "AXDD 신규 프로젝트 착수보고서",
    description:
      "사내 프로젝트 시작 시 이해관계자 · 일정 · 리스크 표준 정리.",
    prompt:
      "AXDD 사내에서 새로 시작하는 디자인 시스템 v2 프로젝트의 착수보고서를 작성해줘. 6주 일정, 디자이너 3명 + PM 1명 + 개발자 2명, 리스크 체크리스트 포함.",
    expectedWorkUnit: "kickoff-report-workunit",
    badge: "Report",
    emoji: "📋",
  },

  // ─────────── Infra ───────────
  {
    id: "axdd-cicd-setup",
    category: "infra",
    title: "AXDD 콘솔 CI/CD 셋업",
    description:
      "Next.js + GitHub Actions + Vercel 프리뷰 배포 + 릴리즈 노트 자동화.",
    prompt:
      "AXDD SkillOps Console 프로젝트의 Vercel 배포를 위한 CI/CD를 셋업해줘. GitHub Actions + 프리뷰 배포 + 릴리즈 노트 자동화까지.",
    expectedWorkUnit: "cicd-setup-workunit",
    badge: "Infra",
    emoji: "🚀",
  },

  // ─────────── Edge-case ───────────
  {
    id: "diagnostic-vague",
    category: "edge-case",
    title: "모호한 입력",
    description:
      "케이스·DS 상태 모두 누락. Clarifying Question이 발동되는지 시연.",
    prompt: "스킬 하나 만들어줘",
    expectedWorkUnit: "ux-ui-planning-workunit",
    badge: "Edge · Vague",
    emoji: "❓",
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
  "ax-bootstrap": { en: "Case A · Bootstrap", ko: "DS 부트스트랩" },
  "ax-internal": { en: "Case B · Internal", ko: "AXDD 내부" },
  "ax-customer": { en: "Case C · Customer", ko: "고객사 프로젝트" },
  report: { en: "Report", ko: "보고서" },
  infra: { en: "Infra", ko: "인프라" },
  "edge-case": { en: "Edge", ko: "엣지 케이스" },
};
