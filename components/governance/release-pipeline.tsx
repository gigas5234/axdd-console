"use client";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Status, WorkUnit } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES: { status: Status; label: string; ko: string; tone: string }[] = [
  {
    status: "draft",
    label: "Draft",
    ko: "초안",
    tone: "border-slate-200 bg-slate-50",
  },
  {
    status: "tested",
    label: "Tested",
    ko: "테스트 완료",
    tone: "border-sky-200 bg-sky-50",
  },
  {
    status: "needs-review",
    label: "Needs Review",
    ko: "리뷰 대기",
    tone: "border-amber-200 bg-amber-50",
  },
  {
    status: "approved",
    label: "Approved",
    ko: "승인됨",
    tone: "border-emerald-200 bg-emerald-50",
  },
  {
    status: "released",
    label: "Released",
    ko: "배포됨",
    tone: "border-indigo-200 bg-indigo-50",
  },
];

export function ReleasePipeline({ workUnits }: { workUnits: WorkUnit[] }) {
  const groups = STAGES.map((s) => ({
    ...s,
    items: workUnits.filter((w) => w.status === s.status),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Release Pipeline</CardTitle>
        <p className="text-xs text-ink-500 mt-1">
          Work Unit이 단계별로 어디까지 진행됐는지 한눈에 보세요.
        </p>
      </CardHeader>
      <CardBody className="pt-2 overflow-x-auto">
        <div className="grid grid-cols-5 gap-2 min-w-[700px]">
          {groups.map((g) => (
            <div
              key={g.status}
              className={cn("rounded-xl border p-2.5", g.tone)}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="text-[11px] font-semibold text-ink-900 uppercase tracking-wider">
                    {g.label}
                  </div>
                  <div className="text-[10px] text-ink-500">{g.ko}</div>
                </div>
                <span className="text-xs font-mono text-ink-600 px-1.5 py-0.5 rounded bg-white/70">
                  {g.items.length}
                </span>
              </div>
              <div className="space-y-1.5 min-h-[60px]">
                {g.items.length === 0 ? (
                  <div className="text-[11px] text-ink-400 italic text-center py-3">
                    없음
                  </div>
                ) : (
                  g.items.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-md bg-white border border-ink-100 px-2 py-1.5 shadow-sm"
                    >
                      <div className="text-[11px] font-medium text-ink-900 truncate">
                        {w.name}
                      </div>
                      <div className="text-[10px] text-ink-500 mt-0.5">
                        {w.skills.length} skills · {w.owner}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
