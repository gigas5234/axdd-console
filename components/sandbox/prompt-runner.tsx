"use client";

/**
 * Phase 7: Sandbox → "Export Builder"로 단순화.
 *
 * 이전 (Phase 1~6): 9개 preset · simulateExecution · 4-Case · Human Gate · 트랙 시각화
 * 지금 (Phase 7):   Export Profile selector + 워크유닛 선택 + Download
 *
 * 콘솔의 정체성:
 *   "AxDD-SKILLS 호환 스킬셋 zip을 뽑는 도구"
 *
 * 실행 시뮬레이션은 더 이상 제공하지 않음 — 다운받은 zip을
 * 사용자가 Claude Code 또는 Cursor에서 직접 돌린다.
 */

import { useMemo, useState } from "react";
import {
  Download,
  Package,
  Layers,
  CheckCircle2,
  Info,
  ChevronDown,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workUnits, skills } from "@/lib/data";
import type { Skill, WorkUnit } from "@/lib/types";
import { cn } from "@/lib/utils";

type ExportProfile = "standard-kit" | "enterprise" | "harness-pack";

const EXPORT_PROFILES: {
  id: ExportProfile;
  label: string;
  desc: string;
  disabled?: boolean;
}[] = [
  {
    id: "enterprise",
    label: "Enterprise Skill Repository",
    desc: "전사 내부에서 동일한 스킬을 뽑아 쓰는 표준 레포 (AxDD-SKILLS 호환)",
  },
  {
    id: "standard-kit",
    label: "Standard Kit ZIP (legacy)",
    desc: "Anthropic Skills 표준 단일 스킬 Bundle — Claude Code 호환",
  },
  {
    id: "harness-pack",
    label: "Harness Pack (coming soon)",
    desc: "axe-harness/ 전체 미러 (Role Pack + Solution Pack + Work Unit + Handoffs)",
    disabled: true,
  },
];

