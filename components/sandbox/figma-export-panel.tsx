"use client";

import { useEffect, useState } from "react";
import { Copy, ExternalLink, Figma, Shield, ShieldOff } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  figmaPromptAdapter,
  figmaMcpAdapter,
  type DesignFoundation,
  type FigmaExportResult,
} from "@/lib/figma";

/**
 * Sandbox: dual-track Figma export.
 *
 * - "Figma MCP" 버튼: 연결돼 있을 때만 활성. 차단되면 안내 메시지.
 * - "Figma AI 프롬프트 복사" 버튼: 항상 동작. 클립보드 복사 + 미리보기 렌더.
 *
 * 같은 DesignFoundation 페이로드를 두 어댑터가 공유하므로 UI 변경 없이
 * MCP 정책이 풀리는 즉시 그대로 사용 가능합니다.
 */
export function FigmaExportPanel({
  foundation,
}: {
  foundation: DesignFoundation;
}) {
  const [mcpAvailable, setMcpAvailable] = useState(false);
  const [result, setResult] = useState<FigmaExportResult | null>(null);
  const [busy, setBusy] = useState<"mcp" | "prompt" | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await Promise.resolve(figmaMcpAdapter.isAvailable());
      setMcpAvailable(ok);
    })();
  }, []);

  async function run(mode: "mcp" | "prompt") {
    setBusy(mode);
    const adapter = mode === "mcp" ? figmaMcpAdapter : figmaPromptAdapter;
    const r = await adapter.export(foundation);
    setResult(r);
    setBusy(null);
  }

  return (
    <Card>
      <CardHeader className="flex items-start justify-between flex-row">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Figma className="h-4 w-4 text-accent-indigo" />
            Figma 내보내기 (Dual Track)
          </CardTitle>
          <p className="text-sm text-ink-500 mt-1">
            MCP 연결 시 직접 프레임 생성, 차단 시 AI 프롬프트 추출로 폴백합니다.
          </p>
        </div>
      </CardHeader>
      <CardBody className="pt-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className={`rounded-xl border p-3.5 transition ${
              mcpAvailable
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-ink-200 bg-white/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-ink-900">
                {figmaMcpAdapter.label}
              </div>
              {mcpAvailable ? (
                <Badge tone="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Shield className="h-3 w-3" /> connected
                </Badge>
              ) : (
                <Badge tone="bg-rose-50 text-rose-600 border-rose-200">
                  <ShieldOff className="h-3 w-3" /> blocked
                </Badge>
              )}
            </div>
            <p className="text-xs text-ink-500 mt-1">
              {figmaMcpAdapter.description}
            </p>
            <Button
              className="mt-3 w-full"
              variant={mcpAvailable ? "primary" : "secondary"}
              disabled={!mcpAvailable || busy !== null}
              onClick={() => run("mcp")}
            >
              {busy === "mcp" ? "MCP 호출 중..." : "Figma로 직접 내보내기"}
            </Button>
            {!mcpAvailable && (
              <p className="text-[11px] text-ink-500 mt-2">
                회사 보안정책으로 차단된 경우 우측 AI 프롬프트 추출 방식을 사용하세요.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3.5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-ink-900">
                {figmaPromptAdapter.label}
              </div>
              <Badge tone="bg-indigo-100 text-indigo-700 border-indigo-200">
                always-on
              </Badge>
            </div>
            <p className="text-xs text-ink-500 mt-1">
              {figmaPromptAdapter.description}
            </p>
            <Button
              variant="neon"
              className="mt-3 w-full"
              disabled={busy !== null}
              onClick={() => run("prompt")}
            >
              <Copy className="h-3.5 w-3.5" />
              {busy === "prompt" ? "생성 중..." : "프롬프트 복사"}
            </Button>
          </div>
        </div>

        {result && (
          <div
            className={`rounded-xl border p-3 text-sm ${
              result.ok
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
                : "border-rose-200 bg-rose-50/70 text-rose-700"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>{result.message}</span>
              {result.figmaUrl && (
                <a
                  href={result.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs underline"
                >
                  열기 <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {result?.promptPayload && (
          <details className="rounded-xl border border-ink-200 bg-white/70">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-ink-700 select-none">
              생성된 프롬프트 미리보기 (붙여 넣기 가능)
            </summary>
            <pre className="px-3 pb-3 text-[11px] text-ink-700 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-auto">
              {result.promptPayload}
            </pre>
          </details>
        )}
      </CardBody>
    </Card>
  );
}
