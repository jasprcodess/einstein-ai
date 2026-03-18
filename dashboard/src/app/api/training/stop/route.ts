import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const PID_FILE = path.join(process.cwd(), ".training-pid");
const STATE_FILE = path.join(process.cwd(), ".training-state.json");
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

function killProcess(pid: number) {
  try {
    if (IS_WIN) {
      // First try graceful kill (without /F) to let Python save checkpoint
      try {
        execSync(`taskkill /PID ${pid} /T`, { stdio: "ignore", timeout: 2000 });
      } catch { /* may fail, that's ok */ }

      // Wait up to 5 seconds for graceful exit
      for (let i = 0; i < 10; i++) {
        if (!isProcessAlive(pid)) return;
        execSync("timeout /t 1 /nobreak >nul 2>&1", { shell: "cmd.exe", timeout: 2000 });
      }

      // Force kill if still alive
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" });
    } else {
      process.kill(pid, "SIGTERM");
      // Wait briefly for graceful exit, then SIGKILL
      setTimeout(() => {
        try { process.kill(pid, "SIGKILL"); } catch { /* already dead */ }
      }, 5000);
    }
  } catch {
    // Already dead
  }
}

export async function POST() {
  if (!fs.existsSync(PID_FILE)) {
    return NextResponse.json({ error: "No training process found" }, { status: 404 });
  }

  const pid = parseInt(fs.readFileSync(PID_FILE, "utf-8").trim(), 10);
  killProcess(pid);

  // Clean up PID file
  if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);

  // Update state file if Python didn't get a chance to
  if (fs.existsSync(STATE_FILE)) {
    try {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
      if (state.status === "running") {
        state.status = "stopped";
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
      }
    } catch { /* ignore */ }
  }

  return NextResponse.json({ ok: true });
}
