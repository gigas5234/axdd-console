/**
 * MOCK: Human Gate에서 Reject된 런을 Governance 큐로 푸시하는 in-browser 큐.
 *
 * localStorage 기반 — 새로고침해도 유지된다. 백엔드 도입 시 이 모듈을
 * 서버 API 호출로 교체.
 *
 * @see mocks/README.md
 * @see components/sandbox/prompt-runner.tsx (writer)
 * @see app/governance/page.tsx (reader)
 */

import type { Run } from "@/lib/types";

const STORAGE_KEY = "axdd_halted_runs_v1";

/** Run 인터페이스에 맞춰 저장. status는 항상 "needs-review". */
export interface HaltedRun extends Run {
  /** Reject가 발생한 스킬 ID */
  rejectedAtSkillId: string;
  /** 완료된 스킬 개수 / 전체 */
  rejectedAtStep: { completed: number; total: number };
}

/* ────────────────────────────────────────────────────────────
 * Reader
 * ──────────────────────────────────────────────────────────── */

export function getHaltedRuns(): HaltedRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HaltedRun[];
  } catch {
    return [];
  }
}

/* ────────────────────────────────────────────────────────────
 * Writer
 * ──────────────────────────────────────────────────────────── */

export function pushHaltedRun(run: HaltedRun): void {
  if (typeof window === "undefined") return;
  const existing = getHaltedRuns();
  // 같은 id가 있으면 덮어쓰기 (재실행 케이스)
  const merged = [run, ...existing.filter((r) => r.id !== run.id)].slice(0, 50);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // quota / private mode — 무시 (mock 한정)
  }
}

export function clearHaltedRun(id: string): void {
  if (typeof window === "undefined") return;
  const next = getHaltedRuns().filter((r) => r.id !== id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/* ────────────────────────────────────────────────────────────
 * Builder — sandbox에서 호출하기 쉽도록 헬퍼 제공
 * ──────────────────────────────────────────────────────────── */

export function buildHaltedRun(args: {
  workUnitId: string;
  prompt: string;
  matchedHook: string;
  completedSkills: string[];
  rejectedAtSkillId: string;
  totalSkills: number;
}): HaltedRun {
  return {
    id: `halt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    prompt: args.prompt,
    matchedHook: args.matchedHook,
    selectedWorkUnit: args.workUnitId,
    selectedSkills: args.completedSkills,
    status: "needs-review",
    outputs: [],
    validation: {
      status: "needs-review",
      issues: [
        `Human Gate에서 \`${args.rejectedAtSkillId}\` 결과를 반려함 (${args.completedSkills.length}/${args.totalSkills} 완료)`,
      ],
    },
    createdAt: new Date().toISOString(),
    rejectedAtSkillId: args.rejectedAtSkillId,
    rejectedAtStep: {
      completed: args.completedSkills.length,
      total: args.totalSkills,
    },
  };
}
