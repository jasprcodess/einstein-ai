import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const STATE_FILE = path.join(process.cwd(), ".training-state.json");
const PID_FILE = path.join(process.cwd(), ".training-pid");
const ARCHIVE_DIR = path.join(process.cwd(), ".training-archive");
const CORPUS_DIR = path.resolve(process.cwd(), "..", "corpus");
const CHECKPOINT_DIR = path.join(CORPUS_DIR, "checkpoints");

export async function POST() {
  if (!fs.existsSync(STATE_FILE)) {
    return NextResponse.json({ error: "No training state to archive" }, { status: 404 });
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  if (state.status !== "done" && state.status !== "stopped") {
    return NextResponse.json({ error: "Can only archive completed or stopped runs" }, { status: 400 });
  }

  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runId = `run_${timestamp}`;
  const runDir = path.join(ARCHIVE_DIR, runId);
  fs.mkdirSync(runDir, { recursive: true });

  // Copy state file into archive
  fs.copyFileSync(STATE_FILE, path.join(runDir, "training-state.json"));

  // Copy final checkpoint if exists
  const finalCkpt = path.join(CHECKPOINT_DIR, "final.pt");
  if (fs.existsSync(finalCkpt)) {
    fs.copyFileSync(finalCkpt, path.join(runDir, "final.pt"));
  }

  // Copy tokenizer if exists
  const tokModel = path.join(CORPUS_DIR, "tokenizer.model");
  if (fs.existsSync(tokModel)) {
    fs.copyFileSync(tokModel, path.join(runDir, "tokenizer.model"));
  }

  // Write run metadata
  const meta = {
    id: runId,
    archivedAt: new Date().toISOString(),
    status: state.status,
    metrics: state.metrics || {},
    config: state.config || {},
    lossHistoryLength: state.lossHistory?.length || 0,
  };
  fs.writeFileSync(path.join(runDir, "meta.json"), JSON.stringify(meta, null, 2));

  // ── Now WIPE everything so it's truly gone from the live dashboard ──
  // Delete state file
  fs.unlinkSync(STATE_FILE);

  // Delete PID file if exists
  if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);

  // Delete checkpoints
  if (fs.existsSync(CHECKPOINT_DIR)) {
    fs.rmSync(CHECKPOINT_DIR, { recursive: true, force: true });
    fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });
  }

  // Delete tokenizer
  for (const f of ["tokenizer.model", "tokenizer.vocab"]) {
    const p = path.join(CORPUS_DIR, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  return NextResponse.json({ ok: true, runId });
}

export async function GET() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    return NextResponse.json({ runs: [] });
  }

  const dirs = fs.readdirSync(ARCHIVE_DIR).filter((d) =>
    fs.statSync(path.join(ARCHIVE_DIR, d)).isDirectory()
  );

  const runs = dirs.map((d) => {
    const metaPath = path.join(ARCHIVE_DIR, d, "meta.json");
    if (fs.existsSync(metaPath)) {
      return JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    }
    return { id: d, archivedAt: null, status: "unknown" };
  }).sort((a, b) => (b.archivedAt || "").localeCompare(a.archivedAt || ""));

  return NextResponse.json({ runs });
}

export async function DELETE(req: Request) {
  const { runId } = await req.json();
  if (!runId || typeof runId !== "string") {
    return NextResponse.json({ error: "runId required" }, { status: 400 });
  }

  const runDir = path.join(ARCHIVE_DIR, runId);
  if (!fs.existsSync(runDir)) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  fs.rmSync(runDir, { recursive: true, force: true });
  return NextResponse.json({ ok: true });
}
