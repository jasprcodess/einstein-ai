#!/usr/bin/env python3
"""train.py — Train a small transformer from scratch on the pre-1905 corpus."""

import json, math, os, time, sys, signal
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F
import sentencepiece as spm

from model import EinsteinModel

# ── Graceful shutdown ────────────────────────────────────────────
_stop_requested = False

def _handle_stop(signum, frame):
    global _stop_requested
    _stop_requested = True
    print("\nStop requested, finishing current step...")

signal.signal(signal.SIGINT, _handle_stop)
try:
    signal.signal(signal.SIGTERM, _handle_stop)
except OSError:
    pass  # SIGTERM not available on some Windows builds

ROOT = Path(__file__).parent
DATA_DIR = ROOT / "data"
STATE_FILE = ROOT.parent / "dashboard" / ".training-state.json"
CHECKPOINT_DIR = ROOT / "checkpoints"
TOKENIZER_MODEL = ROOT / "tokenizer.model"
TOKENIZER_PREFIX = str(ROOT / "tokenizer")

# ── Hyperparams ──────────────────────────────────────────────────
VOCAB_SIZE   = 8192
SEQ_LEN      = 512
D_MODEL      = 768
N_HEADS      = 12
N_LAYERS     = 8
D_FF         = 2048
DROPOUT      = 0.1
BATCH_SIZE   = 16
LR           = 3e-4
MIN_LR       = 3e-5
WARMUP_STEPS = 50
LOG_EVERY    = 10
SAVE_EVERY   = 500
MAX_EPOCHS   = 15
WEIGHT_DECAY = 0.1
SEED         = 42


def write_state(status, metrics=None, loss_history=None, config=None):
    """Write training state to JSON so dashboard can poll it."""
    state = {
        "status": status,
        "metrics": metrics or {},
        "lossHistory": loss_history or [],
        "config": config or {},
    }
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


# ── 1. Build tokenizer ──────────────────────────────────────────
def build_tokenizer():
    if TOKENIZER_MODEL.exists():
        print("Tokenizer already exists, loading...")
        sp = spm.SentencePieceProcessor()
        sp.Load(str(TOKENIZER_MODEL))
        return sp

    print("Building tokenizer from corpus...")
    combined = ROOT / "_combined.txt"
    with open(combined, "w", encoding="utf-8") as out:
        for txt in sorted(DATA_DIR.glob("*.txt")):
            out.write(txt.read_text(encoding="utf-8"))
            out.write("\n\n")

    spm.SentencePieceTrainer.Train(
        input=str(combined),
        model_prefix=TOKENIZER_PREFIX,
        vocab_size=VOCAB_SIZE,
        model_type="bpe",
        character_coverage=1.0,
        pad_id=0, unk_id=1, bos_id=2, eos_id=3,
    )
    combined.unlink()

    sp = spm.SentencePieceProcessor()
    sp.Load(str(TOKENIZER_MODEL))
    print(f"Tokenizer built: {sp.GetPieceSize()} tokens")
    return sp


# ── 2. Prepare dataset ──────────────────────────────────────────
def load_tokens(sp):
    all_ids = []
    for txt in sorted(DATA_DIR.glob("*.txt")):
        text = txt.read_text(encoding="utf-8")
        ids = sp.Encode(text)
        all_ids.extend(ids)
    return torch.tensor(all_ids, dtype=torch.long)


