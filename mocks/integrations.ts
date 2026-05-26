/**
 * MOCK: Overview 우측 Integration Status 패널용 정적 데이터.
 * 실제 연결 상태 조회(GitHub auth, Vercel API, Figma MCP availability 등)로 교체.
 *
 * @see mocks/README.md
 */

export type IntegrationStatus = "connected" | "pending" | "blocked";

export interface IntegrationItem {
  name: string;
  status: IntegrationStatus;
  note: string;
}

export const MOCK_INTEGRATIONS: IntegrationItem[] = [
  { name: "GitHub", status: "connected", note: "axdd/skillops-console" },
  { name: "Vercel", status: "connected", note: "preview · main" },
  {
    name: "Figma MCP",
    status: "blocked",
    note: "보안정책 차단 — 프롬프트 모드",
  },
  { name: "Local Harness", status: "connected", note: "Mock Run Mode" },
];

export const INTEGRATION_TONE: Record<IntegrationStatus, string> = {
  connected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-rose-50 text-rose-600 border-rose-200",
};
