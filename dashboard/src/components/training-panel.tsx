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
          <Badge variant="secondary" className="text-[10px]">Not started</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono tabular-nums">-- / -- steps</span>
          </div>
          <Progress value={0} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {["Loss", "Learning Rate", "Tokens/sec", "GPU Memory", "Epoch", "ETA"].map((label) => (
            <div key={label} className="rounded-md bg-muted/60 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="mt-0.5 font-mono text-sm tabular-nums">--</p>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-muted/40 p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Loss Curve</p>
          <div className="mt-3 flex h-20 items-center justify-center">
            <p className="text-[10px] text-muted-foreground/50">
              Will populate once training starts
            </p>
          </div>
        </div>

        <Button className="w-full gap-2" disabled>
          <Play className="h-4 w-4" />
          Start Training
        </Button>
        <p className="text-center text-[10px] text-muted-foreground/50">
          Build the corpus and tokenizer first.
        </p>
      </CardContent>
    </Card>
  );
}
