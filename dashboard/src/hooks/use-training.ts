"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface TrainingMetrics {
  step: number;
  totalSteps: number;
  loss: number;
  perplexity?: number;
  lr: number;
  tokensPerSec: number;
  gpuMem: string;
  epoch: number;
  eta: string;
}

interface LossPoint {
  step: number;
  loss: number;
}

interface TrainingConfig {
  [key: string]: string | number;
}

type TrainingStatus = "idle" | "running" | "done" | "stopped";

export function useTraining() {
  const [status, setStatus] = useState<TrainingStatus>("idle");
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [lossHistory, setLossHistory] = useState<LossPoint[]>([]);
  const [config, setConfig] = useState<TrainingConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/training/status");
      if (!res.ok) return;
      const data = await res.json();

      if (data.status) setStatus(data.status as TrainingStatus);
      if (data.metrics && data.metrics.step > 0) setMetrics(data.metrics);
      if (data.lossHistory?.length > 0) setLossHistory(data.lossHistory);
      if (data.config && Object.keys(data.config).length > 0) setConfig(data.config);

      if (data.status === "done" || data.status === "stopped") {
        clearTimer();
      }
    } catch {
      // API not available
    }
  }, [clearTimer]);

  const startPolling = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(poll, 1500);
  }, [clearTimer, poll]);

  const start = useCallback(async (fresh = false) => {
    setError(null);
    try {
      const res = await fetch("/api/training/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fresh }),
      });
      const data = await res.json();

      if (data.ok) {
        // Clear old data immediately
        setStatus("running");
        setMetrics(null);
        setLossHistory([]);
        setConfig(null);
        startPolling();
      } else if (res.status === 409) {
        // Already running, just start polling
        setStatus("running");
        startPolling();
      } else {
        setError(data.error || "Failed to start training");
      }
    } catch (e) {
      setError("Failed to start training");
      console.error(e);
    }
  }, [startPolling]);

  const stop = useCallback(async () => {
    try {
      await fetch("/api/training/stop", { method: "POST" });
      setStatus("stopped");
      clearTimer();
    } catch (e) {
      console.error("Failed to stop training:", e);
    }
  }, [clearTimer]);

  const archive = useCallback(async () => {
    try {
      const res = await fetch("/api/training/archive", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        // Wipe all local state — archive deleted everything on disk
        setStatus("idle");
        setMetrics(null);
        setLossHistory([]);
        setConfig(null);
        setError(null);
        clearTimer();
      }
      return data;
    } catch {
      return { error: "Failed to archive" };
    }
  }, [clearTimer]);

  // On mount, check current state
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/training/status");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled) return;

        if (data.status) setStatus(data.status as TrainingStatus);
        if (data.metrics && data.metrics.step > 0) setMetrics(data.metrics);
        if (data.lossHistory?.length > 0) setLossHistory(data.lossHistory);
        if (data.config && Object.keys(data.config).length > 0) setConfig(data.config);

        if (data.status === "running") {
          startPolling();
        }
      } catch {
        // API not available
      }
    })();
    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [poll, clearTimer, startPolling]);

  return { status, metrics, lossHistory, config, error, start, stop, archive } as const;
}
