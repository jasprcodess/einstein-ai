"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, Square, Archive, RotateCcw } from "lucide-react";
import { useTraining } from "@/hooks/use-training";
import { LossChart } from "@/components/loss-chart";

export function TrainingPanel() {
  const { status, metrics: rawMetrics, lossHistory, config, error, start, stop, archive } = useTraining();
  const [archiveMsg, setArchiveMsg] = useState<string | null>(null);

  const isRunning = status === "running";
  const isDone = status === "done";
  const isStopped = status === "stopped";
  const canArchive = isDone || isStopped;
  const m = rawMetrics ?? { step: 0, totalSteps: 0, loss: 0, lr: 0, tokensPerSec: 0, gpuMem: "", epoch: 0, eta: "" };

  const statusLabel = {
    idle: "Ready",
    running: "Training...",
    done: "Complete",
    stopped: "Stopped",
  }[status] ?? status;

  async function handleArchive() {
    setArchiveMsg(null);
    const res = await archive();
    setArchiveMsg(res.ok ? `Archived: ${res.runId}` : (res.error || "Failed"));
  }

  return (
    <div className="space-y-4">
      {/* Model config */}
      {config && Object.keys(config).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Model Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {Object.entries(config).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-2 px-1">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-sm font-mono tabular-nums">{String(val)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training controls + metrics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Training Run</CardTitle>
            <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
              {statusLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {(status === "idle") && lossHistory.length === 0 ? (
            <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground">Ready to train</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Will train a transformer on your local corpus from scratch.
              </p>
            </div>
          ) : (
            <MetricsGrid m={m} />
          )}

          <TrainingActions
            status={status}
            canArchive={canArchive}
            archiveMsg={archiveMsg}
            onStart={() => start(false)}
            onFreshStart={() => start(true)}
            onStop={stop}
            onArchive={handleArchive}
          />
        </CardContent>
      </Card>

      {/* Loss curve */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Loss Curve</CardTitle>
        </CardHeader>
        <CardContent>
          {lossHistory.length > 0 ? (
            <LossChart data={lossHistory} />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Chart populates during training</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricsGrid({ m }: { m: { step: number; totalSteps: number; loss: number; lr: number; tokensPerSec: number; gpuMem: string; epoch: number; eta: string } }) {
  const items = [
    { label: "Loss", value: m.loss > 0 ? m.loss.toFixed(4) : "--" },
    { label: "LR", value: m.lr > 0 ? m.lr.toExponential(1) : "--" },
    { label: "Tok/s", value: m.tokensPerSec > 0 ? Math.round(m.tokensPerSec).toLocaleString() : "--" },
    { label: "GPU", value: m.gpuMem || "--" },
    { label: "Epoch", value: m.epoch > 0 ? m.epoch.toFixed(1) : "--" },
    { label: "ETA", value: m.eta || "--" },
  ];

  return (
    <>
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono tabular-nums">
            {m.step > 0 ? `${m.step} / ${m.totalSteps}` : "-- / --"}
          </span>
        </div>
        <Progress value={m.totalSteps > 0 ? (m.step / m.totalSteps) * 100 : 0} className="h-1.5" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((metric) => (
          <div key={metric.label} className="rounded-md bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-0.5 text-sm font-mono tabular-nums">{metric.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function TrainingActions({
  status, canArchive, archiveMsg, onStart, onFreshStart, onStop, onArchive,
}: {
  status: string;
  canArchive: boolean;
  archiveMsg: string | null;
  onStart: () => void;
  onFreshStart: () => void;
  onStop: () => void;
  onArchive: () => void;
}) {
  const isRunning = status === "running";
  const isDone = status === "done";
  const isStopped = status === "stopped";

  return (
    <div className="space-y-2">
      {isRunning ? (
        <Button className="w-full h-10 gap-2 text-sm" variant="destructive" onClick={onStop}>
          <Square className="h-4 w-4" />
          Stop Training
        </Button>
      ) : (
        <div className="flex gap-2">
          {(isDone || isStopped) ? (
            <>
              <Button className="flex-1 h-10 gap-2 text-sm" variant="outline" onClick={onStart}>
                <Play className="h-4 w-4" />
                Resume
              </Button>
              <Button className="flex-1 h-10 gap-2 text-sm" onClick={onFreshStart}>
                <RotateCcw className="h-4 w-4" />
                Fresh Retrain
              </Button>
            </>
          ) : (
            <Button className="w-full h-10 gap-2 text-sm" onClick={onFreshStart}>
              <Play className="h-4 w-4" />
              Start Training
            </Button>
          )}
        </div>
      )}

      {canArchive && (
        <Button className="w-full h-9 gap-2 text-xs" variant="outline" onClick={onArchive}>
          <Archive className="h-3.5 w-3.5" />
          Archive This Run
        </Button>
      )}

      {archiveMsg && (
        <p className="text-xs text-muted-foreground text-center">{archiveMsg}</p>
      )}
    </div>
  );
}