def make_batches(tokens, seq_len, batch_size):
    n = (len(tokens) - 1) // seq_len
    n = (n // batch_size) * batch_size
    x = tokens[: n * seq_len].view(n, seq_len)
    y = tokens[1 : n * seq_len + 1].view(n, seq_len)
    perm = torch.randperm(n)
    x, y = x[perm], y[perm]
    for i in range(0, n, batch_size):
        yield x[i : i + batch_size], y[i : i + batch_size]


# ── 3. Training loop ────────────────────────────────────────────
def train():
    torch.manual_seed(SEED)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(SEED)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")

    sp = build_tokenizer()

    print("Tokenizing corpus...")
    tokens = load_tokens(sp)
    print(f"Total tokens: {len(tokens):,}")

    model = EinsteinModel(
        VOCAB_SIZE, D_MODEL, N_HEADS, N_LAYERS, D_FF, SEQ_LEN, DROPOUT
    ).to(device)
    n_params = sum(p.numel() for p in model.parameters())
    print(f"Model parameters: {n_params:,}")

    config = {
        "architecture": "Decoder-only Transformer",
        "layers": N_LAYERS,
        "hidden_size": D_MODEL,
        "attention_heads": N_HEADS,
        "ffn_dim": D_FF,
        "vocab_size": VOCAB_SIZE,
        "context_length": SEQ_LEN,
        "dropout": DROPOUT,
        "parameters": f"{n_params / 1e6:.1f}M",
        "precision": "float32" if device == "cpu" else "bfloat16",
        "optimizer": "AdamW",
        "learning_rate": LR,
        "weight_decay": WEIGHT_DECAY,
        "batch_size": BATCH_SIZE,
        "max_epochs": MAX_EPOCHS,
        "seed": SEED,
        "device": device,
    }

    optimizer = torch.optim.AdamW(
        model.parameters(), lr=LR, betas=(0.9, 0.95), weight_decay=WEIGHT_DECAY
    )

    CHECKPOINT_DIR.mkdir(exist_ok=True)

    n_seqs = (len(tokens) - 1) // SEQ_LEN
    n_seqs = (n_seqs // BATCH_SIZE) * BATCH_SIZE  # match make_batches truncation
    total_batches = n_seqs // BATCH_SIZE
    total_steps = total_batches * MAX_EPOCHS

    # ── Resume from checkpoint if available ──
    loss_history = []
    global_step = 0
    start_epoch = 1
    resume_ckpt = CHECKPOINT_DIR / "latest.pt"

    if resume_ckpt.exists():
        print(f"Resuming from {resume_ckpt}...")
        ckpt = torch.load(str(resume_ckpt), map_location=device, weights_only=False)
        model.load_state_dict(ckpt["model"])
        optimizer.load_state_dict(ckpt["optimizer"])
        global_step = ckpt.get("step", 0)
        start_epoch = ckpt.get("epoch", 1)
        loss_history = ckpt.get("loss_history", [])
        print(f"  Resumed at step {global_step}, epoch {start_epoch}")

    print(f"Steps per epoch: {total_batches}, total steps: {total_steps}")

    metrics = {}
    start_time = time.time()
    write_state("running", config=config)

    use_amp = device == "cuda"

    for epoch in range(start_epoch, MAX_EPOCHS + 1):
        model.train()
        batches = list(make_batches(tokens, SEQ_LEN, BATCH_SIZE))
        epoch_loss = 0.0

        for batch_idx, (xb, yb) in enumerate(batches):
            if _stop_requested:
                break
            global_step += 1
            xb, yb = xb.to(device), yb.to(device)

            # Warmup + cosine LR
            if global_step <= WARMUP_STEPS:
                lr = LR * global_step / WARMUP_STEPS
            else:
                progress = (global_step - WARMUP_STEPS) / max(total_steps - WARMUP_STEPS, 1)
                lr = MIN_LR + 0.5 * (LR - MIN_LR) * (1 + math.cos(math.pi * progress))
            for pg in optimizer.param_groups:
                pg["lr"] = lr

            optimizer.zero_grad(set_to_none=True)

            if use_amp:
                with torch.amp.autocast("cuda", dtype=torch.bfloat16):
                    logits = model(xb)
                    loss = F.cross_entropy(logits.view(-1, VOCAB_SIZE), yb.view(-1))
                loss.backward()
                nn.utils.clip_grad_norm_(model.parameters(), 1.0)
                optimizer.step()
            else:
                logits = model(xb)
                loss = F.cross_entropy(logits.view(-1, VOCAB_SIZE), yb.view(-1))
                loss.backward()
                nn.utils.clip_grad_norm_(model.parameters(), 1.0)
                optimizer.step()

            loss_val = loss.item()
            epoch_loss += loss_val

            if global_step % LOG_EVERY == 0 or global_step == 1:
                elapsed = time.time() - start_time
                tok_per_sec = (global_step * BATCH_SIZE * SEQ_LEN) / max(elapsed, 1)
                remaining = (total_steps - global_step) / max(global_step / elapsed, 0.001)
                mins, secs = divmod(int(remaining), 60)

                gpu_mem = ""
                if device == "cuda":
                    gpu_mem = f"{torch.cuda.memory_allocated() / 1e9:.1f} GB"

                ppl = math.exp(min(loss_val, 20))  # cap to avoid overflow
                loss_history.append({"step": global_step, "loss": round(loss_val, 4)})

                metrics = {
                    "step": global_step,
                    "totalSteps": total_steps,
                    "loss": round(loss_val, 4),
                    "perplexity": round(ppl, 1),
                    "lr": lr,
                    "tokensPerSec": round(tok_per_sec),
                    "gpuMem": gpu_mem,
                    "epoch": round(epoch + batch_idx / len(batches), 2),
                    "eta": f"{mins}m {secs}s",
                }

                write_state("running", metrics=metrics, loss_history=loss_history, config=config)
                print(f"  step {global_step}/{total_steps} | loss {loss_val:.4f} | ppl {ppl:.1f} | lr {lr:.2e} | {tok_per_sec:.0f} tok/s | ETA {mins}m{secs}s")

            if global_step % SAVE_EVERY == 0:
                ckpt_path = CHECKPOINT_DIR / f"step_{global_step}.pt"
                torch.save({
                    "model": model.state_dict(),
                    "optimizer": optimizer.state_dict(),
                    "step": global_step,
                    "epoch": epoch,
                    "loss_history": loss_history,
                    "config": config,
                }, ckpt_path)
                # Also save as latest for resume
                torch.save({
                    "model": model.state_dict(),
                    "optimizer": optimizer.state_dict(),
                    "step": global_step,
                    "epoch": epoch,
                    "loss_history": loss_history,
                    "config": config,
                }, CHECKPOINT_DIR / "latest.pt")
                print(f"  Saved checkpoint: {ckpt_path.name}")

        avg_loss = epoch_loss / max(batch_idx + 1, 1)
        print(f"Epoch {epoch}/{MAX_EPOCHS} done | avg loss {avg_loss:.4f}")

        if _stop_requested:
            break

    # Save final
    final_path = CHECKPOINT_DIR / "final.pt"
    torch.save({
        "model": model.state_dict(),
        "optimizer": optimizer.state_dict(),
        "step": global_step,
        "epoch": MAX_EPOCHS,
        "loss_history": loss_history,
        "config": config,
    }, final_path)
    # Also save as latest
    torch.save({
        "model": model.state_dict(),
        "optimizer": optimizer.state_dict(),
        "step": global_step,
        "epoch": MAX_EPOCHS,
        "loss_history": loss_history,
        "config": config,
    }, CHECKPOINT_DIR / "latest.pt")

    if _stop_requested:
        print(f"Training stopped at step {global_step}. Model saved to {final_path}")
        write_state("stopped", metrics=metrics, loss_history=loss_history, config=config)
    else:
        print(f"Training complete. Final model saved to {final_path}")
        write_state("done", metrics=metrics, loss_history=loss_history, config=config)


if __name__ == "__main__":
    train()
