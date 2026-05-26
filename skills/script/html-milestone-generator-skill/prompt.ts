import type { SkillPromptTemplate } from "../../_runtime/types";

/**
 * Script Skill — LLM이 직접 산출물을 만드는 게 아니라 외부 script를 호출.
 * runner.ts에서 이 prompt를 거치지 않고 직접 변환 로직을 호출할 수도 있다.
 * 여기서는 LLM이 백업으로 HTML 생성 능력을 갖도록 정의해둔다.
 */
import type { SkillRunInput } from "../../_runtime/types";

export const prompt: SkillPromptTemplate = {
  model: "claude-sonnet-4-6",
  maxTokens: 3000,
  system: `당신은 프로젝트 마일스톤 시각화 전문가입니다.
주어진 WBS JSON을 받아 self-contained HTML 마일스톤을 만드세요.

요구사항:
- inline CSS만 사용 (외부 의존 없음)
- Phase별로 가로 박스 카드, 그 안에 마일스톤 bullet
- 의존성은 화살표(→)로 표현
- 인쇄 가능 폭(A4 landscape) 기준`,
  buildUser: (input: SkillRunInput) => {
    const wbs = input.inputs?.["wbs.json"] ?? input.prompt;
    return `## WBS\n\`\`\`json\n${wbs}\n\`\`\``;
  },
};
