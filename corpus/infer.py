#!/usr/bin/env python3
"""infer.py — Load trained Einstein model and generate text from a prompt."""

import json, sys, torch, argparse
from pathlib import Path

import torch.nn.functional as F
import sentencepiece as spm

from model import EinsteinModel

ROOT = Path(__file__).parent
TOKENIZER_MODEL = ROOT / "tokenizer.model"
CHECKPOINT = ROOT / "checkpoints" / "final.pt"


@torch.inference_mode()
def generate(model, sp, prompt, max_tokens=256, temperature=0.8, top_k=40,
             repetition_penalty=1.2, device="cpu", seq_len=256):
    ids = sp.Encode(prompt)
    ctx = torch.tensor([ids], dtype=torch.long, device=device)

    for _ in range(max_tokens):
        x = ctx[:, -seq_len:]
        logits = model(x)[:, -1, :]

        # Repetition penalty
        if repetition_penalty != 1.0:
            for token_id in set(ctx[0].tolist()):
                if logits[0, token_id] > 0:
                    logits[0, token_id] /= repetition_penalty
                else:
                    logits[0, token_id] *= repetition_penalty

        # Temperature
        if temperature == 0:
            tok = logits.argmax(dim=-1, keepdim=True)
        else:
            logits = logits / temperature
            if top_k > 0:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = -float("inf")
            probs = F.softmax(logits, dim=-1)
            tok = torch.multinomial(probs, 1)

        if tok.item() == sp.eos_id():
            break
        ctx = torch.cat([ctx, tok], dim=1)

    out_ids = ctx[0].tolist()[len(ids):]
    return sp.Decode(out_ids)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", type=str, required=True)
    parser.add_argument("--max-tokens", type=int, default=256)
    parser.add_argument("--temperature", type=float, default=0.8)
    parser.add_argument("--top-k", type=int, default=40)
    parser.add_argument("--repetition-penalty", type=float, default=1.2)
    args = parser.parse_args()

    try:
        if not TOKENIZER_MODEL.exists():
            print(json.dumps({"error": "Tokenizer not found. Train the model first."}))
            sys.exit(1)
        if not CHECKPOINT.exists():
            print(json.dumps({"error": "Checkpoint not found. Train the model first."}))
            sys.exit(1)

        device = "cuda" if torch.cuda.is_available() else "cpu"

        sp = spm.SentencePieceProcessor()
        sp.Load(str(TOKENIZER_MODEL))

        ckpt = torch.load(str(CHECKPOINT), map_location=device, weights_only=False)
        config = ckpt.get("config")
        if not config:
            print(json.dumps({"error": "Checkpoint missing config — retrain with latest train.py"}))
            sys.exit(1)

        required = ["vocab_size", "hidden_size", "attention_heads", "layers", "ffn_dim", "context_length"]
        missing = [k for k in required if k not in config]
        if missing:
            print(json.dumps({"error": f"Checkpoint config missing keys: {missing}"}))
            sys.exit(1)

        model = EinsteinModel(
            vocab_size=config["vocab_size"],
            dim=config["hidden_size"],
            n_heads=config["attention_heads"],
            n_layers=config["layers"],
            ff_dim=config["ffn_dim"],
            max_seq_len=config["context_length"],
            dropout=0.0,
        ).to(device)

        model.load_state_dict(ckpt["model"])
        model.eval()

        seq_len = config["context_length"]
        text = generate(
            model, sp, args.prompt,
            args.max_tokens, args.temperature, args.top_k,
            args.repetition_penalty, device, seq_len,
        )
        print(json.dumps({"text": text}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