export function PromptRunner() {
  const [profile, setProfile] = useState<ExportProfile>("enterprise");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedWorkUnitId, setSelectedWorkUnitId] = useState<string>(
    "ux-ui-planning-workunit",
  );
  const [downloading, setDownloading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    profile: ExportProfile;
    filename: string;
    bytes: number;
    timestamp: string;
  } | null>(null);

  const skillsById = useMemo<Record<string, Skill>>(
    () => Object.fromEntries(skills.map((s) => [s.id, s])),
    [],
  );

  const workUnit: WorkUnit | undefined = workUnits.find(
    (w) => w.id === selectedWorkUnitId,
  );
  const includedSkills = workUnit
    ? workUnit.skills.map((id) => skillsById[id]).filter(Boolean)
    : [];

  async function handleDownload() {
    if (!workUnit) return;
    setDownloading(true);
    try {
      const endpoint =
        profile === "enterprise"
          ? `/api/export/enterprise`
          : `/api/work-units/${workUnit.id}/bundle`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workUnitId: workUnit.id,
          profile,
        }),
      });

      if (!res.ok) {
        alert(`Export 실패 (${res.status})`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename =
        profile === "enterprise"
          ? `axdd-skills-enterprise-${Date.now()}.zip`
          : `${workUnit.id}-bundle-${Date.now()}.zip`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setLastResult({
        profile,
        filename,
        bytes: blob.size,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      alert(`Export 오류: ${String(err)}`);
    } finally {
      setDownloading(false);
    }
  }

  const selectedProfile = EXPORT_PROFILES.find((p) => p.id === profile)!;

  return (
    <div className="space-y-4">
      {/* ─────────── Header: 안내 + Export Profile ─────────── */}
      <Card className="border-2 border-accent-indigo/30 bg-gradient-to-br from-indigo-50/50 to-cyan-50/30">
        <CardBody className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-accent-indigo/15 text-accent-indigo flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-ink-900">
                AXDD Skill Export Builder
              </h2>
              <p className="mt-1 text-xs text-ink-600 leading-relaxed">
                전사 내부 프로젝트에서 동일하게 사용할 수 있는{" "}
                <strong>AxDD-SKILLS 호환 스킬 레포</strong>를 zip으로 다운받습니다.
                Mock 실행은 제공하지 않으며, 다운받은 zip을 Claude Code 또는
                Cursor에서 직접 실행하세요.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[400px,minmax(0,1fr)] gap-4">
        {/* ─────────── Left: Profile + Workunit 선택 ─────────── */}
        <div className="space-y-4 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>1. Export Profile</CardTitle>
              <p className="text-xs text-ink-500 mt-1">
                어떤 형식의 zip을 받을지 선택
              </p>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-full text-left flex items-center justify-between gap-2 h-11 px-3 rounded-lg border border-ink-200 bg-white hover:bg-ink-50"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-900 truncate">
                      {selectedProfile.label}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-ink-400 shrink-0 transition",
                      profileOpen && "rotate-180",
                    )}
                  />
                </button>
                {profileOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-ink-200 bg-white shadow-lg overflow-hidden">
                    {EXPORT_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        disabled={p.disabled}
                        onClick={() => {
                          if (p.disabled) return;
                          setProfile(p.id);
                          setProfileOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 hover:bg-ink-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-ink-100 last:border-b-0",
                          p.id === profile && "bg-indigo-50",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-ink-900">
                            {p.label}
                          </div>
                          {p.id === profile && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 ml-auto" />
                          )}
                        </div>
                        <div className="text-[11px] text-ink-500 mt-0.5">
                          {p.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-2 text-[11px] text-ink-500 flex items-start gap-1.5">
                <Info className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{selectedProfile.desc}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Work Unit 선택</CardTitle>
              <p className="text-xs text-ink-500 mt-1">
                어떤 워크유닛의 atomic skill을 포함할지
              </p>
            </CardHeader>
            <CardBody className="pt-2 space-y-2">
              {workUnits.map((w) => {
                const active = w.id === selectedWorkUnitId;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWorkUnitId(w.id)}
                    className={cn(
                      "w-full text-left rounded-lg border px-3 py-2.5 transition",
                      active
                        ? "border-accent-indigo bg-indigo-50/50 ring-2 ring-accent-indigo/20"
                        : "border-ink-200 bg-white hover:bg-ink-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-ink-900 truncate">
                        {w.name}
                      </div>
                      {active && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-indigo ml-auto shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5 truncate">
                      {w.skills.length} skills · {w.output.length} outputs
                    </div>
                  </button>
                );
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Download</CardTitle>
            </CardHeader>
            <CardBody className="pt-2">
              <Button
                onClick={handleDownload}
                disabled={!workUnit || downloading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <Download className="h-4 w-4" />
                {downloading
                  ? "생성 중…"
                  : profile === "enterprise"
                    ? "Enterprise zip 다운로드"
                    : "Standard Kit zip 다운로드"}
              </Button>
              {lastResult && (
                <div className="mt-3 text-[11px] text-ink-600 rounded-lg bg-emerald-50/60 border border-emerald-200 px-3 py-2">
                  <div className="font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    마지막 다운로드
                  </div>
                  <div className="font-mono mt-0.5 truncate">
                    {lastResult.filename}
                  </div>
                  <div className="text-ink-500 mt-0.5">
                    {(lastResult.bytes / 1024).toFixed(1)} KB
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ─────────── Right: Preview ─────────── */}
        <div className="space-y-4 min-w-0">
          {workUnit && (
            <Card>
              <CardHeader className="flex items-start justify-between flex-row">
                <div>
                  <CardTitle>{workUnit.name}</CardTitle>
                  <p className="text-xs text-ink-500 mt-1">
                    포함될 atomic skill · zip 안에 각각 SKILL.md 파일이 들어갑니다
                  </p>
                </div>
                <Badge status={workUnit.status} />
              </CardHeader>
              <CardBody className="pt-2">
                <div className="space-y-2">
                  {includedSkills.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white px-3 py-2"
                    >
                      <div className="h-6 w-6 shrink-0 rounded bg-ink-100 text-ink-600 text-[11px] font-mono flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-ink-900 truncate">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-ink-500 font-mono truncate">
                          skills/{s.id}/SKILL.md
                        </div>
                      </div>
                      <Badge
                        tone={"bg-slate-100 text-slate-700 border-slate-200"}
                      >
                        {s.category}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100">
                  <div className="text-xs text-ink-500 flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    {profile === "enterprise"
                      ? `Enterprise zip 구조: skills/<name>/SKILL.md × ${includedSkills.length} + CATALOG.md + work-units/ + governance-lite/ + validation/axe_check.py`
                      : `Standard Kit zip 구조: ${workUnit.id}/SKILL.md + CATALOG.md + references/ + assets/ + scripts/ + tests/ + examples/`}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Export 결과 사용법</CardTitle>
            </CardHeader>
            <CardBody className="pt-2 text-xs text-ink-600 leading-relaxed space-y-2">
              <p>
                <strong>1.</strong> 다운받은 zip 압축 해제
              </p>
              {profile === "enterprise" ? (
                <>
                  <p>
                    <strong>2.</strong> 사내 GitHub에 push 또는 공유 폴더에 업로드
                  </p>
                  <p>
                    <strong>3.</strong> 팀원이 같은 zip을 받아{" "}
                    <code className="px-1 py-0.5 rounded bg-ink-100 font-mono">
                      .cursor/skills/
                    </code>{" "}
                    또는{" "}
                    <code className="px-1 py-0.5 rounded bg-ink-100 font-mono">
                      ~/.claude/skills/
                    </code>{" "}
                    에 symlink
                  </p>
                  <p>
                    <strong>4.</strong>{" "}
                    <code className="px-1 py-0.5 rounded bg-ink-100 font-mono">
                      python3 validation/axe_check.py validate-skill skills/&lt;name&gt;
                    </code>{" "}
                    로 검증 가능
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>2.</strong>{" "}
                    <code className="px-1 py-0.5 rounded bg-ink-100 font-mono">
                      cp -r {workUnit?.id ?? "<workunit>"}/ ~/.claude/skills/
                    </code>
                  </p>
                  <p>
                    <strong>3.</strong> Claude Code가 SKILL.md frontmatter로 자동
                    인식
                  </p>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
