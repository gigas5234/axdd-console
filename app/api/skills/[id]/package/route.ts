/**
 * GET /api/skills/[id]/package
 *
 * 스킬을 Claude Code 호환 zip 패키지로 묶어 반환.
 *
 * 패키지 구조:
 *   <skill-id>/
 *   ├── INSTALL.md         ← Claude Code 사용 가이드 (자동 생성)
 *   ├── SKILL.md           ← frontmatter 포함된 표준 형식
 *   ├── references/        ← (있으면)
 *   ├── scripts/           ← (있으면)
 *   ├── assets/            ← (있으면)
 *   └── tests/             ← (있으면)
 */

import { promises as fs } from "fs";
import path from "path";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { skills } from "@/lib/data";
import { buildSkillMd, buildInstallMd } from "@/lib/skill-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function tryReadFile(absPath: string): Promise<string | null> {
  try {
    return await fs.readFile(absPath, "utf-8");
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const skill = skills.find((s) => s.id === params.id);
  if (!skill) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const zip = new JSZip();
  const root = zip.folder(skill.id);
  if (!root) {
    return NextResponse.json({ error: "zip_error" }, { status: 500 });
  }

  // INSTALL.md (사용 가이드)
  root.file("INSTALL.md", buildInstallMd(skill));

  // SKILL.md (frontmatter 추가)
  const cwd = process.cwd();
  const skillBody = await tryReadFile(path.join(cwd, skill.files.skill));
  root.file(
    "SKILL.md",
    buildSkillMd(
      skill,
      skillBody ?? `# ${skill.name}\n\n(본문 미작성)`,
    ),
  );

  // references / scripts / assets / tests
  const subfolders: Array<["references" | "scripts" | "assets" | "tests", string[]]> = [
    ["references", skill.files.references],
    ["scripts", skill.files.scripts],
    ["assets", skill.files.assets],
    ["tests", skill.files.tests],
  ];

  for (const [folderName, files] of subfolders) {
    if (files.length === 0) continue;
    const folder = root.folder(folderName);
    if (!folder) continue;

    for (const filePath of files) {
      const abs = path.join(cwd, filePath);
      const content = await tryReadFile(abs);
      if (content === null) {
        // 파일이 아직 없으면 placeholder
        folder.file(
          path.basename(filePath),
          `// 파일이 아직 작성되지 않았습니다.\n// 원본 경로: ${filePath}\n`,
        );
      } else {
        folder.file(path.basename(filePath), content);
      }
    }
  }

  const blob = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  // BodyInit 타입 호환 — Uint8Array를 그대로 받지 못하는 lib dom 버전 대응
  const body = new Blob([blob as unknown as BlobPart], {
    type: "application/zip",
  });

  return new Response(body, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${skill.id}.zip"`,
      "cache-control": "no-store",
    },
  });
}
