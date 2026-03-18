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
    <div className="mt-6 grid gap-4 lg:grid-cols-2 items-start">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {STATUS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5 transition-colors duration-150 hover:bg-accent"
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">About This Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-border bg-muted px-4 py-3">
            <p className="text-sm font-medium text-foreground">Clean-Room Protocol</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              All learned components restricted to pre-1905 verified sources.
              No pretrained weights, tokenizers, or external knowledge.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Einstein AI is a from-scratch language model experiment. The goal
            is to train a transformer using only data published before Einstein
            discovered special relativity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
