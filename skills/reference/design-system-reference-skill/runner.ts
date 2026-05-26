import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildDesignSystemReference } from "./mock-output";

const runner: SkillRunner = {
  id: "design-system-reference-skill",
  category: "reference",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      // intent.domain → 도메인별 토큰·타이포·모션
      buildMock: buildDesignSystemReference,
    });
  },
};

export default runner;
