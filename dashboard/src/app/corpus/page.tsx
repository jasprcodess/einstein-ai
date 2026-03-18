import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getCorpusAuthors,
  getCorpusStats,
  getCorpusYearBuckets,
} from "@/lib/corpus-db";

export default function CorpusPage() {
  const stats = getCorpusStats();
  const years = getCorpusYearBuckets();
  const authors = getCorpusAuthors();
  const maxTokens = Math.max(...authors.map((a) => a.tokens), 1);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Corpus"
        description="Live local corpus data from your pre-1905 source database."
      />

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Documents" value={String(stats.totalDocuments)} />
        <Stat label="Tokens" value={stats.totalTokens.toLocaleString()} />
        <Stat label="Authors" value={String(authors.length)} />
        <Stat label="Year Range" value={`${stats.earliestYear ?? "-"} - ${stats.latestYear ?? "-"}`} />
      </div>

      {/* Charts row - equal 50/50 grid */}
      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Badge variant="outline" className="text-xs">
                {years.length} years
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {years.length > 0 ? (
              <div className="space-y-2">
                {years.map((bucket) => (
                  <div key={bucket.year} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-sm tabular-nums text-muted-foreground">{bucket.year}</span>
                    <div className="flex-1 h-6 rounded bg-muted overflow-hidden">
                      <div
                        className="h-full rounded bg-primary transition-all"
                        style={{ width: `${Math.max(8, (bucket.count / Math.max(...years.map((y) => y.count), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-sm tabular-nums text-right">{bucket.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Authors by Token Count</CardTitle>
              <Badge variant="outline" className="text-xs">
                {authors.length} authors
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {authors.length > 0 ? (
              <div className="space-y-2">
                {authors.map((author) => (
                  <div key={author.author} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-sm text-muted-foreground">{author.author}</span>
                    <div className="flex-1 h-6 rounded bg-muted overflow-hidden">
                      <div
                        className="h-full rounded bg-primary transition-all"
                        style={{ width: `${Math.max(8, (author.tokens / maxTokens) * 100)}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-sm tabular-nums text-right text-muted-foreground">
                      {(author.tokens / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            )}
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
