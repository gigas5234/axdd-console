import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildUxUiHandoff } from "./mock-output";

const runner: SkillRunner = {
  id: "ux-ui-handoff-fullstep-skill",
  category: "fullstep",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      // intent.domain → 도메인별 10섹션 마스터 핸드오프
      buildMock: buildUxUiHandoff,
    });
  },
};

export default runner;
