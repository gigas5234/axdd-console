import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildHandoffMerge } from "./mock-output";

const runner: SkillRunner = {
  id: "handoff-merge-skill",
  category: "fullstep",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildHandoffMerge });
  },
};

export default runner;
