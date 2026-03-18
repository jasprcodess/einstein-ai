"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CONFIG = [
  { key: "Architecture", value: "Decoder-only Transformer" },
  { key: "Layers", value: "12" },
  { key: "Hidden Size", value: "768" },
  { key: "Attention Heads", value: "12" },
  { key: "FFN Dimension", value: "3,072" },
  { key: "Vocab Size", value: "16,000" },
  { key: "Context Length", value: "512" },
  { key: "Positional Enc.", value: "RoPE" },
  { key: "Normalization", value: "RMSNorm" },
  { key: "Precision", value: "bf16" },
  { key: "Optimizer", value: "AdamW 8-bit" },
  { key: "Parameters", value: "~112M" },
];

export function ModelConfig() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Model Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {CONFIG.map((c) => (
            <div key={c.key} className="flex items-center justify-between py-3 px-1">
              <span className="text-sm text-muted-foreground">{c.key}</span>
              <span className="text-sm font-mono tabular-nums text-foreground">{c.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
