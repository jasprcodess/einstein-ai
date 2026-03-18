"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChartSkeleton } from "@/components/ui/skeleton";
import { Play, Lock, Square } from "lucide-react";
import { useTraining } from "@/hooks/use-training";
import { LossChart } from "@/components/loss-chart";

export function TrainingPanel() {
  const { status, metrics: rawMetrics, lossHistory, start, stop } = useTraining();
  const isRunning = status === "running";
  const isDone = status === "done";
  const m = rawMetrics ?? { step: 0, totalSteps: 0, loss: 0, lr: 0, tokensPerSec: 0, gpuMem: "", epoch: 0, eta: "" };

  return (
    <div className="flex h-full flex-col space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Training Run</CardTitle>
            <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
              {status === "idle" ? "Not started" : status === "running" ? "Training..." : "Complete"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono tabular-nums">
                {m.step > 0 ? `${m.step} / ${m.totalSteps}` : "-- / --"}
              </span>
            </div>
            <Progress value={m.totalSteps > 0 ? (m.step / m.totalSteps) * 100 : 0} className="h-1.5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Loss", value: m.loss > 0 ? m.loss.toFixed(4) : "--" },
              { label: "Learning Rate", value: m.lr > 0 ? m.lr.toExponential(1) : "--" },
              { label: "Tokens/sec", value: m.tokensPerSec > 0 ? Math.round(m.tokensPerSec).toLocaleString() : "--" },
              { label: "GPU Memory", value: m.gpuMem || "--" },
              { label: "Epoch", value: m.epoch > 0 ? m.epoch.toFixed(1) : "--" },
              { label: "ETA", value: m.eta || "--" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-md bg-muted px-3 py-2.5">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="mt-0.5 text-sm font-mono tabular-nums">{metric.value}</p>
              </div>
            ))}
          </div>

          {isRunning ? (
            <Button className="w-full h-11 gap-2 text-sm" variant="destructive" onClick={stop}>
              <Square className="h-4 w-4" />
              Stop Training
            </Button>
          ) : (
            <Button className="w-full h-11 gap-2 text-sm" variant="secondary" onClick={start} disabled={isDone}>
              {isDone ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isDone ? "Training Complete" : "Start Training"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Loss Curve</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          {lossHistory.length > 0 ? (
            <LossChart data={lossHistory} />
          ) : (
            <>
              <BarChartSkeleton />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Chart will populate once training starts
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
