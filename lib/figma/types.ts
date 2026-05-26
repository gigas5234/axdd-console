/**
 * Figma dual-track export — two adapters share the same interface so the UI
 * can stay identical regardless of whether MCP is wired up at runtime.
 */

export type FigmaExportMode = "mcp" | "prompt";

export interface DesignFoundation {
  projectName: string;
  brandIdentity?: string;
  uxFoundationMarkdown: string;
  uiFoundationMarkdown: string;
  iaMarkdown?: string;
  componentSpecMarkdown?: string;
  notes?: string;
}

export interface FigmaExportResult {
  mode: FigmaExportMode;
  ok: boolean;
  message: string;
  // For prompt mode: copy-paste payload for Figma Make / AI plugin
  promptPayload?: string;
  // For mcp mode: link to created Figma file or frame
  figmaUrl?: string;
  // Optional diagnostic info
  details?: Record<string, unknown>;
}

export interface FigmaAdapter {
  mode: FigmaExportMode;
  /** Is this adapter currently usable in the running environment? */
  isAvailable(): Promise<boolean> | boolean;
  /** Run an export. Both adapters return the same result shape. */
  export(input: DesignFoundation): Promise<FigmaExportResult>;
  /** Human label for the UI button. */
  label: string;
  /** One-line UX description shown under the button. */
  description: string;
}
