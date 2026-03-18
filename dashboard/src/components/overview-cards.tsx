"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS = [
  { label: "Corpus Pipeline", value: "Not started" },
  { label: "Tokenizer", value: "Not trained" },
  { label: "Model Weights", value: "Not initialized" },
  { label: "Evaluation Suite", value: "Not configured" },
  { label: "Chat Inference", value: "Offline" },
];

export function OverviewCards() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {STATUS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2"
            >
              <span className="text-[13px]">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">About This Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-primary/15 bg-primary/5 px-3 py-2.5">
            <p className="text-[11px] font-medium text-primary">
              Clean-Room Protocol
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
              All learned components restricted to pre-1905 verified sources.
              No pretrained weights, tokenizers, or external knowledge.
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Einstein AI is a from-scratch language model experiment. The goal
            is to train a transformer using only data published before Einstein
            discovered special relativity, and test whether it can reason
            about the physics of that era.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
