"use client";

import { useState } from "react";

interface BarItem {
  label: string;
  value: number;
  detail?: string;
}

export function HorizontalBars({ items, unit = "", limit = 4 }: { items: BarItem[]; unit?: string; limit?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...items.map((i) => i.value), 1);
  const visible = items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div className="relative">
      <div className="space-y-3">
        {visible.map((item, idx) => {
          const pct = Math.max(4, (item.value / maxVal) * 100);
          const isActive = hovered === idx;
          return (
            <div
              key={item.label}
              className="space-y-1 cursor-default"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-sm transition-colors ${isActive ? "text-foreground" : ""}`}>
                  {item.label}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {item.detail ?? `${item.value.toLocaleString()}${unit}`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-200 ${isActive ? "bg-foreground" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="h-12 -mt-8 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent, var(--card))",
        }} />
      )}
    </div>
  );
}

interface TimelineBar {
  year: number;
  count: number;
}

export function TimelineChart({ bars }: { bars: TimelineBar[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxCount = Math.max(...bars.map((b) => b.count), 1);

  return (
    <div>
      <div className="flex items-end gap-2 h-40 border-b border-border pb-2">
        {bars.map((b, idx) => {
          const pct = (b.count / maxCount) * 100;
          const isActive = hovered === idx;
          return (
            <div
              key={b.year}
              className="flex-1 flex flex-col items-center justify-end h-full cursor-default group"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {isActive && (
                <div className="mb-1 rounded border border-border bg-popover px-2 py-1 shadow-md text-center">
                  <p className="text-[10px] text-muted-foreground">{b.year}</p>
                  <p className="text-xs font-mono font-medium">{b.count} doc{b.count !== 1 ? "s" : ""}</p>
                </div>
              )}
              {!isActive && (
                <span className="text-xs tabular-nums text-muted-foreground mb-1">{b.count}</span>
              )}
              <div
                className={`w-full rounded-t min-h-[4px] transition-colors duration-150 ${isActive ? "bg-foreground" : "bg-primary"}`}
                style={{ height: `${Math.max(6, pct)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 pt-2">
        {bars.map((b, idx) => (
          <div key={b.year} className="flex-1 text-center">
            <span className={`text-xs tabular-nums transition-colors ${hovered === idx ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {b.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
