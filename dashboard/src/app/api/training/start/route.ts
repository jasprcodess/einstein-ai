import { NextResponse } from "next/server";
import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const PID_FILE = path.join(process.cwd(), ".training-pid");
const STATE_FILE = path.join(process.cwd(), ".training-state.json");
const TRAIN_SCRIPT = path.resolve(process.cwd(), "..", "corpus", "train.py");
const CORPUS_DIR = path.resolve(process.cwd(), "..", "corpus");
const IS_WIN = process.platform === "win32";

function isProcessAlive(pid: number): boolean {
  try {
    if (IS_WIN) {
      const out = execSync(`tasklist /FI "PID eq ${pid}" /NH`, { encoding: "utf-8" });
      return out.includes(String(pid));
    }
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const fresh = body.fresh === true; // if true, wipe old state + tokenizer + checkpoints

  // Check if already running
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf-8").trim(), 10);
    if (isProcessAlive(pid)) {
      return NextResponse.json({ error: "Training already running", pid }, { status: 409 });
    }
    fs.unlinkSync(PID_FILE);
  }

  if (!fs.existsSync(TRAIN_SCRIPT)) {
    return NextResponse.json({ error: "train.py not found" }, { status: 500 });
  }

  // Clear old state so dashboard doesn't show stale data
  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE);
  }

  // If fresh retrain, also wipe tokenizer and checkpoints
  if (fresh) {
    const tokModel = path.join(CORPUS_DIR, "tokenizer.model");
    const tokVocab = path.join(CORPUS_DIR, "tokenizer.vocab");
    const ckptDir = path.join(CORPUS_DIR, "checkpoints");
    for (const f of [tokModel, tokVocab]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    if (fs.existsSync(ckptDir)) {
      fs.rmSync(ckptDir, { recursive: true, force: true });
    }
  }

  // Write initial "starting" state so UI shows immediately
  fs.writeFileSync(STATE_FILE, JSON.stringify({
    status: "running",
    metrics: {},
    lossHistory: [],
    config: {},
  }, null, 2), "utf-8");

  // Spawn the training process
  const child = spawn("python", [TRAIN_SCRIPT], {
    detached: !IS_WIN,
    stdio: "ignore",
    cwd: CORPUS_DIR,
    ...(IS_WIN ? { shell: true } : {}),
  });

  child.unref();

  if (child.pid) {
    fs.writeFileSync(PID_FILE, String(child.pid), "utf-8");
    return NextResponse.json({ ok: true, pid: child.pid });
  }

  return NextResponse.json({ error: "Failed to start training" }, { status: 500 });
}
