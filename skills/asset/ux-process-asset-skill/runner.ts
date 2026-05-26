import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUxProcessAsset } from "./mock-output";

const runner: SkillRunner = {
  id: "ux-process-asset-skill",
  category: "asset",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      // intent.domain → 도메인별 페르소나/플로우
      buildMock: buildUxProcessAsset,
    });
  },
};

export default runner;
