"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_TONE,
  type WorkUnit,
  type Skill,
} from "@/lib/types";
import type { SkillRunState } from "@/mocks/execution";

type SkillNodeData = {
  skill: Skill;
  runState?: SkillRunState | "idle";
};

function SkillNode({ data }: NodeProps<SkillNodeData>) {
  const { skill, runState = "idle" } = data;
  const cat = CATEGORY_LABELS[skill.category];
  const isRunning = runState === "running";
  const isPending = runState === "pending";
  const isDone = runState === "done";

  return (
    <div
      className={cn(
        "rounded-xl bg-white/85 backdrop-blur-md border px-3.5 py-2.5 min-w-[200px] shadow-glass transition relative",
        "border-ink-200",
        isRunning && "neon-cyan glow-pulse border-accent-cyan",
        isPending && "opacity-50 grayscale-[40%]",
        isDone && "ring-2 ring-emerald-300 border-emerald-300",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !bg-ink-300"
      />

      {/* 실행 상태 인디케이터 */}
      {(isRunning || isDone) && (
        <div className="absolute -top-2 -right-2 z-10">
          {isRunning && (
            <div className="h-5 w-5 rounded-full bg-accent-cyan text-navy-deep flex items-center justify-center shadow-neon-cyan">
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          )}
          {isDone && (
            <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-3 w-3" />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Badge tone={CATEGORY_TONE[skill.category]}>{cat.en}</Badge>
        {isRunning ? (
          <Badge tone="bg-cyan-50 text-cyan-700 border-cyan-200">
            실행 중
          </Badge>
        ) : isDone ? (
          <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
            완료
          </Badge>
        ) : (
          <Badge status={skill.status} />
        )}
      </div>
      <div className="mt-1.5 text-sm font-semibold text-ink-900 truncate">
        {skill.name}
      </div>
      <div className="text-[11px] text-ink-500 mt-0.5 font-mono truncate">
        {skill.output[0]}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !bg-ink-300"
      />
    </div>
  );
}

const NODE_TYPES = { skill: SkillNode };

export function WorkUnitFlow({
  workUnit,
  skillsById,
  highlightedSkillIds,
  skillStates,
}: {
  workUnit: WorkUnit;
  skillsById: Record<string, Skill>;
  /** Legacy: 단순 highlighting (모든 카드 동시 강조) */
  highlightedSkillIds?: string[];
  /** 신규: 스킬별 상태 (pending/running/done) */
  skillStates?: Record<string, SkillRunState>;
}) {
  const { nodes, edges } = useMemo(() => {
    const highlights = new Set(highlightedSkillIds ?? []);

    const ns: Node<SkillNodeData>[] = [];
    workUnit.skills.forEach((id, i) => {
      const skill = skillsById[id];
      if (!skill) return;
      const runState: SkillNodeData["runState"] = skillStates?.[id]
        ? skillStates[id]
        : highlights.has(id)
          ? "running"
          : "idle";
      ns.push({
        id,
        type: "skill",
        position: { x: i * 260, y: 0 },
        data: { skill, runState },
      });
    });

    const es: Edge[] = workUnit.skills
      .slice(0, -1)
      .map((id, i) => {
        const next = workUnit.skills[i + 1];
        const fromDone = skillStates?.[id] === "done";
        const toRunning = skillStates?.[next] === "running";
        return {
          id: `${id}-${next}`,
          source: id,
          target: next,
          animated: fromDone && toRunning,
          style: {
            stroke: fromDone
              ? "rgba(16, 185, 129, 0.6)"
              : "rgba(99, 102, 241, 0.45)",
            strokeWidth: fromDone ? 2 : 1.5,
          },
        };
      });

    return { nodes: ns, edges: es };
  }, [workUnit, skillsById, highlightedSkillIds, skillStates]);

  return (
    <div className="h-[260px] rounded-xl border border-ink-200 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
      >
        <Background gap={20} size={1} color="rgba(15,23,42,0.06)" />
        <Controls
          showInteractive={false}
          className="!bg-white/70 !border !border-ink-200"
        />
      </ReactFlow>
    </div>
  );
}
