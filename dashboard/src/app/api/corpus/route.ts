import { NextResponse } from "next/server";
import { getCorpusAll } from "@/lib/corpus-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getCorpusAll());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
