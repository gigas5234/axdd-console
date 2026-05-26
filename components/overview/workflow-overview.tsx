"use client";

import { Fragment } from "react";
import {
  ArrowRight,
  Webhook,
  Workflow,
  Library,
  FileOutput,
  ShieldCheck,
  UserCheck,
  Rocket,
} from "lucide-react";

const STAGES = [
  { icon: Webhook, label: "Input", labelKo: "사용자 요청" },
  { icon: Webhook, label: "Hook", labelKo: "감지" },
  { icon: Workflow, label: "Work Unit", labelKo: "실행 세트" },
  { icon: Library, label: "Skills", labelKo: "조합" },
  { icon: FileOutput, label: "Output", labelKo: "산출물" },
  { icon: ShieldCheck, label: "Validation", labelKo: "검증" },
  { icon: UserCheck, label: "Review", labelKo: "승인" },
  { icon: Rocket, label: "Release", labelKo: "배포" },
];

export function WorkflowOverview() {
  return (
    <div className="rounded-2xl glass p-4 sm:p-5">
      <div className="flex items-center w-full gap-1 sm:gap-2">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          return (
            <Fragment key={s.label}>
              <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 sm:gap-2 px-1">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white border border-ink-200 flex items-center justify-center shadow-sm shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent-indigo" />
                </div>
                <div className="text-center min-w-0 w-full">
                  <div className="text-[11px] sm:text-xs font-semibold text-ink-900 truncate">
                    {s.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-ink-500 truncate hidden sm:block">
                    {s.labelKo}
                  </div>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ink-300 shrink-0 -mt-5 sm:-mt-6" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
