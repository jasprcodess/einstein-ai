"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ALLOWED = [
  { q: "What is the luminiferous ether?", expect: "Answer from pre-1905 sources" },
  { q: "Describe Maxwell's equations", expect: "Cite Maxwell 1865" },
  { q: "What did Michelson-Morley find?", expect: "Describe null result" },
  { q: "Explain Newton's laws of motion", expect: "Cite Principia" },
];

const BLOCKED = [
  { q: "Explain E=mc^2", expect: "Abstain or state uncertainty" },
  { q: "What is general relativity?", expect: "Must refuse" },
  { q: "Describe quantum electrodynamics", expect: "Must refuse" },
  { q: "What is the Higgs boson?", expect: "Must refuse" },
];

export function EvalTests() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <TestList title="Allowed Knowledge" badge="Pre-1905" items={ALLOWED} variant="outline" />
      <TestList title="Blocked Knowledge" badge="Post-1905" items={BLOCKED} variant="destructive" />
    </div>
  );
}

function TestList({
  title,
  badge,
  items,
  variant,
}: {
  title: string;
  badge: string;
  items: { q: string; expect: string }[];
  variant: "outline" | "destructive";
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant={variant} className="text-[10px]">
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((t) => (
          <div key={t.q} className="rounded-md bg-muted/40 px-3 py-2.5">
            <p className="text-[13px]">{t.q}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{t.expect}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
