import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const STATE_FILE = path.join(process.cwd(), ".training-state.json");

export async function GET() {
  try {
    if (existsSync(STATE_FILE)) {
      const raw = await readFile(STATE_FILE, "utf-8");
      return NextResponse.json(JSON.parse(raw));
    }
  } catch {
    // file corrupt or missing
  }

  return NextResponse.json({
    status: "idle",
    metrics: {},
    lossHistory: [],
    config: {},
  });
}
