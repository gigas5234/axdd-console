/**
 * DEBUG only — routeBest 동작 확인용. Production에서는 제거.
 */
import { NextResponse } from "next/server";
import { routeBest, route } from "@/lib/hook-router";
import { extractIntent } from "@/skills/_runtime/intent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt: string };
  const intent = extractIntent(prompt);
  const candidates = await route(prompt);
  const best = await routeBest(prompt);
  return NextResponse.json({ prompt, intent, candidates, best });
}
