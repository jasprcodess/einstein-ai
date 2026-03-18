"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CONFIG = [
  { key: "Architecture", value: "Decoder-only Transformer" },
  { key: "Layers", value: "12" },
  { key: "Hidden Size", value: "768" },
  { key: "Attention Heads", value: "12" },
  { key: "FFN Dimension", value: "3072" },
  { key: "Vocab Size", value: "16,000 (BPE)" },
  { key: "Context Length", value: "512" },
  { key: "Positional Encoding", value: "RoPE" },
  { key: "Normalization", value: "RMSNorm" },
  { key: "Precision", value: "bf16" },
  { key: "Optimizer", value: "8-bit AdamW" },
  { key: "Total Parameters", value: "~112M" },
];

export function ModelConfig() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Model Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {CONFIG.map((c) => (
            <div
              key={c.key}
              className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
            >
              <span className="text-[12px] text-muted-foreground">{c.key}</span>
              <span className="font-mono text-[12px] tabular-nums">{c.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-primary/15 bg-primary/5 px-3 py-2.5">
          <p className="text-[11px] font-medium text-primary">From-Scratch Guarantee</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
            All weights randomly initialized. No pretrained model, tokenizer,
            or embeddings. Tokenizer trained only on approved pre-1905 corpus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
