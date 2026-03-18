import { NextResponse } from "next/server";
import {
  getCorpusAuthors,
  getCorpusSources,
  getCorpusStats,
  getCorpusYearBuckets,
} from "@/lib/corpus-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      stats: getCorpusStats(),
      sources: getCorpusSources(),
      years: getCorpusYearBuckets(),
      authors: getCorpusAuthors(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
