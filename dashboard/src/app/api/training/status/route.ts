import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
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
    metrics: { step: 0, totalSteps: 0, loss: 0, lr: 0, tokensPerSec: 0, gpuMem: "", epoch: 0, eta: "" },
    lossHistory: [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await writeFile(STATE_FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
