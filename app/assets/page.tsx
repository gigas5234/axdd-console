"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Boxes,
  AlertTriangle,
  ArrowUpFromLine,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { AssetCard } from "@/components/assets/asset-card";
import { AssetDetailPanel } from "@/components/assets/asset-detail-panel";
import { AxddDsCard } from "@/components/assets/axdd-ds-card";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { assets } from "@/lib/data";
import type { AssetItem } from "@/lib/types";

type Tab =
  | "all"
  | "inbox"
  | "references"
  | "templates"
  | "scripts"
  | "outputs"
  | "duplicates"
  | "migration";

const TABS: { id: Tab; label: string; ko: string }[] = [
  { id: "all", label: "All", ko: "전체" },
  { id: "inbox", label: "Inbox", ko: "신규" },
  { id: "references", label: "References", ko: "레퍼런스" },
  { id: "templates", label: "Templates", ko: "템플릿" },
  { id: "scripts", label: "Scripts", ko: "스크립트" },
  { id: "outputs", label: "Outputs", ko: "산출물" },
  { id: "duplicates", label: "Duplicates", ko: "중복 후보" },
  { id: "migration", label: "Migration", ko: "이관 후보" },
];

function filterAssets(tab: Tab, list: AssetItem[]) {
  switch (tab) {
    case "all":
      return list;
    case "inbox":
      return list.filter((a) => a.status === "needs-review");
    case "references":
      return list.filter((a) => a.type === "reference");
    case "templates":
      return list.filter((a) => a.type === "template");
    case "scripts":
      return list.filter((a) => a.type === "script");
    case "outputs":
      return list.filter((a) => a.type === "output");
    case "duplicates":
      return list.filter((a) => a.duplicateRisk === "high");
    case "migration":
      return list.filter((a) => a.migrationCandidate);
  }
}

function StatBar({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="label-eyebrow">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-ink-900">
              {value}
            </div>
          </div>
          <div
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center",
              tone,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function AssetsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AssetItem | null>(null);

  const counts = useMemo(() => {
    const m: Record<Tab, number> = {
      all: assets.length,
      inbox: 0,
      references: 0,
      templates: 0,
      scripts: 0,
      outputs: 0,
      duplicates: 0,
      migration: 0,
    };
    for (const t of TABS) m[t.id] = filterAssets(t.id, assets).length;
    return m;
  }, []);

  const stats = useMemo(() => {
    return {
      total: assets.length,
      active: assets.filter((a) => a.status === "active").length,
      migrationCandidate: assets.filter((a) => a.migrationCandidate).length,
      highRisk: assets.filter((a) => a.duplicateRisk === "high").length,
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return filterAssets(tab, assets).filter((a) => {
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.path.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [tab, query]);

  return (
    <>
      <AppHeader
        title="Asset Repository"
        subtitle="자산 레포지토리 · Inbox / 중복·이관 후보 관리"
      />
      <main className="px-6 py-6 space-y-5">
        <section>
          <h1 className="h-page">Asset Repository</h1>
          <p className="h-sub">
            흩어진 산출물·템플릿·레퍼런스를 한 곳에서 관리하고 중복/이관 후보를 정리하세요.
          </p>
        </section>

        {/* AXDD Design System 상태 — 모든 UX/UI 스킬의 고정 자산 */}
        <AxddDsCard />

        {/* Stats bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatBar
            icon={Boxes}
            label="Total Assets"
            value={stats.total}
            tone="bg-indigo-50 text-indigo-700"
          />
          <StatBar
            icon={CheckCircle2}
            label="Active"
            value={stats.active}
            tone="bg-emerald-50 text-emerald-700"
          />
          <StatBar
            icon={ArrowUpFromLine}
            label="Migration Candidates"
            value={stats.migrationCandidate}
            tone="bg-violet-50 text-violet-700"
          />
          <StatBar
            icon={AlertTriangle}
            label="High Duplicate Risk"
            value={stats.highRisk}
            tone="bg-rose-50 text-rose-700"
          />
        </section>

        {/* Filter + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "h-8 px-3 rounded-lg text-xs font-medium transition-colors border",
                    active
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white/70 text-ink-700 border-ink-200 hover:bg-white",
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "ml-1.5",
                      active ? "text-ink-300" : "text-ink-400",
                    )}
                  >
                    {t.ko}
                  </span>
                  <span
                    className={cn(
                      "ml-2 px-1.5 py-0.5 rounded text-[10px]",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-ink-100 text-ink-500",
                    )}
                  >
                    {counts[t.id]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-400" />
            <Input
              className="pl-9"
              placeholder="이름·경로·카테고리 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-white/40 p-10 text-center">
            <Inbox className="h-8 w-8 text-ink-300 mx-auto" />
            <p className="mt-2 text-sm text-ink-500">
              조건에 맞는 자산이 없어요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="text-left"
              >
                <AssetCard asset={a} />
              </button>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <AssetDetailPanel
          asset={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
