"use client";

/**
 * AXDD Design System 상태 카드 — Asset Repository 탭 상단.
 *
 * 회의록 결정 반영: AXDD DS는 "고정 자산"이므로 미리 박혀있어야 한다.
 * - 비어있음 → DS Bootstrap 워크유닛으로 부트스트랩 권유
 * - 일부 채워짐 → 채움 비율 표시 + 편집 안내
 * - 완성 → 토큰/컴포넌트 카운트 표시
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Palette, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  EMPTY_DS_STATUS,
  type DesignSystemStatus,
} from "@/lib/our-design-system";

export function AxddDsCard() {
  const [status, setStatus] = useState<DesignSystemStatus>(EMPTY_DS_STATUS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/design-system/status")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setStatus(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tone =
    status.state === "ready"
      ? "border-emerald-300 bg-emerald-50/40"
      : status.state === "partial"
        ? "border-amber-300 bg-amber-50/40"
        : "border-slate-300 bg-slate-50/40";

  const iconTone =
    status.state === "ready"
      ? "bg-emerald-100 text-emerald-700"
      : status.state === "partial"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <Card className={cn("border-2", tone)}>
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center",
              iconTone,
            )}
          >
            <Palette className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-ink-900">
                AXDD Design System
              </span>
              <Badge
                tone={
                  status.state === "ready"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : status.state === "partial"
                      ? "bg-amber-100 text-amber-700 border-amber-300"
                      : "bg-slate-100 text-slate-600 border-slate-300"
                }
              >
                {status.state === "ready"
                  ? "Ready"
                  : status.state === "partial"
                    ? "Partial"
                    : "Scaffold"}
              </Badge>
              {status.lastUpdated && (
                <span className="text-[11px] text-ink-400 font-mono">
                  {status.lastUpdated}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-ink-600">{status.label}</p>

            {/* 카운트 통계 */}
            {!loading && status.state !== "scaffold" && (
              <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-600 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <span className="font-mono font-semibold text-ink-900">
                    {status.filledColorTokens}
                  </span>
                  color tokens
                </span>
                <span className="text-ink-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <span className="font-mono font-semibold text-ink-900">
                    {status.filledComponents}
                  </span>
                  components
                </span>
                {status.todoCount > 0 && (
                  <>
                    <span className="text-ink-300">·</span>
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertCircle className="h-3 w-3" />
                      {status.todoCount} TODO
                    </span>
                  </>
                )}
              </div>
            )}

            {/* 액션 — scaffold일 때만 안내 */}
            {status.state === "scaffold" && !loading && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/sandbox?preset=ds-bootstrap"
                  className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md bg-accent-indigo text-white text-xs font-medium hover:bg-indigo-600"
                >
                  DS Bootstrap 실행
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <span className="text-[11px] text-ink-500">
                  또는{" "}
                  <code className="px-1 py-0.5 rounded bg-white border border-ink-200">
                    data/our-design-system.md
                  </code>{" "}
                  직접 편집
                </span>
              </div>
            )}

            {/* 4-Case 매트릭스 가능 여부 */}
            {!loading && (
              <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                <CaseChip
                  label="A · DS Bootstrap"
                  enabled={status.enables.case_a_bootstrap}
                />
                <CaseChip
                  label="B · AXDD 내부"
                  enabled={status.enables.case_b_axdd_internal}
                />
                <CaseChip
                  label="C · 고객사"
                  enabled={status.enables.case_c_customer_project}
                />
                <CaseChip
                  label="D · 요구사항만"
                  enabled={status.enables.case_d_requirement_only}
                />
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function CaseChip({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div
      className={cn(
        "h-7 px-2 inline-flex items-center gap-1.5 rounded-md text-[11px] border",
        enabled
          ? "bg-white text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-400 border-slate-200",
      )}
    >
      {enabled ? (
        <CheckCircle2 className="h-3 w-3 shrink-0" />
      ) : (
        <AlertCircle className="h-3 w-3 shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
}
