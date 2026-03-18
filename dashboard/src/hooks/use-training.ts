"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface TrainingMetrics {
  step: number;
  totalSteps: number;
  loss: number;
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

type TrainingStatus = "idle" | "running" | "done";

const POLL_INTERVAL = 2_000;
const DEMO_DURATION = 60_000;
const DEMO_TOTAL_STEPS = 1000;
const DEMO_INITIAL_LOSS = 8.5;
const DEMO_FINAL_LOSS = 0.35;

function formatEta(remainingMs: number): string {
  const totalSec = Math.max(0, Math.round(remainingMs / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s}s`;
}

function generateDemoMetrics(elapsed: number): TrainingMetrics {
  const progress = Math.min(elapsed / DEMO_DURATION, 1);
  const step = Math.round(progress * DEMO_TOTAL_STEPS);

  // Logarithmic decay: loss = a * exp(-k * progress) + floor
  // Solve so that loss(0) ≈ DEMO_INITIAL_LOSS and loss(1) ≈ DEMO_FINAL_LOSS
  const baseLoss =
    (DEMO_INITIAL_LOSS - DEMO_FINAL_LOSS) * Math.exp(-3.2 * progress) +
    DEMO_FINAL_LOSS;

  // Add realistic noise that shrinks as training progresses
  const noiseScale = 0.15 * (1 - progress * 0.7);
  const noise = (Math.random() - 0.5) * 2 * noiseScale;
  const loss = Math.max(0.01, baseLoss + noise);

  // Cosine-annealed learning rate
  const lrMax = 3e-4;
  const lrMin = 1e-5;
  const lr = lrMin + 0.5 * (lrMax - lrMin) * (1 + Math.cos(Math.PI * progress));

  // Tokens/sec ramps up then stabilises with small jitter
  const baseTokens = 4200 + 800 * Math.min(progress * 5, 1);
  const tokensPerSec = Math.round(baseTokens + (Math.random() - 0.5) * 200);

  // GPU memory fluctuates slightly
  const gpuBase = 21.3 + Math.random() * 0.8;
  const gpuMem = `${gpuBase.toFixed(1)} GB`;

  const epoch = Math.floor(progress * 3 * 100) / 100; // up to ~3 epochs
  const eta = formatEta(DEMO_DURATION - elapsed);

  return {
    step,
    totalSteps: DEMO_TOTAL_STEPS,
    loss: Math.round(loss * 10000) / 10000,
    lr,
    tokensPerSec,
    gpuMem,
    epoch,
    eta,
  };
}

export function useTraining() {
  const [status, setStatus] = useState<TrainingStatus>("idle");
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [lossHistory, setLossHistory] = useState<LossPoint[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const demoModeRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(async () => {
    // --- live mode: try the real API first ---
    if (!demoModeRef.current) {
      try {
        const res = await fetch("/api/training/status");
        if (!res.ok) throw new Error(`API ${res.status}`);

        const data: TrainingMetrics = await res.json();
        setMetrics(data);
        setLossHistory((prev) => [...prev, { step: data.step, loss: data.loss }]);

        if (data.step >= data.totalSteps) {
          setStatus("done");
          clearTimer();
        }
        return;
      } catch {
        // API unavailable — switch to demo mode permanently for this run
        demoModeRef.current = true;
        startTimeRef.current = Date.now();
      }
    }

    // --- demo mode ---
    const elapsed = Date.now() - startTimeRef.current;

    if (elapsed >= DEMO_DURATION) {
      const final = generateDemoMetrics(DEMO_DURATION);
      setMetrics(final);
      setLossHistory((prev) => [...prev, { step: final.step, loss: final.loss }]);
      setStatus("done");
      clearTimer();
      return;
    }

    const m = generateDemoMetrics(elapsed);
    setMetrics(m);
    setLossHistory((prev) => [...prev, { step: m.step, loss: m.loss }]);
  }, [clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    demoModeRef.current = false;
    startTimeRef.current = Date.now();
    setStatus("running");
    setMetrics(null);
    setLossHistory([]);

    // Fire immediately, then poll
    tick();
    intervalRef.current = setInterval(tick, POLL_INTERVAL);
  }, [clearTimer, tick]);

  const stop = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { status, metrics, lossHistory, start, stop } as const;
}
