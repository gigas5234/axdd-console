/**
 * GET /api/skills/[id]/skill-md
 *
 * 해당 스킬의 SKILL.md 본문을 반환한다.
 * - 응답 헤더는 text/markdown
 * - Claude Code / Claude Desktop의 SKILL 표준에 맞춰 frontmatter 자동 추가
 *
 * 사용처: Skill Detail Panel의 본문 미리보기, "Copy", "Download .md" 버튼.
 */

import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { skills } from "@/lib/data";
import { buildSkillMd } from "@/lib/skill-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const skill = skills.find((s) => s.id === params.id);
  if (!skill) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body = "";
  try {
    const filePath = path.join(process.cwd(), skill.files.skill);
    body = await fs.readFile(filePath, "utf-8");
  } catch {
    // 파일이 아직 없으면 빈 본문으로
    body = `(SKILL.md 파일이 아직 작성되지 않았습니다: ${skill.files.skill})`;
  }

  const withFrontmatter = buildSkillMd(skill, body);
  return new Response(withFrontmatter, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
