import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildKickoffReport } from "./mock-output";

const runner: SkillRunner = {
  id: "kickoff-report-template-skill",
  category: "template",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      buildMock: buildKickoffReport,
    });
  },
};

export default runner;
