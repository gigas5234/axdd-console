import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildFigmaPrompt } from "./mock-output";

const runner: SkillRunner = {
  id: "figma-prompt-build-skill",
  category: "template",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildFigmaPrompt });
  },
};

export default runner;
