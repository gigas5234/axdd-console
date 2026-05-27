import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildComponentSpec } from "./mock-output";

const runner: SkillRunner = {
  id: "component-spec-write-skill",
  category: "asset",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildComponentSpec });
  },
};

export default runner;
