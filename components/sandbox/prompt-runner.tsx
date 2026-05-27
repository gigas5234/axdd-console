"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Webhook,
  ArrowRight,
  Sparkles,
  Maximize2,
  Minimize2,
  Clock,
  RotateCw,
  Package,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarkdownView } from "@/components/ui/markdown-view";
import { SkillCard } from "@/components/skills/skill-card";
import { WorkUnitFlow } from "@/components/work-units/workunit-flow";
import { FigmaExportPanel } from "@/components/sandbox/figma-export-panel";
import { PresetGallery } from "@/components/sandbox/preset-gallery";
import { IntentCard } from "@/components/sandbox/intent-card";
import { ClarifyingCard } from "@/components/sandbox/clarifying-card";
import { workUnits, skills } from "@/lib/data";
import { routeBest } from "@/lib/hook-router";
import type { HookMatch } from "@/lib/hook-router";
import type { Skill, WorkUnit } from "@/lib/types";
import { figmaPromptAdapter, type DesignFoundation } from "@/lib/figma";
import { downloadResultZip } from "@/lib/result-export";
import { extractIntent } from "@/skills/_runtime/intent";
import type { RunIntent, UnknownField } from "@/skills/_runtime/intent";
import { getDomainProfile } from "@/skills/_runtime/domain-profiles";
import {
  getClarifyingQuestions,
  applyClarifyingAnswers,
} from "@/skills/_runtime/clarifying";
import { cn } from "@/lib/utils";

// MOCK fallback — LLM 키 없을 때 화면이 비어 보이지 않도록 사용
// ⚠️ LLM 교체 시: 아래 import는 모두 제거 가능 (api/run 결과로 직접 대체)
import {
  getSampleOutput,
  freshSteps,
  freshSkillStates,
  simulateExecution,
  runMockValidation,
  expectedTotalRangeMs,
  HumanGateRejectedError,
  buildHaltedRun,
  pushHaltedRun,
  type MockStep,
  type SkillRunState,
  type SandboxPreset,
  type HumanGateDecision,
} from "@/mocks";

type Phase = "idle" | "running" | "done" | "halted";

/** 현재 사용자 승인을 기다리는 Human Gate 상태 */
interface PendingGate {
  skillId: string;
  completed: number;
  total: number;
  resolve: (decision: HumanGateDecision) => void;
}

