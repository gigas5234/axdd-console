"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/types";
import type { SkillCategory } from "@/lib/types";

type Filter = SkillCategory | "all";

const ORDER: Filter[] = [
  "all",
  "simple",
  "reference",
  "script",
  "asset-template",
  "full-step",
  "meta-tooling",
  "integration",
  "frontmatter-overlay",
  "validation",
];

export function SkillCategoryFilter({
  value,
  onChange,
  counts,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
  counts: Record<Filter, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ORDER.map((f) => {
        const active = value === f;
        const label = f === "all" ? "All" : CATEGORY_LABELS[f].en;
        const labelKo = f === "all" ? "전체" : CATEGORY_LABELS[f].ko;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={cn(
              "h-8 px-3 rounded-lg text-xs font-medium transition-colors border",
              active
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white/70 text-ink-700 border-ink-200 hover:bg-white",
            )}
          >
            <span>{label}</span>
            <span className={cn("ml-1.5", active ? "text-ink-300" : "text-ink-400")}>
              {labelKo}
            </span>
            <span
              className={cn(
                "ml-2 px-1.5 py-0.5 rounded text-[10px]",
                active ? "bg-white/15 text-white" : "bg-ink-100 text-ink-500",
              )}
            >
              {counts[f] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type { Filter as SkillFilter };
