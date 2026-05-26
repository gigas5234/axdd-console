"use client";

import {
  FileCode2,
  FlaskConical,
  GitBranch,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_TONE } from "@/lib/types";
import type { Skill } from "@/lib/types";

export type SkillCardRunState = "idle" | "pending" | "running" | "done";

export function SkillCard({
  skill,
  active,
  glowing,
  runState = "idle",
  onClick,
}: {
  skill: Skill;
  active?: boolean;
  glowing?: boolean;
  /** Sandbox 실행 중 단계 표시 */
  runState?: SkillCardRunState;
  onClick?: () => void;
}) {
  const cat = CATEGORY_LABELS[skill.category];
  const isRunning = runState === "running";
  const isPending = runState === "pending";
  const isDone = runState === "done";

  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={cn(
        "cursor-pointer transition-all duration-200 group relative",
        "hover:-translate-y-0.5 hover:shadow-glass-lg",
        active && "ring-2 ring-accent-blue/50",
        // 실행 중: cyan neon glow + pulse
        isRunning && "neon-cyan glow-pulse",
        // 아직 안 돌아간 스킬: dim
        isPending && "opacity-50 grayscale-[40%]",
        // 완료: 초록 ring + 살짝 mute
        isDone && "ring-2 ring-emerald-300/70",
        // 레거시 glowing prop은 runState 없을 때 fallback
        glowing && runState === "idle" && "neon-cyan glow-pulse",
      )}
    >
      {/* Run state indicator (우측 상단 작은 배지) */}
      {(isRunning || isDone) && (
        <div className="absolute -top-2 -right-2 z-10">
          {isRunning && (
            <div className="h-6 w-6 rounded-full bg-accent-cyan text-navy-deep flex items-center justify-center shadow-neon-cyan">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
          )}
          {isDone && (
            <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      )}
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={CATEGORY_TONE[skill.category]}>
                {cat.en} · {cat.ko}
              </Badge>
              <Badge status={skill.status} />
            </div>
            <h3 className="mt-2 text-base font-semibold tracking-tight text-ink-900 truncate">
              {skill.name}
            </h3>
            <p className="mt-1 text-sm text-ink-500 line-clamp-2">
              {skill.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg bg-ink-50 px-2.5 py-2 border border-ink-100">
            <div className="label-eyebrow">Input</div>
            <div className="mt-0.5 text-ink-700 font-mono truncate">
              {skill.input[0] ?? "—"}
              {skill.input.length > 1 && (
                <span className="text-ink-400">
                  {" "}
                  +{skill.input.length - 1}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-ink-50 px-2.5 py-2 border border-ink-100">
            <div className="label-eyebrow">Output</div>
            <div className="mt-0.5 text-ink-700 font-mono truncate">
              {skill.output[0] ?? "—"}
              {skill.output.length > 1 && (
                <span className="text-ink-400">
                  {" "}
                  +{skill.output.length - 1}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-between text-[11px] text-ink-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <User className="h-3 w-3" />
            {skill.owner}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitBranch className="h-3 w-3" />v{skill.version}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <FileCode2 className="h-3 w-3" />
            {skill.files.references.length +
              skill.files.scripts.length +
              skill.files.assets.length}{" "}
            files
          </span>
          <span className="inline-flex items-center gap-1">
            <FlaskConical className="h-3 w-3" />
            {skill.files.tests.length} tests
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
