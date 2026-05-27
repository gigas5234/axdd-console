import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildDesignSystemIngest } from "./mock-output";

const runner: SkillRunner = {
  id: "design-system-ingest-skill",
  category: "reference",
  async run(input) {
    return withLlmOrMock(prompt, input, { buildMock: buildDesignSystemIngest });
  },
};

export default runner;
