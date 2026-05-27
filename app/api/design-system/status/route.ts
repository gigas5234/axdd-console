/**
 * GET /api/design-system/status
 *
 * AXDD Design System 카탈로그(`data/our-design-system.md`)를 읽고
 * scaffold / partial / ready 상태와 카운트를 반환한다.
 *
 * 콘솔의 Asset Repository 탭에서 DS 상태 카드 렌더링에 사용.
 */

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { analyzeDsCatalog } from "@/lib/our-design-system";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filepath = path.join(process.cwd(), "data", "our-design-system.md");
    const text = await fs.readFile(filepath, "utf-8");
    const status = analyzeDsCatalog(text);
    return NextResponse.json(status);
  } catch (err) {
    return NextResponse.json(
      {
        state: "scaffold",
        todoCount: 999,
        filledColorTokens: 0,
        filledTypeTokens: 0,
        filledComponents: 0,
        lastUpdated: null,
        label: "AXDD DS 파일을 읽을 수 없습니다",
        enables: {
          case_a_bootstrap: true,
          case_b_axdd_internal: false,
          case_c_customer_project: true,
          case_d_requirement_only: true,
        },
        error: String(err),
      },
      { status: 200 }, // 200 — UI는 항상 카드를 그릴 수 있게
    );
  }
}
