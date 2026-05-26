/**
 * POST /api/work-units/[id]/bundle
 *
 * Work Unit 전체 (스킬셋 + _runtime + 실행 결과)를 zip으로 묶어 반환.
 * 클라이언트는 raw 데이터(prompt/mode/output/intent/validation)를 보내고,
 * 서버가 result/*.md 파일을 자동 생성한다.
 */

import { NextResponse } from "next/server";
import { workUnits, skills } from "@/lib/data";
import { buildWorkUnitBundle } from "@/lib/workunit-bundle";
import type { MockValidationReport } from "@/mocks/validation";
import type { RunIntent } from "@/skills/_runtime/intent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BundleRequest {
  prompt?: string;
  mode?: "llm" | "mock" | null;
  output?: string;
  intent?: RunIntent | null;
  validation?: MockValidationReport;
  figmaPrompt?: string;
}

async function buildAndReturn(workUnitId: string, body: BundleRequest) {
  const wu = workUnits.find((w) => w.id === workUnitId);
  if (!wu) {
    return NextResponse.json(
      { error: "work_unit_not_found", workUnitId },
      { status: 404 },
    );
  }

  const result =
    body.output !== undefined && body.validation
      ? {
          workUnit: wu,
          prompt: body.prompt ?? "",
          mode: body.mode ?? null,
          output: body.output,
          intent: body.intent ?? null,
          validation: body.validation,
          figmaPrompt: body.figmaPrompt,
        }
      : undefined;

  const blob = await buildWorkUnitBundle({
    workUnit: wu,
    skills,
    result,
  });

  const filename = `${wu.id}-bundle-${Date.now()}.zip`;
  const body2 = new Blob([blob as unknown as BlobPart], {
    type: "application/zip",
  });

  return new Response(body2, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  let body: BundleRequest;
  try {
    body = (await req.json()) as BundleRequest;
  } catch {
    body = {};
  }
  return buildAndReturn(params.id, body);
}

/** GET: 스킬셋만 다운로드 (결과 없이) */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  return buildAndReturn(params.id, {});
}
