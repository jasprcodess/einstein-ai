"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function TrainingPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Training Run</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            Not started
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono">0 / 0 steps</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricBox label="Loss" value="--" />
          <MetricBox label="Learning Rate" value="--" />
          <MetricBox label="Tokens/sec" value="--" />
          <MetricBox label="GPU Memory" value="--" />
          <MetricBox label="Epoch" value="--" />
          <MetricBox label="ETA" value="--" />
        </div>

        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium">Loss Curve</p>
          <div className="mt-2 flex h-24 items-end justify-center gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-t bg-muted"
                style={{ height: "4px" }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Training data will appear here
          </p>
        </div>

        <Button className="w-full gap-2" disabled>
          <Play className="h-4 w-4" />
          Start Training
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          Build the corpus and tokenizer first before training.
        </p>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm">{value}</p>
    </div>
  );
}
