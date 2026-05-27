/**
 * Phase 7 Cleanup: Sandbox mock 실행이 콘솔의 핵심이 아님.
 *
 * 이전 simulateExecution / HumanGate / 트랙 시뮬레이션은 모두 제거됨.
 * 콘솔은 이제 "AxDD-SKILLS 호환 export를 뽑는 도구"이지 "워크플로 시뮬레이터"가 아님.
 *
 * 이 파일은 import 호환성을 위해 최소한의 타입만 남기고 본문은 빈 stub.
 * 실제 실행은 사용자가 다운받은 zip을 Claude Code / Cursor에서 직접 돌린다.
 */

export type MockStepStatus = "pending" | "running" | "done";

export interface MockStep {
  label: string;
  ko: string;
  status: MockStepStatus;
}

export type SkillRunState = "pending" | "running" | "done";

export interface ExecutionState {
  steps: MockStep[];
  skillStates: Record<string, SkillRunState>;
  currentSkillId?: string;
}

/** No-op — UI가 import만 하고 호출 안 함 */
export function freshSteps(): MockStep[] {
  return [];
}

export function freshSkillStates(): Record<string, SkillRunState> {
  return {};
}

export function expectedTotalRangeMs(_skillCount: number): [number, number] {
  return [0, 0];
}
