/**
 * MOCK: Sandbox의 step-by-step 실행 흉내. setTimeout 기반의 가짜 실행기.
 *
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  ⚠️ LLM 교체 가이드 — 이 파일 통째로 제거 또는 무력화하세요       ║
 * ╠═══════════════════════════════════════════════════════════════════╣
 * ║                                                                   ║
 * ║  실제 LLM이 붙으면 simulateExecution()의 setTimeout 부분 모두      ║
 * ║  ("⚠️ LLM 교체 시 삭제" 라인)을 제거하고, /api/run의 streaming    ║
 * ║  응답을 받아 onUpdate를 호출하세요.                                ║
 * ║                                                                   ║
 * ║  교체 절차:                                                       ║
 * ║   1. simulateExecution() 본문을 fetch streaming 호출로 대체       ║
 * ║   2. SSE 또는 Response.body.getReader()로 단계 시그널 수신        ║
 * ║   3. 이 파일은 단순 mock으로 남기거나 deprecated 표시              ║
 * ║                                                                   ║
 * ║  지연 분포 (실제 LLM 호출 분포와 유사하게 의도):                   ║
 * ║   - Hook matched / Skills loaded: 짧음 (300~600ms)                ║
 * ║   - Work Unit selected: 중간 (400~800ms)                          ║
 * ║   - 각 Skill 실행: 김 (1200~2200ms) ← 토큰 생성 시간              ║
 * ║   - Validation completed: 중간 (800~1400ms)                       ║
 * ║   - Human review pending: 즉시 (200ms)                            ║
 * ║                                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

export type MockStepStatus = "pending" | "running" | "done";

export interface MockStep {
  label: string;
  ko: string;
  status: MockStepStatus;
}

/** 스킬 단위 실행 상태 — UI에서 카드/노드 시각화에 사용 */
export type SkillRunState = "pending" | "running" | "done";

export interface ExecutionState {
  steps: MockStep[];
  /** skillId → 실행 상태. 워크유닛 시각화에 직접 매핑됨. */
  skillStates: Record<string, SkillRunState>;
  /** 지금 실행 중인 스킬 ID — 강조 표시용 */
  currentSkillId?: string;
}

const STEP_TEMPLATES = [
  { label: "Hook matched", ko: "트리거 감지", delayRange: [300, 600] as [number, number] },
  { label: "Work Unit selected", ko: "실행 세트 선택", delayRange: [400, 800] as [number, number] },
  { label: "Skills loaded", ko: "스킬 로드", delayRange: [300, 600] as [number, number] },
  { label: "Output generated", ko: "산출물 생성", delayRange: [0, 0] as [number, number] }, // 스킬 N개로 분해됨
  { label: "Validation completed", ko: "검증 완료", delayRange: [800, 1400] as [number, number] },
  { label: "Human review pending", ko: "휴먼 리뷰 대기", delayRange: [200, 400] as [number, number] },
];

/** 각 스킬 실행 지연 (가짜 LLM 호출) */
const SKILL_DELAY_RANGE: [number, number] = [1200, 2200];

export const MOCK_STEP_TEMPLATE: Omit<MockStep, "status">[] = STEP_TEMPLATES.map(
  ({ label, ko }) => ({ label, ko }),
);

export function freshSteps(): MockStep[] {
  return STEP_TEMPLATES.map(({ label, ko }) => ({
    label,
    ko,
    status: "pending" as const,
  }));
}

export function freshSkillStates(
  skillIds: string[],
): Record<string, SkillRunState> {
  return Object.fromEntries(skillIds.map((id) => [id, "pending" as const]));
}

