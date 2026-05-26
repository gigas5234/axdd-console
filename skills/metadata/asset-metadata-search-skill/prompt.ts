import type { SkillPromptTemplate } from "../../_runtime/types";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 1500,
  system: `자산 메타데이터(JSON 배열)와 쿼리를 받아, 관련도가 높은 자산 5개를 골라 점수와 함께 표로 반환하세요.

| Asset Name | Path | Score | Reason |
| --- | --- | --- | --- |
점수는 0~100 정수, 이유는 한 줄.`,
  buildUser: (input) => {
    const q = input.inputs?.["query.md"] ?? input.prompt;
    const assets =
      input.inputs?.["assets.json"] ?? "(assets.json이 주입되지 않음)";
    return `## 쿼리\n${q}\n\n## 자산 메타데이터\n\`\`\`json\n${assets}\n\`\`\``;
  },
};
