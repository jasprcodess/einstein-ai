"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ActivityChartCard } from "@/components/ui/activity-chart-card";
import { Play } from "lucide-react";

const PLACEHOLDER_CHART_DATA = [
  { day: "1", value: 0 },
  { day: "2", value: 0 },
  { day: "3", value: 0 },
  { day: "4", value: 0 },
  { day: "5", value: 0 },
  { day: "6", value: 0 },
  { day: "7", value: 0 },
];

export function TrainingPanel() {
  return (
    <div className="space-y-4">
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

          <Button className="w-full gap-2" disabled>
            <Play className="h-4 w-4" />
            Start Training
          </Button>
          <p className="text-center text-[10px] text-muted-foreground/50">
            Build the corpus and tokenizer first.
          </p>
        </CardContent>
      </Card>

      <ActivityChartCard
        title="Training Loss"
        totalValue="--"
        description="Will update during training"
        data={PLACEHOLDER_CHART_DATA}
        dropdownOptions={["Loss", "Tokens/sec", "GPU Mem"]}
      />
    </div>
  );
}