function randomInRange([min, max]: [number, number]): number {
  return Math.round(min + Math.random() * (max - min));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Human Gate 콜백 — 각 스킬 완료 직후 호출된다.
 *
 * 반환값:
 *   "approve" → 다음 스킬 진행
 *   "reject"  → workunit 중단 + Governance 큐로 이동 (HaltError throw)
 *
 * 콜백을 전달하지 않으면 게이트 없이 자동 진행 (기존 동작).
 */
export type HumanGateDecision = "approve" | "reject";
export type AwaitApprovalFn = (
  skillId: string,
  completedCount: number,
  totalCount: number,
) => Promise<HumanGateDecision>;

/** Reject 시 throw하는 식별 가능한 에러 — caller가 catch해 Governance에 라우팅 */
export class HumanGateRejectedError extends Error {
  constructor(
    public readonly skillId: string,
    public readonly completedCount: number,
  ) {
    super(`Human gate rejected at skill: ${skillId}`);
    this.name = "HumanGateRejectedError";
  }
}

/**
 * 통합 실행 시뮬레이터.
 *
 * Step 진행과 스킬 단위 진행을 함께 추적해서 UI가 어디까지 진행됐는지
 * 한 번에 알 수 있게 한다.
 *
 * **Human Gate 지원** — `opts.awaitApproval`이 주어지면 각 스킬 완료 직후
 * 콜백을 await한다. "reject" 반환 시 `HumanGateRejectedError`를 throw해
 * caller가 Governance 큐 등록을 처리하게 한다.
 *
 * ⚠️ LLM 교체 시: 본문 전체를 fetch streaming으로 교체.
 *   대략 매 단계마다 onUpdate({ steps, skillStates, currentSkillId })를
 *   호출하기만 하면 UI는 그대로.
 */
export async function simulateExecution(
  skillIds: string[],
  onUpdate: (state: ExecutionState) => void,
  opts?: { awaitApproval?: AwaitApprovalFn },
): Promise<void> {
  const steps = freshSteps();
  const skillStates = freshSkillStates(skillIds);

  const emit = (currentSkillId?: string) =>
    onUpdate({
      steps: [...steps],
      skillStates: { ...skillStates },
      currentSkillId,
    });

  emit();

  // ─── Step 0-2: 짧은 셋업 단계 ───
  for (let i = 0; i < 3; i++) {
    steps[i] = { ...steps[i], status: "running" };
    emit();
    // ⚠️ LLM 교체 시 삭제 — 실제 API 응답 대기로 대체
    await sleep(randomInRange(STEP_TEMPLATES[i].delayRange));
    steps[i] = { ...steps[i], status: "done" };
    emit();
  }

  // ─── Step 3: Output generated — 각 스킬을 차례로 실행 (+ Human Gate) ───
  steps[3] = { ...steps[3], status: "running" };
  emit();

  let completedCount = 0;
  for (const skillId of skillIds) {
    skillStates[skillId] = "running";
    emit(skillId);
    // ⚠️ LLM 교체 시 삭제 — 각 스킬의 실제 LLM 호출로 대체
    await sleep(randomInRange(SKILL_DELAY_RANGE));
    skillStates[skillId] = "done";
    completedCount += 1;
    emit();

    // Human Gate — 마지막 스킬 외 모든 완료 직후 사용자 승인 대기
    if (opts?.awaitApproval && completedCount < skillIds.length) {
      const decision = await opts.awaitApproval(
        skillId,
        completedCount,
        skillIds.length,
      );
      if (decision === "reject") {
        throw new HumanGateRejectedError(skillId, completedCount);
      }
    }
  }

  steps[3] = { ...steps[3], status: "done" };
  emit();

  // ─── Step 4-5: 검증 + 휴먼 리뷰 ───
  for (let i = 4; i < STEP_TEMPLATES.length; i++) {
    steps[i] = { ...steps[i], status: "running" };
    emit();
    // ⚠️ LLM 교체 시 삭제
    await sleep(randomInRange(STEP_TEMPLATES[i].delayRange));
    steps[i] = { ...steps[i], status: "done" };
    emit();
  }
}

/** 합산 예상 시간 — UI에 "약 N초 소요" 표시용 */
export function expectedTotalRangeMs(skillCount: number): [number, number] {
  const stepMin = STEP_TEMPLATES.reduce((s, t) => s + t.delayRange[0], 0);
  const stepMax = STEP_TEMPLATES.reduce((s, t) => s + t.delayRange[1], 0);
  const skillMin = skillCount * SKILL_DELAY_RANGE[0];
  const skillMax = skillCount * SKILL_DELAY_RANGE[1];
  return [stepMin + skillMin, stepMax + skillMax];
}

// ─── Legacy API (구 simulateRun 호환) ───
// ⚠️ 가능하면 simulateExecution을 사용하세요. 이 함수는 제거 예정.
export async function simulateRun(
  onStep: (steps: MockStep[]) => void,
): Promise<void> {
  const steps = freshSteps();
  onStep(steps);
  for (let i = 0; i < steps.length; i++) {
    steps[i] = { ...steps[i], status: "running" };
    onStep([...steps]);
    await sleep(randomInRange(STEP_TEMPLATES[i].delayRange));
    steps[i] = { ...steps[i], status: "done" };
    onStep([...steps]);
  }
}
