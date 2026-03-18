import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const CORPUS_DIR = path.resolve(process.cwd(), "..", "corpus");
const INFER_SCRIPT = path.join(CORPUS_DIR, "infer.py");
const CHECKPOINT = path.join(CORPUS_DIR, "checkpoints", "final.pt");
const TOKENIZER = path.join(CORPUS_DIR, "tokenizer.model");

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildPrompt(messages: Message[], newPrompt: string): string {
  // Build context from conversation history (last few turns to stay within context window)
  const recent = messages.slice(-6); // last 3 exchanges max
  const parts: string[] = [];
  for (const msg of recent) {
    if (msg.role === "user") {
      parts.push(`Q: ${msg.content}`);
    } else {
      parts.push(`A: ${msg.content}`);
    }
  }
  parts.push(`Q: ${newPrompt}`);
  parts.push("A:");
  return parts.join("\n");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, messages = [], maxTokens = 256, temperature = 0.8 } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  if (prompt.length > 2048) {
    return NextResponse.json({ error: "Prompt too long" }, { status: 400 });
  }

  if (!fs.existsSync(CHECKPOINT) || !fs.existsSync(TOKENIZER)) {
    return NextResponse.json(
      { error: "Model not trained yet. Run training first." },
      { status: 503 }
    );
  }

  const fullPrompt = messages.length > 0
    ? buildPrompt(messages as Message[], prompt)
    : prompt;

  try {
    const result = await new Promise<string>((resolve, reject) => {
      execFile(
        "python",
        [
          INFER_SCRIPT,
          "--prompt", fullPrompt,
          "--max-tokens", String(Math.min(Number(maxTokens), 512)),
          "--temperature", String(Math.min(Math.max(Number(temperature), 0), 2)),
        ],
        { cwd: CORPUS_DIR, timeout: 60000 },
        (err, stdout, stderr) => {
          if (err) reject(new Error(stderr || err.message));
          else resolve(stdout.trim());
        }
      );
    });

    const parsed = JSON.parse(result);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Inference failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
