import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { OverviewCards } from "@/components/overview-cards";
import {
  Database,
  Cpu,
  ShieldCheck,
  BookOpen,
  Lock,
  Timer,
} from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Overview"
        description="Einstein AI control center — a model trained from scratch on pre-1905 data only."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Corpus Documents"
          value="0"
          sub="Pre-1905 verified sources"
          icon={Database}
        />
        <StatCard
          label="Model Status"
          value="Idle"
          sub="No training runs yet"
          icon={Cpu}
        />
        <StatCard
          label="Evaluation"
          value="--"
          sub="No evals run"
          icon={ShieldCheck}
        />
        <StatCard
          label="Temporal Boundary"
          value="1905"
          sub="April 30, 1905 cutoff"
          icon={Timer}
          accent
        />
        <StatCard
          label="Blocked Sources"
          value="0"
          sub="Post-1905 rejected"
          icon={Lock}
        />
        <StatCard
          label="Tokens Trained"
          value="0"
          sub="From-scratch training"
          icon={BookOpen}
        />
      </div>

      <OverviewCards />
    </div>
  );
}
