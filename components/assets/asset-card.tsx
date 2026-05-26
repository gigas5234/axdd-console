"use client";

import { AlertTriangle, FileBox, ArrowUpFromLine } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AssetItem } from "@/lib/types";

const RISK_TONE: Record<AssetItem["duplicateRisk"], string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

const TYPE_TONE: Record<AssetItem["type"], string> = {
  reference: "bg-sky-50 text-sky-700 border-sky-200",
  template: "bg-violet-50 text-violet-700 border-violet-200",
  script: "bg-emerald-50 text-emerald-700 border-emerald-200",
  output: "bg-indigo-50 text-indigo-700 border-indigo-200",
  asset: "bg-amber-50 text-amber-700 border-amber-200",
};

export function AssetCard({ asset }: { asset: AssetItem }) {
  return (
    <Card className="hover:shadow-glass-lg transition">
      <CardBody className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge tone={TYPE_TONE[asset.type]}>{asset.type}</Badge>
              <Badge status={asset.status} />
              {asset.migrationCandidate && (
                <Badge tone="bg-indigo-50 text-indigo-700 border-indigo-200">
                  <ArrowUpFromLine className="h-3 w-3" /> Migration
                </Badge>
              )}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink-900 truncate">
              {asset.name}
            </h3>
            <div className="text-[11px] text-ink-500 mt-0.5 font-mono truncate">
              {asset.path}
            </div>
          </div>
          <FileBox className="h-4 w-4 text-ink-400 shrink-0" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-ink-500">
          <span>{asset.category}</span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <Badge tone={RISK_TONE[asset.duplicateRisk]}>
              dup · {asset.duplicateRisk}
            </Badge>
          </span>
        </div>
        {asset.relatedSkills.length > 0 && (
          <div className="text-[11px] text-ink-500">
            <span className="text-ink-400">Skills · </span>
            <span className="font-mono">{asset.relatedSkills.join(", ")}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
