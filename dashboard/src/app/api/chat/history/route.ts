import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const HISTORY_DIR = path.join(process.cwd(), ".chat-history");

function ensureDir() {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

// GET — list all chats (summary only)
export async function GET() {
  ensureDir();
  const files = fs.readdirSync(HISTORY_DIR).filter((f) => f.endsWith(".json"));
  const chats = files.map((f) => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, f), "utf-8"));
      return {
        id: data.id,
        title: data.title || "Untitled",
        createdAt: data.createdAt,
        messageCount: data.messages?.length || 0,
      };
    } catch {
      return null;
    }
  }).filter(Boolean).sort((a, b) => (b!.createdAt || "").localeCompare(a!.createdAt || ""));

  return NextResponse.json({ chats });
}

// POST — save/update a chat
export async function POST(req: NextRequest) {
  ensureDir();
  const body = await req.json();
  const { id, title, messages } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const filePath = path.join(HISTORY_DIR, `${id}.json`);
  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
    : { id, createdAt: new Date().toISOString() };

  existing.title = title || existing.title || "Untitled";
  existing.messages = messages || existing.messages || [];
  existing.updatedAt = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");
  return NextResponse.json({ ok: true, id });
}

// DELETE — delete a chat
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const filePath = path.join(HISTORY_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
