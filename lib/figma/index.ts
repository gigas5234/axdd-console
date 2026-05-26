import { figmaMcpAdapter } from "./mcp-adapter";
import { figmaPromptAdapter } from "./prompt-adapter";
import type { FigmaAdapter, FigmaExportMode } from "./types";

export * from "./types";
export { figmaMcpAdapter, figmaPromptAdapter };

export const figmaAdapters: Record<FigmaExportMode, FigmaAdapter> = {
  mcp: figmaMcpAdapter,
  prompt: figmaPromptAdapter,
};

export function listFigmaAdapters(): FigmaAdapter[] {
  return [figmaMcpAdapter, figmaPromptAdapter];
}
