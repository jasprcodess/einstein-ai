"use client";

import { useState, useRef, useCallback } from "react";

const PAD = { top: 12, right: 16, bottom: 28, left: 52 };
const H = 180;

interface Point {
  step: number;
  loss: number;
}

export function LossChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  if (data.length < 2) return null;

  const steps = data.map((d) => d.step);
  const losses = data.map((d) => d.loss);
  const minStep = steps[0], maxStep = steps[steps.length - 1];
  const minLoss = Math.min(...losses), maxLoss = Math.max(...losses);
  const lossRange = maxLoss - minLoss || 1;
  const stepRange = maxStep - minStep || 1;

  const w = 1000;
  const cw = w - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  const toX = (s: number) => PAD.left + ((s - minStep) / stepRange) * cw;
  const toY = (l: number) => PAD.top + ((maxLoss - l) / lossRange) * ch;

  const pts = data.map((d) => `${toX(d.step)},${toY(d.loss)}`).join(" ");
  const areaPath = [
    `M${toX(data[0].step)},${toY(data[0].loss)}`,
    ...data.slice(1).map((d) => `L${toX(d.step)},${toY(d.loss)}`),
    `L${toX(data[data.length - 1].step)},${PAD.top + ch}`,
    `L${toX(data[0].step)},${PAD.top + ch}Z`,
  ].join(" ");

  const yTicks = Array.from({ length: 4 }, (_, i) => {
    const v = maxLoss - (i / 3) * lossRange;
    return { y: toY(v), label: v.toPrecision(3) };
  });

  const xTicks = [
    { x: toX(minStep), label: String(minStep) },
    { x: toX((minStep + maxStep) / 2), label: String(Math.round((minStep + maxStep) / 2)) },
    { x: toX(maxStep), label: String(maxStep) },
  ];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * w;
      const stepVal = minStep + ((relX - PAD.left) / cw) * stepRange;

      let closest = data[0];
      let closestDist = Infinity;
      for (const d of data) {
        const dist = Math.abs(d.step - stepVal);
        if (dist < closestDist) {
          closestDist = dist;
          closest = d;
        }
      }
      setHover(closest);
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [data, minStep, stepRange, cw, w]
  );

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${H}`}
        className="w-full h-44"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="lossFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.15} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t.label}>
            <line x1={PAD.left} x2={w - PAD.right} y1={t.y} y2={t.y} className="stroke-border" />
            <text x={PAD.left - 6} y={t.y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}
              fontFamily="monospace" style={{ fontVariantNumeric: "tabular-nums" }}>
              {t.label}
            </text>
          </g>
        ))}

        {xTicks.map((t) => (
          <text key={t.label} x={t.x} y={H - 4} textAnchor="middle" className="fill-muted-foreground" fontSize={10}
            fontFamily="monospace" style={{ fontVariantNumeric: "tabular-nums" }}>
            {t.label}
          </text>
        ))}

        <path d={areaPath} fill="url(#lossFill)" />
        <polyline points={pts} fill="none" className="stroke-foreground/60" strokeWidth={2} vectorEffect="non-scaling-stroke" />

        {hover && (
          <>
            <line
              x1={toX(hover.step)} x2={toX(hover.step)}
              y1={PAD.top} y2={PAD.top + ch}
              className="stroke-muted-foreground/50" strokeWidth={1} strokeDasharray="4,4" vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={toX(hover.step)} cy={toY(hover.loss)}
              r={5} className="fill-background stroke-foreground/60" strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-border bg-popover px-3 py-2 shadow-lg"
          style={{
            left: Math.min(mousePos.x + 12, (svgRef.current?.getBoundingClientRect().width ?? 300) - 130),
            top: mousePos.y - 50,
          }}
        >
          <p className="text-xs text-muted-foreground">Step {hover.step}</p>
          <p className="text-sm font-mono tabular-nums font-medium">{hover.loss.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}
