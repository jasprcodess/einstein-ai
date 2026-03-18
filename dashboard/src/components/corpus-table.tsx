"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PLANNED_SOURCES = [
  {
    title: "Treatise on Light",
    author: "Christiaan Huygens",
    year: 1690,
    type: "Book",
    status: "planned" as const,
  },
  {
    title: "A Dynamical Theory of the Electromagnetic Field",
    author: "James Clerk Maxwell",
    year: 1865,
    type: "Paper",
    status: "planned" as const,
  },
  {
    title: "On the Relative Motion of the Earth and the Luminiferous Ether",
    author: "Michelson & Morley",
    year: 1887,
    type: "Paper",
    status: "planned" as const,
  },
  {
    title: "Science and Hypothesis",
    author: "Henri Poincare",
    year: 1902,
    type: "Book",
    status: "planned" as const,
  },
  {
    title: "The Theory of Electrons",
    author: "H. A. Lorentz",
    year: 1904,
    type: "Lectures",
    status: "planned" as const,
  },
  {
    title: "On the Electrodynamics of Moving Bodies",
    author: "Albert Einstein",
    year: 1905,
    type: "Paper",
    status: "blocked" as const,
  },
];

export function CorpusTable() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Source Registry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {PLANNED_SOURCES.map((source) => (
            <div
              key={source.title}
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{source.title}</p>
                <p className="text-xs text-muted-foreground">
                  {source.author}, {source.year}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {source.type}
                </Badge>
                <Badge
                  variant={source.status === "blocked" ? "destructive" : "secondary"}
                  className="text-[10px]"
                >
                  {source.status === "blocked" ? "Blocked" : "Planned"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
