import * as React from "react";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  "ready-for-test": "bg-amber-50 text-amber-700 border-amber-200",
  tested: "bg-sky-50 text-sky-700 border-sky-200",
  "needs-review": "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "release-candidate": "bg-indigo-50 text-indigo-700 border-indigo-200",
  released: "bg-emerald-100 text-emerald-700 border-emerald-200",
  deprecated: "bg-rose-50 text-rose-600 border-rose-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unverified: "bg-slate-100 text-slate-500 border-slate-200",
  passed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "passed-with-review": "bg-sky-50 text-sky-700 border-sky-200",
  failed: "bg-rose-50 text-rose-600 border-rose-200",
  pending: "bg-slate-100 text-slate-500 border-slate-200",
  active: "bg-sky-50 text-sky-700 border-sky-200",
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  "ready-for-test": "Ready for Test",
  tested: "Tested",
  "needs-review": "Needs Review",
  approved: "Approved",
  "release-candidate": "Release Candidate",
  released: "Released",
  deprecated: "Deprecated",
  verified: "Verified",
  unverified: "Unverified",
  passed: "Passed",
  "passed-with-review": "Passed · Review",
  failed: "Failed",
  pending: "Pending",
  active: "Active",
};

export function Badge({
  className,
  tone,
  status,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: string;
  status?: Status;
}) {
  const toneClass = status
    ? STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
    : tone ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border",
        toneClass,
        className,
      )}
      {...props}
    >
      {status && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children ?? (status ? STATUS_LABEL[status] : null)}
    </span>
  );
}
