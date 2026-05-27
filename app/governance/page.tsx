"use client";

/**
 * Phase 7 Cleanup: Governance를 AxDD-SKILLS reference 정합으로 단순화.
 *
 * 삭제:
 *   - MOCK_DOMAIN_FIT 통계 (Phase 6 외부 산업 도메인 fit)
 *   - halted-runs localStorage 큐 (Phase 6 Human Gate Reject)
 *   - Filter 토글 (needs-review / pending)
 *
 * 유지:
 *   - Release Pipeline (워크유닛 상태 시각화)
 *   - Review Queue (정적 runs 데이터)
 *   - Risk Log / Decision Log
 *
 * 신규:
 *   - Acceptance Rules 카드 (reference의 governance-lite/ACCEPTANCE_RULES.md 미러)
 */

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  GitMerge,
  ThumbsDown,
  ThumbsUp,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReleasePipeline } from "@/components/governance/release-pipeline";
import { runs, workUnits } from "@/lib/data";
import { formatRelative } from "@/lib/utils";
import { MOCK_RISKS, MOCK_DECISIONS, RISK_TONE } from "@/mocks";

export default function GovernancePage() {
  const [decisions, setDecisions] = useState<
    Record<string, "approved" | "rejected" | "deferred" | undefined>
  >({});

  const reviewQueue = useMemo(
    () =>
      runs.filter(
        (r) => r.status === "needs-review" || r.status === "pending",
      ),
    [],
  );

  const stats = useMemo(() => {
    return {
      pendingReview: reviewQueue.length,
      approved: workUnits.filter((w) => w.status === "approved").length,
      released: workUnits.filter((w) => w.status === "released").length,
      risks: MOCK_RISKS.length,
    };
  }, [reviewQueue]);

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
        subtitle="AxDD-SKILLS reference 호환 — Acceptance Rule / Review Queue / Risk Log"
      />
      <main className="px-6 py-6 space-y-5">
        <section>
          <h1 className="h-page">Governance</h1>
          <p className="h-sub">
            AxDD-SKILLS reference의 governance-lite 정책에 맞춰 산출물 검증·승인을 관리합니다.
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

        {/* Acceptance Rule (reference의 governance-lite/ACCEPTANCE_RULES.md 미러) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Acceptance Rule
            </CardTitle>
            <p className="text-xs text-ink-500 mt-1">
              AxDD-SKILLS reference의 `governance-lite/ACCEPTANCE_RULES.md` 정책. Enterprise Export에 그대로 포함됩니다.
            </p>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="space-y-3">
              <div className="rounded-lg border border-ink-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-ink-900 mb-2">
                  Pack / Work Unit
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-ink-100">
                      <td className="py-1.5 pr-3 w-24">
                        <Badge tone="bg-slate-100 text-slate-700 border-slate-200">
                          Draft
                        </Badge>
                      </td>
                      <td className="text-ink-600">
                        pack.yaml 또는 workunit.yaml 존재
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-3">
                        <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Accepted
                        </Badge>
                      </td>
                      <td className="text-ink-600">
                        <code className="font-mono">axe_check.py</code> 통과 +
                        ToyProject 1회 Run + Reviewer 승인
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border border-ink-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-ink-900 mb-2">
                  Skill
                </div>
                <ul className="text-xs text-ink-600 space-y-1">
                  <li>• <code className="font-mono">validate-skill</code> 통과</li>
                  <li>• Role Owner 또는 Solution Pack Owner 리뷰</li>
                </ul>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
                <div className="text-xs text-amber-900">
                  <strong>자동화 한계</strong>: Scorecard(정성 평가)는 수동.
                  <code className="font-mono ml-1">axe_check.py</code>는 누락·형식·명백한 secret만 검출.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Review Queue */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" /> Review Queue
              </CardTitle>
              <p className="text-xs text-ink-500 mt-1">
                휴먼 리뷰가 필요한 항목 — Enterprise Export 시 메타 정보로 포함될 수 있음
              </p>
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
                            "{r.prompt}"
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
