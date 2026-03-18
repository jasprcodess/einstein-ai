"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ERAS = [
  { range: "1600-1700", label: "Early Modern", count: 0, color: "bg-chart-5" },
  { range: "1700-1800", label: "Enlightenment", count: 0, color: "bg-chart-4" },
  { range: "1800-1860", label: "Classical Era", count: 0, color: "bg-chart-3" },
  { range: "1860-1905", label: "Pre-Relativity", count: 0, color: "bg-chart-1" },
];

export function CorpusTimeline() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Source Distribution
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            Cutoff: 1905-04-30
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ERAS.map((era) => (
            <div key={era.range} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-sm ${era.color}`} />
                  <span className="text-xs">{era.label}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {era.range}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${era.color} opacity-60`}
                  style={{ width: `${era.count}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-6 h-8">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-destructive"
            style={{ left: "80%" }}
          />
          <div
            className="absolute -top-5 text-[10px] font-medium text-destructive"
            style={{ left: "80%", transform: "translateX(-50%)" }}
          >
            1905 CUTOFF
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-[11px] text-muted-foreground">
            No sources ingested yet. Start the corpus pipeline to collect
            verified pre-1905 texts from public domain archives.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
