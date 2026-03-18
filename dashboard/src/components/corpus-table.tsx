"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SOURCES = [
  { title: "Treatise on Light", author: "Christiaan Huygens", year: 1690, type: "Book", blocked: false },
  { title: "A Dynamical Theory of the Electromagnetic Field", author: "James Clerk Maxwell", year: 1865, type: "Paper", blocked: false },
  { title: "On the Relative Motion of the Earth and the Luminiferous Ether", author: "Michelson & Morley", year: 1887, type: "Paper", blocked: false },
  { title: "Science and Hypothesis", author: "Henri Poincare", year: 1902, type: "Book", blocked: false },
  { title: "The Theory of Electrons", author: "H. A. Lorentz", year: 1904, type: "Lectures", blocked: false },
  { title: "On the Electrodynamics of Moving Bodies", author: "Albert Einstein", year: 1905, type: "Paper", blocked: true },
];

export function CorpusTable() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Source Registry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {SOURCES.map((s) => (
          <div
            key={s.title}
            className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1 pr-3">
              <p className="truncate text-[13px] font-medium">{s.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {s.author} · <span className="font-mono tabular-nums">{s.year}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] border-border/60">
                {s.type}
              </Badge>
              <Badge
                variant={s.blocked ? "destructive" : "secondary"}
                className="text-[10px]"
              >
                {s.blocked ? "Blocked" : "Planned"}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
