"use client";

import { useState } from "react";
import {
  MessageCircleQuestion,
  SkipForward,
  Send,
  AlertCircle,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClarifyingQuestion } from "@/skills/_runtime/clarifying";
import type { UnknownField } from "@/skills/_runtime/intent";

/**
 * 정적 카탈로그에서 가져온 clarifying 질문을 표시.
 *
 * 최소 정보 게이트:
 * - domain 질문이 있으면 필수 표시 + 미답 시 실행 차단
 * - 나머지는 옵셔널 (답 안 해도 진행 가능, 산출물에 TBD)
 */
export function ClarifyingCard({
  questions,
  onAnswer,
  onSkip,
}: {
  questions: ClarifyingQuestion[];
  onAnswer: (answers: Record<UnknownField, string>) => void;
  onSkip: () => void;
}) {
  const [answers, setAnswers] = useState<Record<UnknownField, string>>(
    {} as Record<UnknownField, string>,
  );

  function pick(field: UnknownField, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const hasAnswers = answeredCount > 0;

  // 도메인은 최소 필수 정보로 취급 (있을 때만)
  const domainQuestion = questions.find((q) => q.field === "domain");
  const domainAnswered = domainQuestion ? !!answers["domain"] : true;
  const canApplyAndRun = domainAnswered && hasAnswers;

  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <MessageCircleQuestion className="h-4 w-4" />
          정보가 부족해요 — 최소한만 알려주실래요?
        </CardTitle>
        <p className="text-xs text-amber-800/80 mt-1">
          {domainQuestion
            ? "**도메인**은 필수예요. 그래야 산출물이 일관성 있게 생성됩니다. 나머지는 선택이고, 미답변 항목은 TBD로 채워집니다."
            : "확실한 답이 어려우시면 [건너뛰기] 가능. 부족한 정보는 산출물에 TBD로 표시돼요."}
        </p>
      </CardHeader>
      <CardBody className="pt-2 space-y-3">
        {questions.map((q) => {
          const isRequired = q.field === "domain";
          const isAnswered = !!answers[q.field];
          return (
            <div
              key={q.field}
              className={cn(
                "rounded-lg border p-3",
                isRequired && !isAnswered
                  ? "border-amber-400 bg-white"
                  : "border-amber-200 bg-white/80",
              )}
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-medium text-ink-900">
                  {q.question}
                </span>
                {isRequired && (
                  <Badge tone="bg-rose-50 text-rose-700 border-rose-200">
                    필수
                  </Badge>
                )}
                {isAnswered && (
                  <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
                    선택됨
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {q.options.map((opt) => {
                  const selected = answers[q.field] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => pick(q.field, opt.value)}
                      className={cn(
                        "h-7 px-2.5 rounded-md text-xs border transition",
                        selected
                          ? "bg-ink-900 text-white border-ink-900"
                          : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {domainQuestion && !domainAnswered && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span className="text-xs text-rose-700">
              도메인 답변이 필요해요. 답하지 않으면 산출물이 일반론으로 흘러갑니다.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <span className="text-xs text-ink-600">
            {answeredCount}/{questions.length} 답변됨
            {canApplyAndRun && (
              <span className="ml-2 text-emerald-700 font-medium">
                · 실행 가능
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <SkipForward className="h-3.5 w-3.5" /> 건너뛰기 (TBD로 진행)
            </Button>
            <Button
              variant={canApplyAndRun ? "primary" : "secondary"}
              size="sm"
              onClick={() => onAnswer(answers)}
              disabled={!canApplyAndRun}
              title={
                !canApplyAndRun
                  ? "도메인 답변이 필요합니다"
                  : "프롬프트에 답변을 합치고 바로 실행합니다"
              }
            >
              <Send className="h-3.5 w-3.5" /> 적용하고 자동 실행
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
