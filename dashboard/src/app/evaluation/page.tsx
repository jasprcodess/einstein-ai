import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookCheck, Clock, BrainCog, KeyRound, Search, ShieldAlert,
} from "lucide-react";

const gates = [
  { icon: BookCheck,    name: "Corpus Provenance",      desc: "Verify all training sources originate before 1905" },
  { icon: Clock,        name: "Temporal Boundary",       desc: "Zero post-1905 content present in training data" },
  { icon: BrainCog,     name: "Knowledge Isolation",     desc: "Model abstains when asked about post-1905 topics" },
  { icon: KeyRound,     name: "Canary Detection",        desc: "No embedded test strings leak into outputs" },
  { icon: Search,       name: "Leakage Scan",            desc: "No anachronistic terminology appears in responses" },
  { icon: ShieldAlert,  name: "Adversarial Robustness",  desc: "Temporal boundary holds under prompt injection" },
] as const;

export default function EvaluationPage() {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Evaluation"
        description="Six gates the model must pass before deployment. Results appear once the evaluation runner is connected."
      />
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Gates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {gates.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground/60">
                Waiting
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
