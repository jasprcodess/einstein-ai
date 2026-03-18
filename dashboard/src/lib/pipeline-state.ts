import fs from "fs";
import path from "path";

const CORPUS_DIR = path.resolve(process.cwd(), "..", "corpus");
const STATE_FILE = path.join(process.cwd(), ".training-state.json");

export function getPipelineState() {
  const tokenizer = fs.existsSync(path.join(CORPUS_DIR, "tokenizer.model"));
  const checkpoint = fs.existsSync(path.join(CORPUS_DIR, "checkpoints", "final.pt"));

  let training = false;
  let trainingDetail: string | null = null;

  try {
    if (fs.existsSync(STATE_FILE)) {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
      if (state.status === "done") {
        training = true;
        const steps = state.metrics?.totalSteps ?? state.metrics?.step;
        const params = state.config?.parameters;
        trainingDetail = [params, steps ? `${steps} steps` : null].filter(Boolean).join(" · ");
      }
    }
  } catch {
    // ignore
  }

  return { tokenizer, checkpoint, training, trainingDetail };
}
