import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";
import { HTML_MILESTONE_MOCK } from "./mock-output";

const runner: SkillRunner = {
  id: "html-milestone-generator-skill",
  category: "script",
  async run(input) {
    // TODO: 진짜 스크립트 실행 슬롯 (skills/_runtime의 script 실행기)
    return withLlmOrMock(prompt, input, {
      markdown: HTML_MILESTONE_MOCK,
    });
  },
};

export default runner;
