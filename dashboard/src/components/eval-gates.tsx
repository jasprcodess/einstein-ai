"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BookOpen, Lock, ShieldX, Fingerprint, Search, ShieldAlert } from "lucide-react";

const GATES = [
  { label: "Corpus Provenance", desc: "All sources verified pre-1905", icon: BookOpen },
  { label: "Temporal Boundary", desc: "Zero post-1905 content in training", icon: Lock },
  { label: "Blocked Source Test", desc: "Model abstains on post-1905 topics", icon: ShieldX },
  { label: "Canary Detection", desc: "No blocked canary strings in output", icon: Fingerprint },
  { label: "Leakage Scan", desc: "No post-1905 terminology detected", icon: Search },
  { label: "Adversarial Robustness", desc: "Boundary holds under injection", icon: ShieldAlert },
];

function PulsingDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground opacity-40" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground" />
    </span>
  );
}

export function EvalGates() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Release Readiness</p>
              <p className="text-sm text-muted-foreground">
                All evaluation gates must pass before certification
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5 text-xs">
            <PulsingDot />
            Not Evaluated
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {GATES.map((g) => (
          <Card key={g.label} className="transition-all duration-200 ease-out hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-muted p-2">
                  <g.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Badge variant="secondary" className="gap-1.5 text-xs">
                  <PulsingDot />
                  Pending
                </Badge>
              </div>
              <p className="mt-3 text-sm font-medium">{g.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
