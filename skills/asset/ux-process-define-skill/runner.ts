import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUxProcessDefine } from "./mock-output";

const runner: SkillRunner = {
  id: "ux-process-define-skill",
  category: "asset",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildUxProcessDefine });
  },
};

export default runner;
