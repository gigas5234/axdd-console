"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  GitMerge,
  ThumbsDown,
  ThumbsUp,
  Eye,
  Filter,
  Target,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReleasePipeline } from "@/components/governance/release-pipeline";
import { runs, workUnits } from "@/lib/data";
import { formatRelative, cn } from "@/lib/utils";
// MOCK: Risk Log / Decision Log / Domain Fit 모두 정적 mock
import {
  MOCK_RISKS,
  MOCK_DECISIONS,
  RISK_TONE,
  MOCK_DOMAIN_FIT,
} from "@/mocks";
import type { Run } from "@/lib/types";

type ReviewFilter = "all" | "needs-review" | "pending";

const REVIEW_FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "needs-review", label: "Needs Review" },
  { id: "pending", label: "Pending" },
];

function applyReviewFilter(filter: ReviewFilter, list: Run[]): Run[] {
  if (filter === "all")
    return list.filter(
      (r) => r.status === "needs-review" || r.status === "pending",
    );
  return list.filter((r) => r.status === filter);
}

export default function GovernancePage() {
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [decisions, setDecisions] = useState<
    Record<string, "approved" | "rejected" | "deferred" | undefined>
  >({});

  const reviewQueue = useMemo(
    () => applyReviewFilter(reviewFilter, runs),
    [reviewFilter],
  );

  const counts = useMemo(
    () => ({
      all: applyReviewFilter("all", runs).length,
      "needs-review": runs.filter((r) => r.status === "needs-review").length,
      pending: runs.filter((r) => r.status === "pending").length,
    }),
    [],
  );

  const stats = useMemo(() => {
    return {
      pendingReview: counts.all,
      approved: workUnits.filter((w) => w.status === "approved").length,
      released: workUnits.filter((w) => w.status === "released").length,
      risks: MOCK_RISKS.length,
    };
  }, [counts]);

  function setDecision(
    id: string,
    value: "approved" | "rejected" | "deferred",
  ) {
    setDecisions((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <>
      <AppHeader
        title="Governance"
        subtitle="검증·승인·릴리즈 관리 / Review Queue + Decision Log"
      />
      <main className="px-6 py-6 space-y-5">
        <section>
          <h1 className="h-page">Governance</h1>
          <p className="h-sub">
            산출물 검증, 휴먼 리뷰, 릴리즈 후보를 관리하고 리스크와 결정 사항을 추적합니다.
          </p>
        </section>

        {/* Stats summary */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="label-eyebrow">Pending Reviews</div>
                  <div className="mt-1 text-2xl font-semibold text-ink-900">
                    {stats.pendingReview}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="label-eyebrow">Approved</div>
                  <div className="mt-1 text-2xl font-semibold text-ink-900">
                    {stats.approved}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="label-eyebrow">Released</div>
                  <div className="mt-1 text-2xl font-semibold text-ink-900">
                    {stats.released}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <GitMerge className="h-4 w-4" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="label-eyebrow">Open Risks</div>
                  <div className="mt-1 text-2xl font-semibold text-ink-900">
                    {stats.risks}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Release Pipeline */}
        <ReleasePipeline workUnits={workUnits} />

        {/* Domain Fit Distribution — Sandbox 실행 결과의 도메인 보존 통계 */}
        <Card>
          <CardHeader className="flex items-start justify-between flex-row gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent-indigo" /> Domain Fit
                Distribution
              </CardTitle>
              <p className="text-xs text-ink-500 mt-1">
                최근 실행의 도메인 보존 결과 — 사용자 요청 도메인이 산출물에 일관 유지됐는지 의미 검증
              </p>
            </div>
            <Badge tone="bg-white text-ink-600 border-ink-200">
              {MOCK_DOMAIN_FIT.length} runs
            </Badge>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-ink-50">
                  <tr>
                    <th className="text-left font-semibold text-ink-700 px-3 py-2">
                      Run
                    </th>
                    <th className="text-left font-semibold text-ink-700 px-3 py-2">
                      Domain
                    </th>
                    <th className="text-left font-semibold text-ink-700 px-3 py-2">
                      Prompt
                    </th>
                    <th className="text-right font-semibold text-ink-700 px-3 py-2">
                      Hits
                    </th>
                    <th className="text-right font-semibold text-ink-700 px-3 py-2">
                      Leak
                    </th>
                    <th className="text-left font-semibold text-ink-700 px-3 py-2">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DOMAIN_FIT.map((row) => (
                    <tr
                      key={row.runId}
                      className="border-t border-ink-100 hover:bg-ink-50/60"
                    >
                      <td className="px-3 py-2 font-mono text-[11px] text-ink-600">
                        {row.runId}
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          tone={
                            row.domain === "unknown"
                              ? "bg-slate-100 text-slate-500 border-slate-200"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }
                        >
                          {row.domain}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-ink-700 max-w-[260px] truncate">
                        {row.promptSnippet}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-ink-900 font-semibold">
                        {row.domainHits}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2 text-right font-mono",
                          row.otherDomainHits === 0
                            ? "text-emerald-700"
                            : row.otherDomainHits <= 3
                              ? "text-amber-700"
                              : "text-rose-700",
                        )}
                      >
                        {row.otherDomainHits}
                      </td>
                      <td className="px-3 py-2">
                        <Badge status={row.validationStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-ink-500">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-medium text-ink-700">Leak</span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  0 = 완벽 보존
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600" />
                  ≤ 3 = 허용 (passed-with-review)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-600" />
                  {">"} 3 = needs-review
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-medium text-ink-700">Status (4-state)</span>
                <span className="inline-flex items-center gap-1">
                  <Badge status="passed" />
                  자동 + 휴먼 모두 OK
                </span>
                <span className="inline-flex items-center gap-1">
                  <Badge status="passed-with-review" />
                  자동 OK, 휴먼 리뷰 대기
                </span>
                <span className="inline-flex items-center gap-1">
                  <Badge status="needs-review" />
                  warning (도메인 누출)
                </span>
                <span className="inline-flex items-center gap-1">
                  <Badge status="failed" />
                  error (필수 누락)
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Review Queue (with action buttons) */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex items-center justify-between flex-row gap-3 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" /> Review Queue
                </CardTitle>
                <p className="text-xs text-ink-500 mt-1">
                  Sandbox 결과 중 휴먼 리뷰가 필요한 항목
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3 w-3 text-ink-400" />
                {REVIEW_FILTERS.map((f) => {
                  const active = reviewFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setReviewFilter(f.id)}
                      className={cn(
                        "h-7 px-2.5 rounded-md text-[11px] font-medium border transition",
                        active
                          ? "bg-ink-900 text-white border-ink-900"
                          : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50",
                      )}
                    >
                      {f.label}
                      <span
                        className={cn(
                          "ml-1",
                          active ? "text-ink-300" : "text-ink-400",
                        )}
                      >
                        {counts[f.id]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              {reviewQueue.length === 0 ? (
                <p className="text-sm text-ink-500 py-6 text-center">
                  대기 중인 리뷰가 없습니다.
                </p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {reviewQueue.map((r) => {
                    const decision = decisions[r.id];
                    return (
                      <li
                        key={r.id}
                        className="py-3 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-ink-900 truncate">
                            “{r.prompt}”
                          </div>
                          <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="font-mono">{r.id}</span>
                            <span>·</span>
                            <span>{r.selectedSkills.length} skills</span>
                            <span>·</span>
                            <span>{formatRelative(r.createdAt)}</span>
                            <span>·</span>
                            <Badge status={r.validation.status} />
                          </div>
                          {r.validation.issues.length > 0 && (
                            <ul className="mt-1 text-[11px] text-rose-600 space-y-0.5">
                              {r.validation.issues.map((i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-1"
                                >
                                  <AlertTriangle className="h-3 w-3" /> {i}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {decision ? (
                            <Badge
                              tone={
                                decision === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : decision === "rejected"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                              }
                            >
                              {decision === "approved"
                                ? "✓ Approved"
                                : decision === "rejected"
                                  ? "✗ Rejected"
                                  : "Deferred"}
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setDecision(r.id, "approved")}
                                className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                title="승인"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDecision(r.id, "rejected")}
                                className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                title="반려"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDecision(r.id, "deferred")}
                                className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                                title="보류"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Risk Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> Risk Log
              </CardTitle>
            </CardHeader>
            <CardBody className="pt-2 space-y-2">
              {MOCK_RISKS.map((r) => (
                <div
                  key={r.title}
                  className="rounded-lg border border-ink-100 px-3 py-2 bg-white/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium text-ink-900">
                      {r.title}
                    </div>
                    <Badge tone={RISK_TONE[r.impact]}>{r.impact}</Badge>
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    완화: {r.mitigation}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Decision Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Decision Log
            </CardTitle>
          </CardHeader>
          <CardBody className="pt-2">
            <ol className="relative border-l border-ink-200 pl-4 space-y-3">
              {MOCK_DECISIONS.map((d) => (
                <li key={d.title} className="relative">
                  <div className="absolute -left-[1.4rem] h-3 w-3 rounded-full bg-accent-indigo border-2 border-white" />
                  <div className="text-[11px] font-mono text-ink-500">
                    {d.date}
                  </div>
                  <div className="text-sm font-medium text-ink-900">
                    {d.title}
                  </div>
                  <div className="text-xs text-ink-500">— {d.who}</div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