export function PromptRunner() {
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [steps, setSteps] = useState<MockStep[]>(freshSteps());
  const [skillStates, setSkillStates] = useState<
    Record<string, SkillRunState>
  >({});
  const [currentSkillId, setCurrentSkillId] = useState<string | undefined>();
  const [activePreset, setActivePreset] = useState<string | undefined>();
  const [expanded, setExpanded] = useState(false);

  // Human Gate 상태 — humanGate=true 워크유닛에서만 활성
  const [pendingGate, setPendingGate] = useState<PendingGate | null>(null);
  const [haltedAt, setHaltedAt] = useState<{
    skillId: string;
    completed: number;
    total: number;
  } | null>(null);

  // LLM/실 API 응답 (있으면 우선 표시)
  const [liveOutput, setLiveOutput] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState<"llm" | "mock" | null>(null);

  // Hook 매칭 결과 — 라우터에서 비동기로 받아옴
  const [match, setMatch] = useState<HookMatch | null>(null);

  // Intent 분석 — 프롬프트 입력될 때마다 휴리스틱 추출
  const intent: RunIntent | null = useMemo(
    () => (prompt.trim() ? extractIntent(prompt) : null),
    [prompt],
  );
  const clarifyingQuestions = useMemo(
    () => (intent ? getClarifyingQuestions(intent) : []),
    [intent],
  );
  const [clarifyingDismissed, setClarifyingDismissed] = useState(false);

  const skillsById = useMemo<Record<string, Skill>>(
    () => Object.fromEntries(skills.map((s) => [s.id, s])),
    [],
  );

  // 프롬프트 바뀔 때마다 라우팅 다시 (debounced)
  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      const best = await routeBest(prompt);
      if (!cancelled) setMatch(best);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [prompt]);

  const workUnit: WorkUnit | undefined = match
    ? workUnits.find((w) => w.id === match.workUnitId)
    : undefined;
  const matchedSkillIds = workUnit?.skills ?? [];
  const matchedSkills = matchedSkillIds
    .map((id) => skillsById[id])
    .filter(Boolean) as Skill[];

  const [minTotal, maxTotal] = expectedTotalRangeMs(matchedSkillIds.length);

  function applyPreset(preset: SandboxPreset) {
    setPrompt(preset.prompt);
    setActivePreset(preset.id);
    setClarifyingDismissed(false);
    resetExecution();
  }

  function resetExecution() {
    setPhase("idle");
    setSteps(freshSteps());
    setSkillStates({});
    setCurrentSkillId(undefined);
    setLiveOutput(null);
    setLiveMode(null);
    setExpanded(false);
    setPendingGate(null);
    setHaltedAt(null);
  }

  /** Approve/Reject 버튼 클릭 핸들러 — pendingGate가 있을 때만 의미 있음 */
  function decideGate(decision: HumanGateDecision) {
    if (!pendingGate) return;
    pendingGate.resolve(decision);
    setPendingGate(null);
  }

  /**
   * Clarifying 답변 적용 + 자동 실행.
   *
   * 상태 업데이트(setPrompt)는 비동기라 state에 의존하지 않고,
   * 합쳐진 프롬프트를 직접 execute에 전달한다.
   */
  async function applyClarifying(answers: Record<UnknownField, string>) {
    const merged = applyClarifyingAnswers(prompt, answers);
    setPrompt(merged);
    setClarifyingDismissed(true);
    // 자동 실행 — state 업데이트 기다리지 않고 merged prompt 직접 사용
    await execute(merged);
  }

  /**
   * 실행 함수. overridePrompt가 주어지면 그것으로 re-routing 후 실행.
   * 그렇지 않으면 state의 match/prompt를 사용.
   */
  async function execute(overridePrompt?: string) {
    const promptToUse = overridePrompt ?? prompt;

    // override가 주어지면 새로 라우팅 (state가 아직 업데이트 안 됐을 수 있음)
    let currentMatch = match;
    if (overridePrompt !== undefined) {
      currentMatch = await routeBest(overridePrompt);
    }
    if (!currentMatch) return;

    const targetWorkUnit = workUnits.find(
      (w) => w.id === currentMatch.workUnitId,
    );
    if (!targetWorkUnit) return;

    setPhase("running");
    setLiveOutput(null);
    setLiveMode(null);
    setPendingGate(null);
    setHaltedAt(null);

    // ⚠️ LLM 교체 시: 아래 Promise.all 안의 simulateExecution 호출 제거,
    //    fetch를 streaming으로 받아 setSteps/setSkillStates를 직접 갱신.
    const fetchPromise = fetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        workUnitId: targetWorkUnit.id,
        prompt: promptToUse,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return (await res.json()) as {
          mode: "llm" | "mock";
          finalMarkdown: string;
        };
      })
      .catch(() => null);

    // Human Gate 활성 워크유닛이면 awaitApproval 콜백 등록
    const completedSkills: string[] = [];
    const awaitApproval = targetWorkUnit.humanGate
      ? async (
          skillId: string,
          completed: number,
          total: number,
        ): Promise<HumanGateDecision> => {
          completedSkills.push(skillId);
          return new Promise<HumanGateDecision>((resolve) => {
            setPendingGate({ skillId, completed, total, resolve });
          });
        }
      : undefined;

    try {
      const [, apiResult] = await Promise.all([
        simulateExecution(
          targetWorkUnit.skills,
          (state) => {
            setSteps(state.steps);
            setSkillStates(state.skillStates);
            setCurrentSkillId(state.currentSkillId);
          },
          { awaitApproval },
        ),
        fetchPromise,
      ]);

      if (apiResult) {
        setLiveMode(apiResult.mode);
        setLiveOutput(apiResult.finalMarkdown || null);
      }
      setCurrentSkillId(undefined);
      setPhase("done");
    } catch (err) {
      // Human Gate Reject → Governance 큐로 등록
      if (err instanceof HumanGateRejectedError) {
        const halted = buildHaltedRun({
          workUnitId: targetWorkUnit.id,
          prompt: promptToUse,
          matchedHook: currentMatch.hookId ?? "unknown",
          completedSkills,
          rejectedAtSkillId: err.skillId,
          totalSkills: targetWorkUnit.skills.length,
        });
        pushHaltedRun(halted);
        setHaltedAt({
          skillId: err.skillId,
          completed: err.completedCount,
          total: targetWorkUnit.skills.length,
        });
        setCurrentSkillId(undefined);
        setPhase("halted");
      } else {
        // 다른 예외 — 콘솔에만 남기고 done 처리
        console.error("[Sandbox] execution error:", err);
        setCurrentSkillId(undefined);
        setPhase("done");
      }
    }
  }

  // 출력 — 실제 API 응답이 있으면 그걸, 아니면 워크유닛별 mock 폴백
  const finalOutput =
    liveOutput ??
    (workUnit ? getSampleOutput(workUnit.id) : getSampleOutput(""));

  const validation = useMemo(
    () => runMockValidation(workUnit?.id, finalOutput, intent?.domain),
    [workUnit?.id, finalOutput, intent?.domain],
  );

  /**
   * Figma 디자인 파운데이션 컨텍스트 — intent.domain 기반 동적 생성.
   * AXDD 콘솔 컨텍스트 고정 텍스트(이전 버전) 제거됨.
   */
  const designFoundation: DesignFoundation = useMemo(() => {
    const profile = getDomainProfile(intent?.domain);
    return {
      projectName: profile.label,
      brandIdentity: profile.brandShort,
      uxFoundationMarkdown:
        workUnit?.id === "ux-ui-planning-workunit"
          ? finalOutput
          : `## UX Foundation\n도메인: ${profile.label}\n주요 페르소나:\n${profile.personas
              .map((p) => `- ${p.role}: ${p.goal}`)
              .join("\n")}`,
      uiFoundationMarkdown: `## UI Foundation — ${profile.label}\n${profile.colorTokens
        .slice(0, 6)
        .map((t) => `- \`${t.name}\` ${t.hex} — ${t.usage}`)
        .join("\n")}`,
      iaMarkdown: `## IA — ${profile.label}\n\`\`\`\n${profile.iaTree}\n\`\`\``,
      notes: `사용자 요청: "${prompt}" · 도메인: ${profile.id} · 톤: ${profile.toneDescriptors.join(", ")}`,
    };
  }, [intent?.domain, workUnit, finalOutput, prompt]);

  async function handleDownloadResult() {
    if (!workUnit) return;
    // UX/UI 워크유닛이면 Figma 프롬프트도 zip에 포함
    let figmaPrompt: string | undefined;
    if (workUnit.id === "ux-ui-planning-workunit") {
      const r = await figmaPromptAdapter.export(designFoundation);
      figmaPrompt = r.promptPayload;
    }
    await downloadResultZip({
      workUnit,
      prompt,
      mode: liveMode,
      output: finalOutput,
      validation,
      figmaPrompt,
      intent,
    });
  }

  /**
   * Bundle (결과 + 스킬셋) 다운로드.
   * 서버 endpoint가 skills/_runtime 파일 시스템을 읽어 zip을 만든다.
   * Claude Code에 그대로 풀 수 있는 구조 (BUNDLE.md + work-unit.json + skillset/ + result/).
   */
  async function handleDownloadBundle() {
    if (!workUnit) return;

    let figmaPrompt: string | undefined;
    if (workUnit.id === "ux-ui-planning-workunit") {
      const r = await figmaPromptAdapter.export(designFoundation);
      figmaPrompt = r.promptPayload;
    }

    const res = await fetch(`/api/work-units/${workUnit.id}/bundle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt,
        mode: liveMode,
        output: finalOutput,
        intent,
        validation,
        figmaPrompt,
      }),
    });
    if (!res.ok) {
      alert(`Bundle 생성 실패 (${res.status})`);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workUnit.id}-bundle-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const isIdle = phase === "idle";
  const isRunning = phase === "running";
  const isDone = phase === "done";
  const isHalted = phase === "halted";

  // 진행률 계산 (시각화용)
  const progressCount = Object.values(skillStates).filter(
    (s) => s === "done",
  ).length;
  const progressTotal = matchedSkillIds.length;

  return (
    <div className="space-y-4">
      {/* Preset Gallery — 컴팩트, Run 중에는 숨김 */}
      {isIdle && (
        <PresetGallery onSelect={applyPreset} selectedId={activePreset} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[440px,minmax(0,1fr)] gap-4">
        {/* ─────────── 좌측: 입력 + 매칭 + 실행 로그 ─────────── */}
        <div className="space-y-4 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>작업 지시 (Playbook)</CardTitle>
              <p className="text-xs text-ink-500 mt-1">
                위 프리셋을 클릭하거나 직접 입력하세요. [실행] 누르면 우측에서 프로세스를 볼 수 있어요.
              </p>
            </CardHeader>
            <CardBody className="pt-2 space-y-3">
              <Textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예) 신규 SaaS 환자 대시보드를 UX 기획해서 핸드오프 문서까지 만들어줘"
                disabled={isRunning}
              />

              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  {match ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Webhook className="h-3 w-3" /> Hook 매칭
                      </Badge>
                      <span className="text-xs text-ink-700 truncate">
                        {match.reason}
                      </span>
                      <span className="text-[11px] text-ink-400 shrink-0">
                        {Math.round(match.confidence * 100)}%
                      </span>
                    </div>
                  ) : prompt.trim() ? (
                    <Badge tone="bg-slate-100 text-slate-500 border-slate-200">
                      매칭되는 Hook 없음
                    </Badge>
                  ) : (
                    <span className="text-xs text-ink-400">
                      프롬프트를 입력하거나 프리셋을 선택하세요
                    </span>
                  )}
                </div>
                {isDone ? (
                  <Button onClick={resetExecution} variant="outline" size="md">
                    <RotateCw className="h-3.5 w-3.5" /> 다시 실행
                  </Button>
                ) : (
                  <Button
                    onClick={() => execute()}
                    disabled={!match || isRunning}
                    variant={match ? "primary" : "secondary"}
                  >
                    {isRunning ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    실행
                  </Button>
                )}
              </div>

              {isIdle && match && (
                <div className="text-[11px] text-ink-500 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />약 {Math.round(minTotal / 1000)}~
                  {Math.round(maxTotal / 1000)}초 소요 예상 ·{" "}
                  {workUnit?.skills.length}개 스킬 실행
                </div>
              )}
            </CardBody>
          </Card>

          {/* 실행 로그 — Run 시작 시점부터 활성 */}
          {(isRunning || isDone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  실행 로그
                  {isRunning && (
                    <Badge tone="bg-blue-50 text-blue-700 border-blue-200">
                      <Loader2 className="h-3 w-3 animate-spin" /> Running
                    </Badge>
                  )}
                  {isDone && (
                    <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Completed
                    </Badge>
                  )}
                  {isRunning && progressTotal > 0 && (
                    <span className="text-[11px] text-ink-500 ml-auto font-mono">
                      {progressCount}/{progressTotal} skills
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardBody className="pt-2">
                <ol className="space-y-1.5">
                  {steps.map((s, i) => (
                    <li
                      key={s.label}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition",
                        s.status === "done"
                          ? "border-emerald-200 bg-emerald-50/60"
                          : s.status === "running"
                            ? "border-accent-blue bg-blue-50/70 shadow-sm"
                            : "border-ink-200 bg-white/60",
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs text-ink-400 w-5">
                          {i + 1}.
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ink-900">
                            {s.label}
                          </div>
                          <div className="text-[11px] text-ink-500">
                            {s.ko}
                            {s.status === "running" &&
                              currentSkillId &&
                              s.label === "Output generated" && (
                                <span className="ml-1 text-accent-blue font-medium">
                                  · {skillsById[currentSkillId]?.name}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      {s.status === "done" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                      {s.status === "running" && (
                        <Loader2 className="h-4 w-4 text-accent-blue animate-spin" />
                      )}
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          )}
        </div>

        {/* ─────────── 우측: Run 후에만 시각화 ─────────── */}
        <div className="space-y-4 min-w-0">
          {isIdle && intent && (
            <>
              <IntentCard intent={intent} />
              {!clarifyingDismissed && clarifyingQuestions.length > 0 && (
                <ClarifyingCard
                  questions={clarifyingQuestions}
                  onAnswer={applyClarifying}
                  onSkip={() => setClarifyingDismissed(true)}
                />
              )}
            </>
          )}
          {isIdle && !intent && <IdleEmptyState hasMatch={!!match} />}
          {isIdle && intent && !match && (
            <NoMatchHint prompt={prompt} />
          )}

          {(isRunning || isDone || isHalted) && workUnit && (
            <Card>
              <CardHeader className="flex items-start justify-between flex-row">
                <div>
                  <CardTitle>{workUnit.name}</CardTitle>
                  <p className="text-xs text-ink-500 mt-1">
                    {isRunning
                      ? workUnit.humanGate
                        ? "스킬이 차례로 실행됩니다 · 각 단계 완료 후 Approve 필요"
                        : "스킬이 차례로 실행됩니다 · cyan 글로우 = 현재 실행 중"
                      : isHalted
                        ? "Human Gate에서 반려됨 · Governance 큐로 이동"
                        : "모든 스킬 실행 완료"}
                  </p>
                </div>
                <Badge status={workUnit.status} />
              </CardHeader>
              <CardBody className="pt-2 space-y-4">
                {/* 트랙 레전드 — UI/UX 워크유닛에서만 표시 */}
                {workUnit.tracks && (
                  <TrackLegend workUnit={workUnit} skillStates={skillStates} />
                )}

                <WorkUnitFlow
                  workUnit={workUnit}
                  skillsById={skillsById}
                  skillStates={skillStates}
                />

                {/* Human Gate — 사용자 결정 대기 중 */}
                {pendingGate && (
                  <HumanGatePanel
                    skillId={pendingGate.skillId}
                    completed={pendingGate.completed}
                    total={pendingGate.total}
                    skillName={
                      skillsById[pendingGate.skillId]?.name ??
                      pendingGate.skillId
                    }
                    onApprove={() => decideGate("approve")}
                    onReject={() => decideGate("reject")}
                  />
                )}

                {/* Halted notice */}
                {isHalted && haltedAt && (
                  <HaltedNotice
                    skillName={
                      skillsById[haltedAt.skillId]?.name ?? haltedAt.skillId
                    }
                    completed={haltedAt.completed}
                    total={haltedAt.total}
                  />
                )}

                <div>
                  <div className="label-eyebrow mb-2 flex items-center gap-2">
                    {isRunning
                      ? "실행 진행"
                      : isHalted
                        ? "실행 중단"
                        : "실행 완료"}
                    <ArrowRight className="h-3 w-3 text-ink-400" />
                    <span className="text-ink-400 font-mono">
                      {progressCount}/{progressTotal}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matchedSkills.map((s) => (
                      <SkillCard
                        key={s.id}
                        skill={s}
                        runState={skillStates[s.id] ?? "pending"}
                      />
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {isDone && workUnit && (
            <>
              <Card>
                <CardHeader className="flex items-start justify-between flex-row">
                  <div>
                    <CardTitle>Output Preview</CardTitle>
                    <p className="text-xs text-ink-500 mt-1">
                      {workUnit.output.length}개 산출물 · Markdown
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {liveMode === "llm" ? (
                      <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
                        LLM 실행
                      </Badge>
                    ) : liveMode === "mock" ? (
                      <Badge tone="bg-amber-50 text-amber-700 border-amber-200">
                        Mock 폴백
                      </Badge>
                    ) : null}
                    <Badge status="passed" />
                    <button
                      onClick={handleDownloadResult}
                      className="h-7 px-2.5 inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white text-xs text-ink-700 hover:bg-ink-50"
                      title="산출물 + 검증 + Figma 프롬프트만 zip으로 (공유용)"
                    >
                      <Package className="h-3 w-3" /> 결과만
                    </button>
                    <button
                      onClick={handleDownloadBundle}
                      className="h-7 px-2.5 inline-flex items-center gap-1 rounded-md bg-accent-indigo text-white text-xs hover:bg-indigo-600 shadow-sm"
                      title="결과 + 스킬셋(SKILL.md + 코드) Bundle. Claude Code에 그대로 풀어 재실행 가능"
                    >
                      <Package className="h-3 w-3" /> Bundle (결과 + 스킬셋)
                    </button>
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white text-xs text-ink-700 hover:bg-ink-50"
                      title={expanded ? "접기" : "전체보기"}
                    >
                      {expanded ? (
                        <>
                          <Minimize2 className="h-3 w-3" /> 접기
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-3 w-3" /> 전체보기
                        </>
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardBody className="pt-2">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {workUnit.output.map((o) => (
                      <Badge
                        key={o}
                        tone="bg-white text-ink-700 border-ink-200 font-mono"
                      >
                        {o}
                      </Badge>
                    ))}
                  </div>
                  <div
                    className={cn(
                      "rounded-xl border border-ink-200 bg-white p-6 overflow-auto",
                      expanded ? "max-h-[80vh]" : "max-h-[28rem]",
                    )}
                  >
                    <MarkdownView source={finalOutput} />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Validation Result
                  </CardTitle>
                </CardHeader>
                <CardBody className="pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge status={validation.status} />
                    <span className="text-sm text-ink-700">
                      {validation.status === "passed"
                        ? `${validation.validatedBy} — 모든 검증 통과`
                        : validation.status === "passed-with-review"
                          ? `${validation.validatedBy} — 자동 검증 통과 · 휴먼 리뷰 대기`
                          : validation.status === "needs-review"
                            ? `${validation.validatedBy} — 의미 검증 경고 · 점검 필요`
                            : validation.status === "failed"
                              ? `${validation.validatedBy} — 검증 실패`
                              : `${validation.validatedBy}`}
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-ink-500 space-y-1">
                    {validation.items.map((item) => (
                      <li
                        key={item.message}
                        className="flex items-center gap-2"
                      >
                        {item.ok ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                        )}
                        {item.message}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <FigmaExportPanel foundation={designFoundation} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
 * No Match — 라우팅 실패 시 (등록된 어떤 Work Unit과도 무관)
 * ─────────────────────────────────────────────────────────────── */
function NoMatchHint({ prompt: _prompt }: { prompt: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center mb-3 text-2xl">
        🤷
      </div>
      <h3 className="text-base font-semibold text-rose-900">
        매칭되는 Work Unit이 없어요
      </h3>
      <p className="mt-2 text-sm text-rose-700/80 leading-relaxed max-w-md mx-auto">
        등록된 Work Unit(Kickoff Report / UX·UI Planning / CI/CD Setup) 중 적합한 것을 찾지 못했어요.
        프롬프트에 관련 키워드를 추가하거나, 새 Work Unit을 등록해보세요.
      </p>
      <div className="mt-3 inline-flex flex-wrap gap-1.5 justify-center">
        <span className="px-2 py-1 rounded bg-white border border-rose-200 text-[11px] text-rose-700">
          시도해보세요: "착수보고서" / "UX 기획" / "CI/CD"
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
 * 빈 상태 — Run 누르기 전에 우측에 표시 (intent도 없을 때만)
 * ─────────────────────────────────────────────────────────────── */
function IdleEmptyState({ hasMatch }: { hasMatch: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-white/40 backdrop-blur-sm p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-accent-indigo/15 to-accent-cyan/15 flex items-center justify-center mb-3">
        <Sparkles className="h-5 w-5 text-accent-indigo" />
      </div>
      <h3 className="text-base font-semibold text-ink-900">
        프로세스가 여기서 시각화됩니다
      </h3>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed max-w-md mx-auto">
        {hasMatch
          ? "Hook이 매칭됐어요. 좌측의 [실행] 버튼을 누르면 스킬이 차례로 실행되며 진행 상황이 표시됩니다."
          : "위 프리셋을 선택하거나 프롬프트를 입력해 시작하세요. Hook이 매칭되면 [실행] 버튼이 활성화됩니다."}
      </p>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
 * Human Gate Panel — 한 스킬 완료 직후 Approve / Reject 결정 대기
 * ─────────────────────────────────────────────────────────────── */
function HumanGatePanel({
  skillId,
  skillName,
  completed,
  total,
  onApprove,
  onReject,
}: {
  skillId: string;
  skillName: string;
  completed: number;
  total: number;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-amber-900">
              Human Gate · 검토 요청
            </span>
            <Badge tone="bg-white text-amber-700 border-amber-300">
              {completed}/{total} 단계 완료
            </Badge>
          </div>
          <p className="mt-1 text-xs text-amber-800/90">
            <span className="font-mono">{skillId}</span> (
            <span className="font-medium">{skillName}</span>) 산출물이
            완료됐어요. 다음 단계로 진행할지 결정해주세요.
          </p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={onApprove}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 shadow-sm"
            >
              <ThumbsUp className="h-3.5 w-3.5" /> Approve · 다음 단계
            </button>
            <button
              onClick={onReject}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-rose-300 bg-white text-rose-700 text-xs font-medium hover:bg-rose-50"
            >
              <ThumbsDown className="h-3.5 w-3.5" /> Reject · 중단
            </button>
            <span className="text-[11px] text-amber-700/80 ml-1">
              Reject 시 Governance 큐로 이동합니다
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
 * Halted Notice — 사용자가 Reject해서 실행이 중단됨
 * ─────────────────────────────────────────────────────────────── */
function HaltedNotice({
  skillName,
  completed,
  total,
}: {
  skillName: string;
  completed: number;
  total: number;
}) {
  return (
    <div className="rounded-xl border-2 border-rose-300 bg-rose-50/80 backdrop-blur-md p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-rose-900">
            실행이 중단됐어요 — Reject ({completed}/{total})
          </div>
          <p className="mt-1 text-xs text-rose-800/90">
            <span className="font-medium">{skillName}</span> 단계의 산출물이
            반려되어 워크유닛이 중단됐어요. 해당 런이{" "}
            <span className="font-medium">Governance &gt; Review Queue</span>에
            등록되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
 * Track Legend — 4개 트랙 (common-start / ui-track / ux-track / common-end)
 * 현재 단계가 어느 트랙에 있는지 색칠해 표시
 * ─────────────────────────────────────────────────────────────── */
const TRACK_META: Array<{
  key: "common-start" | "ui-track" | "ux-track" | "common-end";
  label: string;
  tone: string;
  activeTone: string;
}> = [
  {
    key: "common-start",
    label: "Common Start",
    tone: "bg-slate-50 text-slate-700 border-slate-200",
    activeTone: "bg-slate-200 text-slate-900 border-slate-400",
  },
  {
    key: "ui-track",
    label: "UI Track",
    tone: "bg-sky-50 text-sky-700 border-sky-200",
    activeTone: "bg-sky-200 text-sky-900 border-sky-400",
  },
  {
    key: "ux-track",
    label: "UX Track",
    tone: "bg-violet-50 text-violet-700 border-violet-200",
    activeTone: "bg-violet-200 text-violet-900 border-violet-400",
  },
  {
    key: "common-end",
    label: "Common End",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeTone: "bg-emerald-200 text-emerald-900 border-emerald-400",
  },
];

function TrackLegend({
  workUnit,
  skillStates,
}: {
  workUnit: WorkUnit;
  skillStates: Record<string, SkillRunState>;
}) {
  if (!workUnit.tracks) return null;
  const tracks = workUnit.tracks;

  // 각 트랙별 완료 카운트
  const stats = TRACK_META.map((t) => {
    const ids = tracks[t.key] ?? [];
    const done = ids.filter((id) => skillStates[id] === "done").length;
    const running = ids.some((id) => skillStates[id] === "running");
    return { ...t, ids, done, total: ids.length, running };
  });

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center gap-1 text-[11px] text-ink-500 mr-1">
        <Layers className="h-3 w-3" />
        트랙
      </div>
      {stats.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border font-medium",
              s.running ? s.activeTone : s.tone,
              s.running && "ring-2 ring-offset-1 ring-current/30",
            )}
          >
            {s.label}
            <span className="font-mono opacity-70">
              {s.done}/{s.total}
            </span>
          </span>
          {i < stats.length - 1 && (
            <ArrowRight className="h-3 w-3 text-ink-300" />
          )}
        </div>
      ))}
    </div>
  );
}
