"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Lock,
  ShieldX,
  Fingerprint,
  Search,
  ShieldAlert,
} from "lucide-react";

const GATES = [
  { label: "Corpus Provenance", desc: "All sources verified pre-1905", icon: BookOpen },
  { label: "Temporal Boundary", desc: "Zero post-1905 content in training", icon: Lock },
  { label: "Blocked Source Test", desc: "Model abstains on post-1905 topics", icon: ShieldX },
  { label: "Canary Detection", desc: "No blocked canary strings in output", icon: Fingerprint },
  { label: "Leakage Scan", desc: "No post-1905 terminology detected", icon: Search },
  { label: "Adversarial Robustness", desc: "Boundary holds under injection", icon: ShieldAlert },
];

export function EvalGates() {
  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium">Release Readiness</p>
            <p className="text-[12px] text-muted-foreground">
              All evaluation gates must pass before certification
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Not Evaluated
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GATES.map((g) => (
          <Card key={g.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="rounded-md bg-muted/60 p-2">
                  <g.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Pending
                </Badge>
              </div>
              <p className="mt-3 text-[13px] font-medium">{g.label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{g.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
