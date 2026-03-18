import { PageHeader } from "@/components/page-header";
import { OverviewCards } from "@/components/overview-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Cpu, ShieldCheck, Timer, BookOpen, Lock } from "lucide-react";
import { StatCard } from "@/components/stat-card";

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <PageHeader
        title="Overview"
        description="Einstein AI control center. A model trained from scratch on pre-1905 data only."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Temporal Boundary" value="1905" sub="April 30, 1905 cutoff" icon={Timer} accent />
        <StatCard label="Model Status" value="--" sub="Not yet trained" icon={Cpu} />
        <StatCard label="Evaluation" value="--" sub="Not yet run" icon={ShieldCheck} />
      </div>

      <OverviewCards />
    </div>
  );
}
