"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CONFIG = [
  { key: "Architecture", value: "Decoder-only Transformer" },
  { key: "Layers", value: "12" },
  { key: "Hidden Size", value: "768" },
  { key: "Attention Heads", value: "12" },
  { key: "FFN Dimension", value: "3072" },
  { key: "Vocab Size", value: "16,000 (BPE from corpus)" },
  { key: "Context Length", value: "512 tokens" },
  { key: "Positional Encoding", value: "RoPE" },
  { key: "Normalization", value: "RMSNorm (pre-norm)" },
  { key: "Precision", value: "bf16 mixed" },
  { key: "Optimizer", value: "8-bit AdamW" },
  { key: "Total Parameters", value: "~112M" },
];

export function ModelConfig() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Model Architecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {CONFIG.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">{item.key}</span>
              <span className="font-mono text-xs">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-xs font-medium text-primary">
            From Scratch Guarantee
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            All weights randomly initialized. No pretrained model, tokenizer, or
            embeddings used. Tokenizer trained only on approved pre-1905 corpus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
