"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function TrainingPanel() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Training Run</CardTitle>
          <Badge variant="secondary" className="text-[10px]">Not started</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono tabular-nums">0 / 0 steps</span>
          </div>
          <Progress value={0} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Loss", value: "--" },
            { label: "Learning Rate", value: "--" },
            { label: "Tokens/sec", value: "--" },
            { label: "GPU Memory", value: "--" },
            { label: "Epoch", value: "--" },
            { label: "ETA", value: "--" },
          ].map((m) => (
            <div key={m.label} className="rounded-md bg-muted/40 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
              <p className="mt-0.5 font-mono text-sm tabular-nums">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-muted/40 p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Loss Curve</p>
          <div className="mt-2 flex h-20 items-end justify-around gap-px">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-1 rounded-t bg-primary/15" style={{ height: "3px" }} />
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
            Data will appear once training starts
          </p>
        </div>

        <Button className="w-full gap-2" disabled>
          <Play className="h-4 w-4" />
          Start Training
        </Button>

        <p className="text-center text-[10px] text-muted-foreground/60">
          Build the corpus and tokenizer first.
        </p>
      </CardContent>
    </Card>
  );
}
