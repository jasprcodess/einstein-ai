"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIMELINE_ITEMS = [
  { year: "1687", event: "Newton's Principia Mathematica", status: "eligible" as const },
  { year: "1865", event: "Maxwell's electromagnetic theory", status: "eligible" as const },
  { year: "1887", event: "Michelson-Morley experiment", status: "eligible" as const },
  { year: "1900", event: "Planck's quantum hypothesis", status: "eligible" as const },
  { year: "1905", event: "Einstein's special relativity", status: "blocked" as const },
  { year: "1915", event: "Einstein's general relativity", status: "blocked" as const },
];

const SYSTEM_STATUS = [
  { label: "Corpus Pipeline", status: "Not started" },
  { label: "Tokenizer", status: "Not trained" },
  { label: "Model Weights", status: "Not initialized" },
  { label: "Evaluation Suite", status: "Not configured" },
  { label: "Chat Inference", status: "Offline" },
];

export function OverviewCards() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Temporal Boundary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TIMELINE_ITEMS.map((item) => (
            <div
              key={item.year}
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 font-mono text-xs text-muted-foreground">
                  {item.year}
                </span>
                <span className="text-sm">{item.event}</span>
              </div>
              <Badge
                variant={item.status === "eligible" ? "default" : "destructive"}
                className="text-[10px]"
              >
                {item.status === "eligible" ? "Eligible" : "Blocked"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SYSTEM_STATUS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-xs text-muted-foreground">
                {item.status}
              </span>
            </div>
          ))}

          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-xs font-medium text-primary">
              Clean-Room Protocol Active
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              All learned components restricted to pre-1905 verified sources.
              No pretrained weights, tokenizers, or external knowledge allowed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
