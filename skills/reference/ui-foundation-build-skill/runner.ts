import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUiFoundation } from "./mock-output";

const runner: SkillRunner = {
  id: "ui-foundation-build-skill",
  category: "reference",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildUiFoundation });
  },
};

export default runner;
