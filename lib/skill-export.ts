/**
 * Skill export utilities — SKILL.md에 Claude Code 호환 frontmatter를 추가하고,
 * zip 패키지 구성을 만든다.
 *
 * Claude Code / Anthropic Skills의 SKILL.md 표준:
 *   ---
 *   name: kebab-case-id
 *   description: 한 줄 설명 (트리거링에 사용됨)
 *   ---
 *   # 사람용 본문...
 */

import type { Skill } from "./types";

/** 본문 앞에 표준 frontmatter를 붙인다. 이미 있으면 그대로 둔다. */
export function buildSkillMd(skill: Skill, body: string): string {
  if (body.trim().startsWith("---")) {
    // 이미 frontmatter가 있는 경우
    return body;
  }
  const frontmatter = [
    "---",
    `name: ${skill.id}`,
    `description: ${skill.description}`,
    `category: ${skill.category}`,
    `version: ${skill.version}`,
    `owner: ${skill.owner}`,
    "---",
    "",
  ].join("\n");
  return frontmatter + body;
}

/**
 * Claude Code Plugin 호환을 위한 기본 INSTALL.md 텍스트.
 * 사용자가 자기 환경에 가져갈 때 첫 번째로 보게 되는 안내.
 */
export function buildInstallMd(skill: Skill): string {
  return `# ${skill.name} — Claude Code 사용 가이드

이 스킬은 AXDD SkillOps Console에서 export됐습니다.

## 1. 자기 환경에 설치

### Claude Code (CLI)
\`\`\`
~/.claude/skills/${skill.id}/
├── SKILL.md
├── references/
├── scripts/
└── assets/
\`\`\`

위 경로에 압축을 푸세요. Claude Code가 자동으로 인식합니다.

### Claude Desktop / Claude Code 플러그인
SKILL.md를 그대로 복사해 \`~/.claude/skills/\`에 두거나 Anthropic Skills 형식으로 패키징해 사용하세요.

## 2. 호출 방법

이 스킬은 다음 조건에서 활성화됩니다:

- **Input**: ${skill.input.join(", ")}
- **Output**: ${skill.output.join(", ")}

## 3. 검증

스킬 산출물은 \`output-validation-skill\`로 자동 검증됩니다.
산출물의 필수 섹션이 누락되면 검증이 실패합니다.

---
원본: https://axdd-skillops-console (AXDD SkillOps Console)
Skill ID: \`${skill.id}\` · Version: \`${skill.version}\`
`;
}
