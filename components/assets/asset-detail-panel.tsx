"use client";

import {
  X,
  Boxes,
  AlertTriangle,
  ArrowUpFromLine,
  Eye,
  Download,
  Tag,
  Link2,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AssetItem, Skill } from "@/lib/types";
import { skills } from "@/lib/data";

const RISK_TONE: Record<AssetItem["duplicateRisk"], string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

const TYPE_TONE: Record<AssetItem["type"], string> = {
  reference: "bg-sky-50 text-sky-700 border-sky-200",
  template: "bg-violet-50 text-violet-700 border-violet-200",
  script: "bg-emerald-50 text-emerald-700 border-emerald-200",
  output: "bg-indigo-50 text-indigo-700 border-indigo-200",
  asset: "bg-amber-50 text-amber-700 border-amber-200",
};

export function AssetDetailPanel({
  asset,
  onClose,
}: {
  asset: AssetItem | null;
  onClose: () => void;
}) {
  if (!asset) return null;
  const related = skills.filter((s) =>
    asset.relatedSkills.includes(s.id),
  ) as Skill[];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] lg:w-[540px] p-4 sm:p-6">
      <Card className="h-full overflow-hidden flex flex-col glass-strong">
        <div className="px-5 py-4 border-b border-ink-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={TYPE_TONE[asset.type]}>{asset.type}</Badge>
              <Badge status={asset.status} />
              {asset.migrationCandidate && (
                <Badge tone="bg-indigo-50 text-indigo-700 border-indigo-200">
                  <ArrowUpFromLine className="h-3 w-3" /> Migration
                </Badge>
              )}
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">
              {asset.name}
            </h2>
            <div className="mt-1 text-xs font-mono text-ink-500 truncate">
              {asset.path}
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-ink-100"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section className="grid grid-cols-2 gap-3">
            <Card glass={false}>
              <CardBody>
                <div className="label-eyebrow flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Category
                </div>
                <div className="mt-1 text-sm font-medium text-ink-900">
                  {asset.category}
                </div>
              </CardBody>
            </Card>
            <Card glass={false}>
              <CardBody>
                <div className="label-eyebrow flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> 중복 위험
                </div>
                <div className="mt-1">
                  <Badge tone={RISK_TONE[asset.duplicateRisk]}>
                    {asset.duplicateRisk}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          </section>

          <section>
            <div className="label-eyebrow mb-1.5">Source</div>
            <Card glass={false}>
              <CardBody className="text-sm text-ink-700">
                <span className="font-mono text-xs">{asset.source}</span>
              </CardBody>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="h-4 w-4 text-ink-500" />
              <h4 className="text-sm font-semibold text-ink-900">
                Related Skills
              </h4>
            </div>
            {related.length === 0 ? (
              <p className="text-xs text-ink-500">
                연결된 스킬이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {related.map((s) => (
                  <Card key={s.id} glass={false}>
                    <CardBody className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ink-900 truncate">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-ink-500 line-clamp-1">
                            {s.description}
                          </div>
                        </div>
                        <Badge status={s.status} />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {asset.migrationCandidate && (
            <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
              <div className="flex items-start gap-2.5">
                <Boxes className="h-4 w-4 text-accent-indigo mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-indigo-900">
                    Migration Candidate
                  </div>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    이 자산은 새 카탈로그로 옮겨질 후보예요. Governance에서 승인 후 정식 자산으로 등록할 수 있습니다.
                  </p>
                </div>
              </div>
            </section>
          )}

          {asset.duplicateRisk === "high" && (
            <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-rose-900">
                    중복 위험: high
                  </div>
                  <p className="text-xs text-rose-800/80 mt-0.5">
                    유사한 이름·구조의 자산이 다른 위치에 있을 수 있어요. 동일성 확인 후 통합 또는 폐기를 검토하세요.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="px-5 py-4 border-t border-ink-100 flex items-center justify-between gap-2 bg-white/60">
          <div className="text-xs text-ink-500 truncate">
            <span className="font-mono">{asset.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-3.5 w-3.5" /> 미리보기
            </Button>
            <Button size="sm">
              <Download className="h-3.5 w-3.5" /> 다운로드
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
