import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const maxAuthorTokens = Math.max(...authors.map((a) => a.tokens), 1);
  const maxSourceTokens = Math.max(...sources.map((s) => s.token_count), 1);

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

      {/* Timeline - full width, vertical bars going UP */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Publication Timeline</CardTitle>
            <Badge variant="outline" className="text-xs tabular-nums">cutoff 1905</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {years.length > 0 ? (
            <div className="space-y-3">
              {years.map((y) => (
                <div key={y.year} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-sm tabular-nums text-muted-foreground">{y.year}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-5 rounded bg-primary" style={{ width: `${Math.max(24, (y.count / Math.max(...years.map((b) => b.count), 1)) * 100)}%` }} />
                    <span className="text-sm tabular-nums text-muted-foreground">{y.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authors + Token distribution */}
      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Authors by Tokens</CardTitle>
              <Badge variant="outline" className="text-xs">{authors.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {authors.map((a) => (
              <div key={a.author} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm">{a.author}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{(a.tokens / 1000).toFixed(0)}k · {a.count} doc{a.count > 1 ? "s" : ""}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.max(4, (a.tokens / maxAuthorTokens) * 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Documents by Size</CardTitle>
              <Badge variant="outline" className="text-xs">{sources.length} docs</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.map((s) => (
              <div key={s.id} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm">{s.title}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{(s.token_count / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.max(4, (s.token_count / maxSourceTokens) * 100)}%` }} />
                </div>
              </div>
            ))}
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
