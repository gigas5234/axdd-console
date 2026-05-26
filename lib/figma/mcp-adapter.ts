import type { FigmaAdapter, DesignFoundation, FigmaExportResult } from "./types";

/**
 * MCP direct-connection adapter.
 *
 * This is the path used when an MCP Figma server is wired up (e.g. via
 * Claude Desktop, Cursor MCP, or a custom relay). Right now the connection
 * is gated by the user's IT policy, so `isAvailable()` checks for an
 * environment flag the host can flip on. The function shapes below are
 * the contract — drop a real MCP client transport in `callMcpTool` when
 * connectivity becomes available.
 */

interface McpTransport {
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
}

let _transport: McpTransport | null = null;
export function registerFigmaMcpTransport(transport: McpTransport | null) {
  _transport = transport;
}

function envFlagEnabled(): boolean {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NEXT_PUBLIC_FIGMA_MCP_ENABLED === "1") return true;
  }
  if (typeof window !== "undefined") {
    // Allow a runtime override for local demos.
    // @ts-expect-error window flag is intentional
    if (window.__AXDD_FIGMA_MCP__ === true) return true;
  }
  return false;
}

export const figmaMcpAdapter: FigmaAdapter = {
  mode: "mcp",
  label: "Figma로 직접 내보내기 (MCP)",
  description:
    "Figma MCP가 연결돼 있으면 프레임을 자동 생성해 링크를 돌려줍니다.",
  isAvailable() {
    return envFlagEnabled() && _transport !== null;
  },
  async export(input: DesignFoundation): Promise<FigmaExportResult> {
    if (!envFlagEnabled() || _transport === null) {
      return {
        mode: "mcp",
        ok: false,
        message:
          "Figma MCP가 연결돼 있지 않습니다. 보안정책 해제 후 다시 시도하거나 AI 프롬프트 추출 방식을 사용하세요.",
      };
    }

    try {
      const result = (await _transport.callTool("figma.create_frame", {
        projectName: input.projectName,
        brand: input.brandIdentity ?? "",
        ux: input.uxFoundationMarkdown,
        ui: input.uiFoundationMarkdown,
        ia: input.iaMarkdown ?? "",
        components: input.componentSpecMarkdown ?? "",
      })) as { url?: string };

      return {
        mode: "mcp",
        ok: true,
        message: "Figma에 디자인 파운데이션 프레임을 만들었습니다.",
        figmaUrl: result?.url,
        details: { transport: "mcp" },
      };
    } catch (err) {
      return {
        mode: "mcp",
        ok: false,
        message:
          err instanceof Error
            ? `MCP 호출 실패: ${err.message}`
            : "MCP 호출에 실패했습니다.",
      };
    }
  },
};
