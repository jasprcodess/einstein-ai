import { PageHeader } from "@/components/page-header";
import { CorpusTable } from "@/components/corpus-table";
import { CorpusTimeline } from "@/components/corpus-timeline";
import { StatCard } from "@/components/stat-card";
import { Database, FileText, Lock, CheckCircle } from "lucide-react";

export default function CorpusPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 lg:p-8">
      <PageHeader
        title="Corpus"
        description="All training data must be published on or before April 30, 1905."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sources" value="0" icon={Database} />
        <StatCard label="Verified" value="0" icon={CheckCircle} />
        <StatCard label="Tokens" value="0" icon={FileText} />
        <StatCard label="Blocked" value="0" sub="Post-1905" icon={Lock} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <CorpusTimeline />
        <CorpusTable />
      </div>
    </div>
  );
}
