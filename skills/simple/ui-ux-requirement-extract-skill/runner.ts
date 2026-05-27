import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUiUxRequirementExtract } from "./mock-output";

const runner: SkillRunner = {
  id: "ui-ux-requirement-extract-skill",
  category: "simple",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      buildMock: buildUiUxRequirementExtract,
    });
  },
};

export default runner;
