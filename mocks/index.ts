/**
 * MOCK: Central re-export.
 *
 * Phase 7 Cleanup: sandbox-presets / halted-runs / domain-fit 제거.
 * 진짜 데이터는 reference/axdd-skills/ 정적 자산 또는 data/*.json.
 *
 * @see PHASE_7_PLAN.md
 */

export const IS_MOCK = true;

export * from "./sample-outputs";
export * from "./execution";
export * from "./validation";
export * from "./integrations";
export * from "./risks";
export * from "./decisions";
export * from "./docs";
export * from "./activity-feed";
