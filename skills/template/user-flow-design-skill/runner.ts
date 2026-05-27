import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUserFlow } from "./mock-output";

const runner: SkillRunner = {
  id: "user-flow-design-skill",
  category: "template",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildUserFlow });
  },
};

export default runner;
