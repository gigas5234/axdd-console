/**
 * MOCK: Central re-export for all MVP fake data and fake behaviors.
 *
 * Goal: when the real backend lands, deleting this directory and resolving
 * the imports should be a mechanical task. Every consumer file marks its
 * mock usage with a `// MOCK:` comment so `grep -rn "MOCK:" app components lib`
 * surfaces every removal point.
 *
 * @see mocks/README.md
 */

/** Top-level flag — true while running on mock data/behaviors. */
export const IS_MOCK = true;

export * from "./sample-outputs";
export * from "./execution";
export * from "./validation";
export * from "./integrations";
export * from "./risks";
export * from "./decisions";
export * from "./docs";
export * from "./sandbox-presets";
export * from "./activity-feed";
export * from "./domain-fit";
export * from "./halted-runs";
