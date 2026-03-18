import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const HISTORY_DIR = path.join(process.cwd(), ".chat-history");

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const filePath = path.join(HISTORY_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json(data);
}
