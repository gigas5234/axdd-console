"use client";

import { Brain, Info, AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RunIntent } from "@/skills/_runtime/intent";

const UNKNOWN_LABEL: Record<string, string> = {
  domain: "도메인",
  tone: "톤·무드",
  timeline: "일정",
  "team-size": "팀 규모",
  "existing-design-system": "기존 디자인 시스템",
  "target-persona": "타겟 페르소나",
  "scope-specifics": "범위 상세",
  platform: "플랫폼",
};

const SCOPE_LABEL: Record<string, string> = {
  needsRequirementSummary: "요구사항 요약",
  needsIA: "IA",
  needsUserFlow: "User Flow",
  needsDesignSystem: "디자인 시스템",
  needsComponentSpec: "컴포넌트 스펙",
  needsHandoff: "핸드오프",
  needsKickoffReport: "착수보고서",
  needsCICD: "CI/CD",
};

export function IntentCard({ intent }: { intent: RunIntent }) {
  const scopeKeys = (Object.keys(intent.scope) as Array<keyof typeof intent.scope>).filter(
    (k) => intent.scope[k],
  );

  const confidenceLevel: "high" | "medium" | "low" =
    intent.confidence >= 0.7 ? "high" : intent.confidence >= 0.4 ? "medium" : "low";
  const confidenceTone =
    confidenceLevel === "high"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : confidenceLevel === "medium"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <Card>
      <CardHeader className="flex items-start justify-between flex-row">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-accent-indigo" />
            Intent 분석
            <span className="text-[10px] font-normal text-ink-500">
              ({intent.mode === "llm" ? "LLM" : "휴리스틱"})
            </span>
          </CardTitle>
          <p className="text-xs text-ink-500 mt-1">
            자연어를 구조화된 의도로 분해 — 각 스킬이 이걸 보고 무엇을 만들지 결정
          </p>
        </div>
        <Badge tone={confidenceTone}>
          신뢰도 {Math.round(intent.confidence * 100)}%
        </Badge>
      </CardHeader>
      <CardBody className="pt-2 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-ink-100 bg-white/60 px-3 py-2">
            <div className="label-eyebrow">Domain</div>
            <div className="mt-0.5 text-sm font-medium text-ink-900">
              {intent.domain === "unknown" ? (
                <span className="text-ink-400 italic">미지정</span>
              ) : (
                intent.domain
              )}
            </div>
          </div>
          <div className="rounded-lg border border-ink-100 bg-white/60 px-3 py-2">
            <div className="label-eyebrow">Tone</div>
            <div className="mt-0.5 text-sm font-medium text-ink-900">
              {intent.tone === "unknown" ? (
                <span className="text-ink-400 italic">미지정</span>
              ) : (
                intent.tone
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="label-eyebrow mb-1.5">감지된 작업 범위</div>
          {scopeKeys.length === 0 ? (
            <p className="text-xs text-ink-400 italic">
              구체적 범위가 명시되지 않음
            </p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {scopeKeys.map((k) => (
                <Badge
                  key={k}
                  tone="bg-indigo-50 text-indigo-700 border-indigo-200"
                >
                  ✓ {SCOPE_LABEL[k] ?? k}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {intent.unknowns.length > 0 && (
          <div>
            <div className="label-eyebrow mb-1.5 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              명시되지 않은 정보 ({intent.unknowns.length}개)
            </div>
            <div className="flex flex-wrap gap-1">
              {intent.unknowns.map((u) => (
                <Badge
                  key={u}
                  tone="bg-amber-50 text-amber-700 border-amber-200"
                >
                  ⚠️ {UNKNOWN_LABEL[u] ?? u}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-ink-500 flex items-start gap-1">
              <Info className="h-3 w-3 shrink-0 mt-0.5" />
              해당 정보는 산출물에 <code className="font-mono bg-ink-100 px-1 rounded">TBD</code> 로 표시되며, validation 단계에서 휴먼 리뷰 항목으로 떠넘겨집니다.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
