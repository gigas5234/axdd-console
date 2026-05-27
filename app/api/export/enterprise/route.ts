/**
 * POST /api/export/enterprise
 *
 * Enterprise Skill Repository zip 생성 endpoint.
 *
 * Body (optional):
 *   {
 *     workUnitId?: string,
 *     workUnitIds?: string[],
 *     extraSkillIds?: string[]
 *   }
 *
 * 응답: zip 바이너리 (application/zip)
 */

import { NextResponse } from "next/server";
import { skills, workUnits } from "@/lib/data";
import { buildEnterpriseRepository } from "@/lib/enterprise-export";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    workUnitId?: string;
    workUnitIds?: string[];
    extraSkillIds?: string[];
  } = {};
  try {
    body = await req.json();
  } catch {
    // body 없어도 OK — 전체 export
  }

  const workUnitIds = body.workUnitIds
    ? body.workUnitIds
    : body.workUnitId
      ? [body.workUnitId]
      : undefined;

  try {
    const zipBytes = await buildEnterpriseRepository({
      skills,
      workUnits,
      options: {
        workUnitIds,
        extraSkillIds: body.extraSkillIds,
      },
    });

    return new NextResponse(zipBytes as unknown as BlobPart, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="axdd-skills-enterprise-${Date.now()}.zip"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Enterprise export 실패",
        detail: String(err),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  // GET도 허용 (기본 옵션)
  try {
    const zipBytes = await buildEnterpriseRepository({ skills, workUnits });
    return new NextResponse(zipBytes as unknown as BlobPart, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="axdd-skills-enterprise-${Date.now()}.zip"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
