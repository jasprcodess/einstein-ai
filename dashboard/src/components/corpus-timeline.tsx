"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ERAS = [
  { range: "1600-1700", label: "Early Modern", pct: 0 },
  { range: "1700-1800", label: "Enlightenment", pct: 0 },
  { range: "1800-1860", label: "Classical Era", pct: 0 },
  { range: "1860-1905", label: "Pre-Relativity", pct: 0 },
];

export function CorpusTimeline() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Source Distribution</CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono">
            Cutoff: 1905-04-30
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ERAS.map((era) => (
            <div key={era.range} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">{era.label}</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {era.range}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full bg-primary/50"
                  style={{ width: `${era.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8 h-6">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <div className="absolute top-0 bottom-0 w-px bg-destructive" style={{ left: "80%" }} />
          <span
            className="absolute -top-4 text-[9px] font-semibold tracking-wider uppercase text-destructive"
            style={{ left: "80%", transform: "translateX(-50%)" }}
          >
            1905
          </span>
        </div>

        <div className="mt-4 rounded-md border border-primary/15 bg-primary/5 px-3 py-2">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            No sources ingested yet. Start the corpus pipeline to collect
            verified pre-1905 texts from public domain archives.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
