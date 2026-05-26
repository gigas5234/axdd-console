import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock,
  GitBranch,
  Layers,
  Library,
  Lock,
  Package,
  PlayCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Webhook,
  Workflow,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowOverview } from "@/components/overview/workflow-overview";
import { skills, workUnits, runs, hooks } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatRelative } from "@/lib/utils";
// MOCK: Integration Status + Activity Feed — 정적 mock
import {
  MOCK_INTEGRATIONS,
  INTEGRATION_TONE,
  MOCK_ACTIVITY_FEED,
  ACTIVITY_KIND_META,
} from "@/mocks";

function ArchCard({
  icon: Icon,
  label,
  status,
  detail,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white/70 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <div
          className={`h-6 w-6 rounded-md border flex items-center justify-center ${tone}`}
        >
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-[11px] font-semibold text-ink-900 truncate">
          {label}
        </span>
      </div>
      <div className="mt-1.5 text-xs font-medium text-ink-900">{status}</div>
      <div className="text-[10px] text-ink-500 mt-0.5 line-clamp-2">
        {detail}
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
  tone?: string;
  trend?: { delta: string; positive: boolean };
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <div className="label-eyebrow">{label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-ink-900">
                {value}
              </span>
              {trend && (
                <span
                  className={`text-[11px] font-medium ${
                    trend.positive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  <TrendingUp className="inline h-3 w-3" /> {trend.delta}
                </span>
              )}
            </div>
            {sub && <div className="text-xs text-ink-500 mt-0.5">{sub}</div>}
          </div>
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
              tone ?? "bg-ink-100 text-ink-700"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

const QUICK_ACTIONS = [
  {
    icon: PlayCircle,
    label: "샌드박스에서 실행",
    sub: "프리셋 또는 직접 입력",
    href: "/sandbox",
    tone: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    icon: Library,
    label: "스킬 라이브러리",
    sub: "8개 카테고리 탐색",
    href: "/skills",
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    icon: Workflow,
    label: "Work Unit 빌더",
    sub: "스킬 체인 시각화",
    href: "/work-units",
    tone: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    icon: ShieldCheck,
    label: "Governance 큐",
    sub: "리뷰·릴리즈 관리",
    href: "/governance",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export default function OverviewPage() {
  const verified = skills.filter((s) => s.status === "verified").length;
  const unverified = skills.length - verified;
  const pendingReviews = runs.filter(
    (r) => r.status === "needs-review" || r.status === "pending",
  ).length;
  const releaseCandidates = workUnits.filter(
    (w) => w.status === "approved" || w.status === "release-candidate",
  ).length;

  const recent = [...runs]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  const skillByCategory = (() => {
    const m: Record<string, number> = {};
    for (const s of skills) m[s.category] = (m[s.category] ?? 0) + 1;
    return m;
  })();
  const maxCount = Math.max(...Object.values(skillByCategory), 1);

  return (
    <>
      <AppHeader
        title="Overview"
        subtitle="AXDD SkillOps Console · 현황 한눈에 보기"
      />
      <main className="px-6 py-6 space-y-6">
        <section className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="h-page flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-indigo" />
              오늘의 SkillOps 현황
            </h1>
            <p className="h-sub">
              요청 → Hook → Work Unit → Skill → Output → 검증 → 승인 → 배포 흐름을 모니터링합니다.
            </p>
          </div>
          <Link
            href="/sandbox"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 shadow-sm"
          >
            <PlayCircle className="h-4 w-4" /> 샌드박스 열기
          </Link>
        </section>

        {/* KPI cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            icon={Layers}
            label="Total Skills"
            value={skills.length}
            sub={`Verified ${verified} · Unverified ${unverified}`}
            tone="bg-indigo-50 text-indigo-600"
            trend={{ delta: "+2 이번 주", positive: true }}
          />
          <Kpi
            icon={Workflow}
            label="Work Units"
            value={workUnits.length}
            sub={`Hooks ${hooks.length}개 연결`}
            tone="bg-sky-50 text-sky-600"
          />
          <Kpi
            icon={Clock}
            label="Pending Reviews"
            value={pendingReviews}
            sub="Sandbox + Governance 합산"
            tone="bg-amber-50 text-amber-700"
            trend={{ delta: "-1 어제 대비", positive: true }}
          />
          <Kpi
            icon={CheckCircle2}
            label="Release Candidates"
            value={releaseCandidates}
            sub="배포 후보 Work Unit"
            tone="bg-emerald-50 text-emerald-700"
          />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-xl border border-ink-200 bg-white/70 hover:bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-glass"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`h-9 w-9 rounded-lg border flex items-center justify-center ${a.tone}`}
                >
                  <a.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-ink-300 group-hover:text-ink-700 transition" />
              </div>
              <div className="mt-2.5 text-sm font-semibold text-ink-900">
                {a.label}
              </div>
              <div className="text-[11px] text-ink-500 mt-0.5">{a.sub}</div>
            </Link>
          ))}
        </section>

        {/* Architecture Status */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-accent-indigo" /> Architecture
              Status
            </h2>
            <span className="text-[11px] text-ink-500">
              현재 시스템 구성 — LLM 키 도입 시 자동 전환
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <ArchCard
              icon={Brain}
              label="Intent 추출"
              status="휴리스틱"
              detail="LLM 슬롯 준비"
              tone="bg-amber-50 text-amber-700 border-amber-200"
            />
            <ArchCard
              icon={Webhook}
              label="Hook 라우팅"
              status="키워드 + 폴백"
              detail="intent.domain 자동 매칭"
              tone="bg-emerald-50 text-emerald-700 border-emerald-200"
            />
            <ArchCard
              icon={Layers}
              label="Domain Profiles"
              status="5개 활성"
              detail="헬스케어 · 핀테크 · 이커머스 · 어드민 · SaaS"
              tone="bg-indigo-50 text-indigo-700 border-indigo-200"
            />
            <ArchCard
              icon={ShieldCheck}
              label="Validation"
              status="4-state + 의미 검증"
              detail="passed · passed-with-review · needs-review · failed"
              tone="bg-sky-50 text-sky-700 border-sky-200"
            />
            <ArchCard
              icon={Package}
              label="Bundle Export"
              status="활성"
              detail="Claude Code 호환 zip"
              tone="bg-violet-50 text-violet-700 border-violet-200"
            />
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-ink-500">
            <Lock className="h-3 w-3" /> 도메인 보존 규칙 (
            <code className="font-mono">DOMAIN_PRESERVATION_RULE</code>)이 모든
            스킬 prompt에 자동 prepend됩니다.
          </div>
        </section>

        {/* Workflow Overview */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-ink-900">
              실행 흐름 / Workflow
            </h2>
            <Badge tone="bg-white text-ink-600 border-ink-200">
              <Activity className="h-3 w-3" /> Mock Mode
            </Badge>
          </div>
          <WorkflowOverview />
        </section>

        {/* 3-column: Recent Runs / Activity Feed / Integrations */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle>Recent Runs</CardTitle>
              <Badge tone="bg-ink-100 text-ink-600 border-ink-200">
                {runs.length} runs
              </Badge>
            </CardHeader>
            <CardBody className="pt-2">
              <ul className="divide-y divide-ink-100">
                {recent.map((r) => (
                  <li
                    key={r.id}
                    className="py-3 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink-900 truncate">
                        “{r.prompt}”
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="font-mono">{r.id}</span>
                        <span>·</span>
                        <span>{r.selectedSkills.length} skills</span>
                        <span>·</span>
                        <span>{formatRelative(r.createdAt)}</span>
                      </div>
                    </div>
                    <Badge status={r.status} />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle>Activity Feed</CardTitle>
              <Badge tone="bg-ink-100 text-ink-600 border-ink-200">
                최근 24h
              </Badge>
            </CardHeader>
            <CardBody className="pt-2">
              <ol className="relative border-l border-ink-200 pl-4 space-y-3">
                {MOCK_ACTIVITY_FEED.slice(0, 5).map((a) => {
                  const meta = ACTIVITY_KIND_META[a.kind];
                  return (
                    <li key={a.id} className="relative">
                      <span
                        className={`absolute -left-[1.4rem] h-5 w-5 rounded-full border-2 border-white text-[10px] flex items-center justify-center ${meta.tone}`}
                      >
                        {meta.icon}
                      </span>
                      <div className="text-sm font-medium text-ink-900 leading-snug">
                        {a.title}
                      </div>
                      {a.detail && (
                        <div className="text-[11px] text-ink-500 mt-0.5">
                          {a.detail}
                        </div>
                      )}
                      <div className="text-[11px] text-ink-400 mt-1 flex items-center gap-1.5">
                        <span>{a.actor}</span>
                        <span>·</span>
                        <span>{formatRelative(a.timestamp)}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardBody className="pt-2 space-y-2">
              {MOCK_INTEGRATIONS.map((i) => (
                <div
                  key={i.name}
                  className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2 bg-white/60"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-900">
                      {i.name}
                    </div>
                    <div className="text-xs text-ink-500 truncate">
                      {i.note}
                    </div>
                  </div>
                  <Badge tone={INTEGRATION_TONE[i.status]}>{i.status}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>

        {/* Skill Category with mini bar chart */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-ink-900">
              Skill Category Summary
            </h2>
            <Link
              href="/skills"
              className="text-xs text-accent-blue hover:underline inline-flex items-center gap-0.5"
            >
              모두 보기 <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(CATEGORY_LABELS).map(([key, lbl]) => {
              const count = skillByCategory[key] ?? 0;
              const pct = (count / maxCount) * 100;
              return (
                <Link
                  key={key}
                  href={`/skills`}
                  className="block rounded-xl border border-ink-200 bg-white/70 hover:bg-white p-4 transition hover:shadow-glass"
                >
                  <div className="label-eyebrow">{lbl.en}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-ink-900">
                      {count}
                    </span>
                    <span className="text-xs text-ink-500">{lbl.ko}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
