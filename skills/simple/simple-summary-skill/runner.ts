import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { buildSimpleSummary } from "./mock-output";

const runner: SkillRunner = {
  id: "simple-summary-skill",
  category: "simple",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      // 사용자 프롬프트 기반 동적 5섹션 요약 (mock 모드에서도 자연스럽게)
      buildMock: buildSimpleSummary,
    });
  },
};

export default runner;
