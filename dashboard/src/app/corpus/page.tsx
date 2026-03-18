import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HorizontalBars, TimelineChart } from "@/components/interactive-bar";
import {
  getCorpusAuthors,
  getCorpusSources,
  getCorpusStats,
  getCorpusYearBuckets,
} from "@/lib/corpus-db";

export default function CorpusPage() {
  const stats = getCorpusStats();
  const years = getCorpusYearBuckets();
  const authors = getCorpusAuthors();
  const sources = getCorpusSources();

  const authorItems = authors.map((a) => ({
    label: a.author,
    value: a.tokens,
    detail: `${(a.tokens / 1000).toFixed(0)}k · ${a.count} doc${a.count > 1 ? "s" : ""}`,
  }));

  const docItems = sources.map((s) => ({
    label: s.title,
    value: s.token_count,
    detail: `${(s.token_count / 1000).toFixed(0)}k tokens`,
  }));

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader title="Corpus" description="Live corpus data from your pre-1905 source database." />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Documents" value={String(stats.totalDocuments)} />
        <Stat label="Tokens" value={stats.totalTokens.toLocaleString()} />
        <Stat label="Authors" value={String(authors.length)} />
        <Stat label="Years" value={`${stats.earliestYear ?? "–"} – ${stats.latestYear ?? "–"}`} />
      </div>

      {/* Timeline */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Publication Timeline</CardTitle>
            <Badge variant="outline" className="text-xs tabular-nums">cutoff 1905</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {years.length > 0 ? (
            <TimelineChart bars={years} />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authors + Documents */}
      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Authors by Tokens</CardTitle>
              <Badge variant="outline" className="text-xs">{authors.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <HorizontalBars items={authorItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Documents by Size</CardTitle>
              <Badge variant="outline" className="text-xs">{sources.length} docs</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <HorizontalBars items={docItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
