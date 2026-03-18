"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  BookOpen,
  Lock,
  Search,
  Fingerprint,
} from "lucide-react";

const GATES = [
  {
    label: "Corpus Provenance",
    description: "All sources verified pre-1905 with dual attestation",
    status: "pending" as const,
    icon: BookOpen,
  },
  {
    label: "Temporal Boundary",
    description: "Zero post-1905 content in training data",
    status: "pending" as const,
    icon: Lock,
  },
  {
    label: "Blocked Source Test",
    description: "Model abstains on post-1905 topics",
    status: "pending" as const,
    icon: ShieldX,
  },
  {
    label: "Canary Detection",
    description: "No blocked canary strings found in outputs",
    status: "pending" as const,
    icon: Fingerprint,
  },
  {
    label: "Leakage Scan",
    description: "No post-1905 terminology in generation",
    status: "pending" as const,
    icon: Search,
  },
  {
    label: "Adversarial Robustness",
    description: "Boundary holds under prompt injection attempts",
    status: "pending" as const,
    icon: ShieldAlert,
  },
];

const STATUS_MAP = {
  passed: { badge: "Passed", variant: "default" as const, icon: ShieldCheck },
  failed: { badge: "Failed", variant: "destructive" as const, icon: ShieldX },
  pending: { badge: "Pending", variant: "secondary" as const, icon: ShieldAlert },
};

export function EvalGates() {
  const allPending = GATES.every((g) => g.status === "pending");

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium">Release Readiness</p>
            <p className="text-xs text-muted-foreground">
              All evaluation gates must pass before model is certified
            </p>
          </div>
          <Badge
            variant={allPending ? "secondary" : "destructive"}
            className="text-xs"
          >
            {allPending ? "Not Evaluated" : "Blocked"}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GATES.map((gate) => {
          const cfg = STATUS_MAP[gate.status];
          return (
            <Card key={gate.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-md bg-muted p-2">
                    <gate.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Badge variant={cfg.variant} className="text-[10px]">
                    {cfg.badge}
                  </Badge>
                </div>
                <p className="mt-3 text-sm font-medium">{gate.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {gate.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
