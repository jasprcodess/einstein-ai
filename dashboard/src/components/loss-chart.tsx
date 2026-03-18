"use client";

const PAD = { top: 8, right: 12, bottom: 24, left: 48 };
const H = 160;

export function LossChart({ data }: { data: Array<{ step: number; loss: number }> }) {
  if (data.length < 2) return null;

  const steps = data.map((d) => d.step);
  const losses = data.map((d) => d.loss);
  const minStep = steps[0], maxStep = steps[steps.length - 1];
  const minLoss = Math.min(...losses), maxLoss = Math.max(...losses);
  const lossRange = maxLoss - minLoss || 1;
  const stepRange = maxStep - minStep || 1;

  const w = 1000; // viewBox width; scales responsively
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

  return (
    <svg viewBox={`0 0 ${w} ${H}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lossFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a0a0a0" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#a0a0a0" stopOpacity={0} />
        </linearGradient>
      </defs>

      {yTicks.map((t) => (
        <g key={t.label}>
          <line x1={PAD.left} x2={w - PAD.right} y1={t.y} y2={t.y} stroke="#2a2a2a" />
          <text x={PAD.left - 6} y={t.y + 3} textAnchor="end" fill="#808080" fontSize={10}
            fontFamily="monospace" style={{ fontVariantNumeric: "tabular-nums" }}>
            {t.label}
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <text key={t.label} x={t.x} y={H - 4} textAnchor="middle" fill="#808080" fontSize={10}
          fontFamily="monospace" style={{ fontVariantNumeric: "tabular-nums" }}>
          {t.label}
        </text>
      ))}

      <path d={areaPath} fill="url(#lossFill)" />
      <polyline points={pts} fill="none" stroke="#a0a0a0" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
