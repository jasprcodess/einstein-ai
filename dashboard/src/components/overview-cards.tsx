"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIMELINE = [
  { year: "1687", event: "Newton's Principia Mathematica", ok: true },
  { year: "1865", event: "Maxwell's electromagnetic theory", ok: true },
  { year: "1887", event: "Michelson-Morley experiment", ok: true },
  { year: "1900", event: "Planck's quantum hypothesis", ok: true },
  { year: "1905", event: "Einstein's special relativity", ok: false },
  { year: "1915", event: "Einstein's general relativity", ok: false },
];

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
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Temporal Boundary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {TIMELINE.map((item) => (
            <div
              key={item.year}
              className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 font-mono text-xs text-muted-foreground tabular-nums">
                  {item.year}
                </span>
                <span className="text-[13px]">{item.event}</span>
              </div>
              <Badge
                variant={item.ok ? "secondary" : "destructive"}
                className="text-[10px] font-medium"
              >
                {item.ok ? "Eligible" : "Blocked"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {STATUS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
            >
              <span className="text-[13px]">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.value}</span>
            </div>
          ))}

          <div className="mt-3 rounded-md border border-primary/15 bg-primary/5 px-3 py-2.5">
            <p className="text-[11px] font-medium text-primary">
              Clean-Room Protocol Active
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
              All learned components restricted to pre-1905 verified sources.
              No pretrained weights, tokenizers, or external knowledge.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
