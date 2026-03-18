import { PageHeader } from "@/components/page-header";
import { OverviewCards } from "@/components/overview-cards";
import { BookOpen, Clock3, Timer } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { getCorpusStats } from "@/lib/corpus-db";

export default function OverviewPage() {
  const stats = getCorpusStats();

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Overview"
        description="Einstein AI control center. A model trained from scratch on pre-1905 data only."
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Temporal Boundary" value="1905" sub="April 30 cutoff" icon={Timer} accent />
        <StatCard label="Corpus Documents" value={String(stats.totalDocuments)} sub="Local verified texts" icon={BookOpen} />
        <StatCard label="Latest Source" value={String(stats.latestYear ?? "-")} sub="Most recent publication year" icon={Clock3} />
      </div>

      <OverviewCards />
    </div>
  );
}
