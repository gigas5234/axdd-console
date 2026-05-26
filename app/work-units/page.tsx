"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Webhook,
  PlayCircle,
  Download,
  Upload,
  ShieldCheck,
  Users,
  Layers,
  Package,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkUnitFlow } from "@/components/work-units/workunit-flow";
import { skills, workUnits, hooks } from "@/lib/data";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";

function IOFile({
  path,
  variant,
}: {
  path: string;
  variant: "input" | "output";
}) {
  const tone =
    variant === "input"
      ? "border-sky-200 bg-sky-50/60 text-sky-900"
      : "border-emerald-200 bg-emerald-50/60 text-emerald-900";
  const Icon = variant === "input" ? Upload : Download;
  return (
    <div
      className={cn(
        "rounded-lg border px-2.5 py-1.5 flex items-center gap-2",
        tone,
      )}
    >
      <Icon className="h-3 w-3 shrink-0 opacity-70" />
      <span className="font-mono text-[11px] truncate">{path}</span>
    </div>
  );
}

export default function WorkUnitsPage() {
  const skillsById = useMemo<Record<string, Skill>>(
    () => Object.fromEntries(skills.map((s) => [s.id, s])),
    [],
  );
  const [activeId, setActiveId] = useState<string>(workUnits[0]?.id ?? "");
  const active = workUnits.find((w) => w.id === activeId) ?? workUnits[0];
  const triggerHook = hooks.find((h) => h.id === active?.triggerHooks[0]);
  const validationSkill = active?.validationSkill
    ? skillsById[active.validationSkill]
    : undefined;

  return (
    <>
      <AppHeader
        title="Work Units"
        subtitle="업무 실행 세트 빌더 · 여러 스킬을 체인으로 연결합니다"
      />
      <main className="px-6 py-6 space-y-5">
        <section className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="h-page">Work Unit Builder</h1>
            <p className="h-sub">
              업무 단위(Work Unit)는 Hook으로 트리거되어 여러 스킬을 순서대로 실행합니다.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3 w-3" /> {workUnits.length}개 Work Unit
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Webhook className="h-3 w-3" /> {hooks.length}개 Hook 연결
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-4">
          <aside className="space-y-2 min-w-0">
            {workUnits.map((w) => {
              const isActive = activeId === w.id;
              const hook = hooks.find((h) => h.id === w.triggerHooks[0]);
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveId(w.id)}
                  className={cn(
                    "w-full text-left rounded-xl border px-3.5 py-3 transition",
                    isActive
                      ? "bg-ink-900 text-white border-ink-900 shadow-glass-lg"
                      : "bg-white/70 border-ink-200 hover:bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold truncate">
                      {w.name}
                    </div>
                    <Badge
                      status={w.status}
                      className={
                        isActive
                          ? "bg-white/10 text-white border-white/20"
                          : undefined
                      }
                    />
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-1 line-clamp-2",
                      isActive ? "text-ink-200" : "text-ink-500",
                    )}
                  >
                    {w.description}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] mt-2 flex items-center gap-2 flex-wrap",
                      isActive ? "text-ink-300" : "text-ink-400",
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {w.skills.length} skills
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {w.owner}
                    </span>
                  </div>
                  {hook && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hook.conditions.keywords.slice(0, 3).map((k) => (
                        <span
                          key={k}
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-mono",
                            isActive
                              ? "bg-white/10 text-ink-200"
                              : "bg-ink-100 text-ink-600",
                          )}
                        >
                          {k}
                        </span>
                      ))}
                      {hook.conditions.keywords.length > 3 && (
                        <span
                          className={cn(
                            "text-[10px]",
                            isActive ? "text-ink-300" : "text-ink-400",
                          )}
                        >
                          +{hook.conditions.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </aside>

          {active && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex items-start justify-between flex-row gap-3">
                  <div className="min-w-0">
                    <CardTitle>{active.name}</CardTitle>
                    <p className="text-sm text-ink-500 mt-1">
                      {active.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={active.status} />
                    <a
                      href={`/api/work-units/${active.id}/bundle`}
                      className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white text-xs text-ink-700 hover:bg-ink-50"
                      title="스킬셋 + _runtime을 zip으로 다운로드 (Claude Code 호환)"
                    >
                      <Package className="h-3.5 w-3.5" /> Bundle zip
                    </a>
                    <Link
                      href="/sandbox"
                      className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-indigo text-white text-xs hover:bg-indigo-600 shadow-sm"
                    >
                      <PlayCircle className="h-3.5 w-3.5" /> Sandbox에서 시연
                    </Link>
                  </div>
                </CardHeader>
                <CardBody className="pt-2 space-y-4">
                  {triggerHook && (
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-accent-indigo/15 text-accent-indigo flex items-center justify-center shrink-0">
                          <Webhook className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-indigo-700/70 font-semibold">
                                Trigger Hook
                              </div>
                              <div className="text-sm font-semibold text-ink-900">
                                {triggerHook.name}
                              </div>
                            </div>
                            <Badge tone="bg-white text-ink-600 border-ink-200">
                              priority {triggerHook.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-ink-600 mt-1">
                            {triggerHook.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {triggerHook.conditions.keywords.map((k) => (
                              <span
                                key={k}
                                className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-indigo-200 text-indigo-800 font-mono"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <WorkUnitFlow
                    workUnit={active}
                    skillsById={skillsById}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="label-eyebrow mb-1.5 flex items-center gap-1.5">
                        <Upload className="h-3 w-3 text-sky-600" />
                        Input ({active.input.length})
                      </div>
                      <div className="space-y-1.5">
                        {active.input.map((i) => (
                          <IOFile key={i} path={i} variant="input" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="label-eyebrow mb-1.5 flex items-center gap-1.5">
                        <Download className="h-3 w-3 text-emerald-600" />
                        Output ({active.output.length})
                      </div>
                      <div className="space-y-1.5">
                        {active.output.map((o) => (
                          <IOFile key={o} path={o} variant="output" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {validationSkill && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider text-emerald-700/80 font-semibold">
                          Validation Skill
                        </div>
                        <div className="text-sm font-semibold text-ink-900 mt-0.5">
                          {validationSkill.name}
                        </div>
                        <div className="text-xs text-ink-600 mt-0.5">
                          {validationSkill.description}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-emerald-600/60 shrink-0 self-center" />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-ink-100">
                    <div className="rounded-lg bg-white border border-ink-100 px-2 py-2">
                      <div className="text-[10px] text-ink-500 uppercase tracking-wider">
                        Skills
                      </div>
                      <div className="text-base font-semibold text-ink-900 mt-0.5">
                        {active.skills.length}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white border border-ink-100 px-2 py-2">
                      <div className="text-[10px] text-ink-500 uppercase tracking-wider">
                        Inputs
                      </div>
                      <div className="text-base font-semibold text-ink-900 mt-0.5">
                        {active.input.length}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white border border-ink-100 px-2 py-2">
                      <div className="text-[10px] text-ink-500 uppercase tracking-wider">
                        Outputs
                      </div>
                      <div className="text-base font-semibold text-ink-900 mt-0.5">
                        {active.output.length}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
