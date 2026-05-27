import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildSampleScreens } from "./mock-output";

const runner: SkillRunner = {
  id: "sample-screen-design-skill",
  category: "asset",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildSampleScreens });
  },
};

export default runner;
