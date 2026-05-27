import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUiElementExtract } from "./mock-output";

const runner: SkillRunner = {
  id: "ui-element-extract-skill",
  category: "reference",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      buildMock: buildUiElementExtract,
    });
  },
};

export default runner;
