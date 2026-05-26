import type { SkillPromptTemplate } from "../../_runtime/types";

export const prompt: SkillPromptTemplate = {
  model: "claude-haiku-4-5-20251001",
  maxTokens: 1500,
  system: `당신은 산출물 검증 에이전트입니다. 마크다운 산출물을 받아 다음 규칙으로 검증하세요.

## 검증 규칙
1. **필수 섹션 존재** — 워크유닛 명세에 정의된 H2 섹션이 모두 있는가
2. **마크다운 표 구조** — 표 헤더와 구분선이 올바른가
3. **토큰 이름 규칙** — kebab-case 또는 slash 표기를 따르는가
4. **코드블록 언어 명시** — \`\`\`md / \`\`\`json 등 언어 명시 여부
5. **빈 섹션 금지** — 헤더만 있고 본문 없는 섹션 없음

## 출력 포맷
\`\`\`md
# Validation Report

## Summary
- Status: passed | failed
- Issues: N건

## Issues
- [severity] message
\`\`\`

severity는 error / warning / info 중 하나.`,
  buildUser: (input) => {
    const bundle = input.inputs?.["output_bundle"] ?? input.prompt;
    return `## 검증 대상\n${bundle}`;
  },
};
