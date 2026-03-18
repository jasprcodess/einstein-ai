import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCorpusStats, getCorpusAuthors, getCorpusYearBuckets } from "@/lib/corpus-db";

export default function OverviewPage() {
  const stats = getCorpusStats();
  const authors = getCorpusAuthors();
  const years = getCorpusYearBuckets();

  const steps = [
    { label: "Corpus", desc: "Collect pre-1905 texts", done: stats.totalDocuments > 0, detail: `${stats.totalDocuments} docs · ${stats.totalTokens.toLocaleString()} tokens` },
    { label: "Tokenizer", desc: "Build BPE from corpus", done: false, detail: null },
    { label: "Training", desc: "Train transformer from scratch", done: false, detail: null },
    { label: "Evaluation", desc: "Test temporal boundary", done: false, detail: null },
    { label: "Chat", desc: "Connect model for inference", done: false, detail: null },
  ];

  const completed = steps.filter((s) => s.done).length;
  const maxAuthorTokens = Math.max(...authors.map((a) => a.tokens), 1);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Overview"
        description="Einstein AI — a model trained from scratch on pre-1905 data only."
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Pipeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pipeline</CardTitle>
              <Badge variant="outline" className="text-xs tabular-nums">{completed} / {steps.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {steps.map((step) => (
              <div key={step.label} className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5">
                <div className={`h-2 w-2 shrink-0 rounded-full ${step.done ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {step.done && step.detail && (
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{step.detail}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top authors */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Top Authors</CardTitle>
              <Badge variant="outline" className="text-xs">{authors.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {authors.length > 0 ? authors.map((a) => (
              <div key={a.author} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm">{a.author}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{(a.tokens / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-1 rounded-full bg-muted">
                  <div className="h-1 rounded-full bg-primary" style={{ width: `${Math.max(4, (a.tokens / maxAuthorTokens) * 100)}%` }} />
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No corpus data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick stats row */}
      <div className="mt-4 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Cutoff" value="1905-04-30" />
        <MiniStat label="Documents" value={String(stats.totalDocuments)} />
        <MiniStat label="Tokens" value={stats.totalTokens.toLocaleString()} />
        <MiniStat label="Year Span" value={years.length > 0 ? `${stats.earliestYear} – ${stats.latestYear}` : "–"} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
