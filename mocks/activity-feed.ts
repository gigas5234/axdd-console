/**
 * MOCK: Overview의 Activity Feed 항목.
 * 실제 운영 시 runs.json / 감사 로그로 교체.
 */

export type ActivityKind =
  | "run-completed"
  | "validation-passed"
  | "review-requested"
  | "approved"
  | "released"
  | "skill-updated";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail?: string;
  actor?: string;
  timestamp: string;
  link?: string;
}

export const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  {
    id: "act-1",
    kind: "released",
    title: "Kickoff Report Work Unit · v1.2 릴리즈",
    detail: "approval rule passed",
    actor: "Operations",
    timestamp: "2026-05-27T09:32:00+09:00",
    link: "/governance",
  },
  {
    id: "act-2",
    kind: "review-requested",
    title: "UX/UI Planning 산출물 휴먼 리뷰 요청",
    detail: "Sandbox run-002",
    actor: "Product Design",
    timestamp: "2026-05-27T08:14:00+09:00",
    link: "/governance",
  },
  {
    id: "act-3",
    kind: "skill-updated",
    title: "UX/UI Handoff Full-step · v0.4.0",
    detail: "10섹션 마스터 핸드오프 강화",
    actor: "Product Design",
    timestamp: "2026-05-27T07:58:00+09:00",
    link: "/skills",
  },
  {
    id: "act-4",
    kind: "validation-passed",
    title: "Design System Reference 검증 통과",
    detail: "Tokens 표 + Component mapping 모두 OK",
    actor: "QA",
    timestamp: "2026-05-26T18:42:00+09:00",
    link: "/governance",
  },
  {
    id: "act-5",
    kind: "run-completed",
    title: "CI/CD Setup Work Unit 실행 완료",
    detail: "9.2초 · 4개 산출물",
    actor: "Engineering",
    timestamp: "2026-05-26T15:10:00+09:00",
    link: "/sandbox",
  },
  {
    id: "act-6",
    kind: "approved",
    title: "Risk Checklist v0.2 승인",
    actor: "Operations",
    timestamp: "2026-05-26T11:00:00+09:00",
    link: "/governance",
  },
];

export const ACTIVITY_KIND_META: Record<
  ActivityKind,
  { label: string; icon: string; tone: string }
> = {
  released: {
    label: "릴리즈",
    icon: "🚀",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  approved: {
    label: "승인",
    icon: "✅",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "review-requested": {
    label: "리뷰 요청",
    icon: "👀",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "validation-passed": {
    label: "검증 통과",
    icon: "✓",
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
  "skill-updated": {
    label: "스킬 업데이트",
    icon: "🔧",
    tone: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  "run-completed": {
    label: "실행 완료",
    icon: "▶",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
  },
};
