import type { SkillRunner } from "../../_runtime/types";
import { withLlmOrMock } from "../../_runtime/helpers";
import { prompt } from "./prompt";

const runner: SkillRunner = {
  id: "asset-metadata-search-skill",
  category: "metadata",
  async run(input) {
    return withLlmOrMock(prompt, input, {
      markdown: [
        "| Asset Name | Path | Score | Reason |",
        "| --- | --- | --- | --- |",
        "| Design System Reference MD | references/design-system.md | 92 | 디자인 시스템 관련 핵심 자산 |",
        "| UX Checklist (asset pack) | assets/ux-checklist.md | 81 | UX 프로세스 체크리스트 |",
        "| Kickoff Report Template | assets/kickoff-template.md | 64 | 보고서 템플릿 매칭 |",
      ].join("\n"),
    });
  },
};

export default runner;
