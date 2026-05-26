"use client";

import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SANDBOX_PRESETS,
  PRESET_CATEGORY_LABEL,
  type SandboxPreset,
  type PresetCategory,
} from "@/mocks/sandbox-presets";

const CATEGORY_TONE: Record<PresetCategory, string> = {
  "ux-ui": "bg-indigo-50 text-indigo-700 border-indigo-200",
  report: "bg-slate-100 text-slate-700 border-slate-200",
  infra: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "edge-case": "bg-rose-50 text-rose-700 border-rose-200",
};

type Filter = "all" | PresetCategory;

const FILTER_ORDER: Filter[] = ["all", "ux-ui", "report", "infra", "edge-case"];

export function PresetGallery({
  onSelect,
  selectedId,
}: {
  onSelect: (preset: SandboxPreset) => void;
  selectedId?: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [collapsed, setCollapsed] = useState(false);

  const visible = SANDBOX_PRESETS.filter(
    (p) => filter === "all" || p.category === filter,
  );

  const counts: Record<Filter, number> = {
    all: SANDBOX_PRESETS.length,
    "ux-ui": SANDBOX_PRESETS.filter((p) => p.category === "ux-ui").length,
    report: SANDBOX_PRESETS.filter((p) => p.category === "report").length,
    infra: SANDBOX_PRESETS.filter((p) => p.category === "infra").length,
    "edge-case": SANDBOX_PRESETS.filter((p) => p.category === "edge-case")
      .length,
  };

  return (
    <div className="rounded-xl border border-ink-200 bg-white/60 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="h-3.5 w-3.5 text-accent-indigo shrink-0" />
          <span className="text-xs font-semibold text-ink-900">
            프리셋 시나리오
          </span>
          <span className="text-[11px] text-ink-500 hidden sm:inline">
            · 클릭하면 프롬프트가 입력됩니다
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 카테고리 필터 칩 — 컴팩트 */}
          <div className="hidden md:flex items-center gap-1">
            {FILTER_ORDER.map((f) => {
              const active = filter === f;
              const label =
                f === "all" ? "전체" : PRESET_CATEGORY_LABEL[f].en;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "h-6 px-2 rounded text-[11px] font-medium transition border",
                    active
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white text-ink-600 border-ink-200 hover:bg-ink-50",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "ml-1",
                      active ? "text-ink-300" : "text-ink-400",
                    )}
                  >
                    {counts[f]}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="h-6 w-6 inline-flex items-center justify-center rounded border border-ink-200 bg-white hover:bg-ink-50"
            title={collapsed ? "펼치기" : "접기"}
          >
            {collapsed ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {visible.map((preset) => {
            const active = selectedId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset)}
                title={preset.description}
                className={cn(
                  "text-left group relative h-[68px]",
                  "rounded-lg border bg-white px-2.5 py-2 transition",
                  "hover:-translate-y-0.5 hover:shadow-sm hover:border-ink-300",
                  active
                    ? "border-accent-indigo ring-2 ring-accent-indigo/30 bg-indigo-50/30"
                    : "border-ink-200",
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none shrink-0">
                    {preset.emoji}
                  </span>
                  <Badge
                    tone={CATEGORY_TONE[preset.category]}
                    className="text-[9px] px-1 py-0"
                  >
                    {PRESET_CATEGORY_LABEL[preset.category].en}
                  </Badge>
                  {preset.recommended && (
                    <span className="ml-auto text-[9px] text-amber-600 font-medium">
                      ★
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[11px] font-medium text-ink-900 leading-tight line-clamp-2">
                  {preset.title}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
