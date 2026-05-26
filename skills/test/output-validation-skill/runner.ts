import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";

const runner: SkillRunner = {
  id: "output-validation-skill",
  category: "test",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      markdown: [
        "# Validation Report",
        "",
        "## Summary",
        "- Status: passed",
        "- Issues: 1건",
        "",
        "## Issues",
        "- [info] 리뷰어 지정 필요 (휴먼 리뷰)",
      ].join("\n"),
    });
  },
};

export default runner;
