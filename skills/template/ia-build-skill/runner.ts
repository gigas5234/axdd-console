import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildIa } from "./mock-output";

const runner: SkillRunner = {
  id: "ia-build-skill",
  category: "template",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildIa });
  },
};

export default runner;
