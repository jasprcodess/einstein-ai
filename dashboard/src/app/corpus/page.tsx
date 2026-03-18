import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Hash, Users, Calendar } from "lucide-react";
import {
  getCorpusAuthors,
  getCorpusSources,
  getCorpusStats,
  getCorpusYearBuckets,
} from "@/lib/corpus-db";

const icons = [FileText, Hash, Users, Calendar] as const;

export default function CorpusPage() {
  const stats = getCorpusStats();
  const years = getCorpusYearBuckets();
  const authors = getCorpusAuthors();
  const sources = getCorpusSources();
  const maxAuthorTokens = Math.max(...authors.map((a) => a.tokens), 1);
  const maxSourceTokens = Math.max(...sources.map((s) => s.token_count), 1);
  const minYear = stats.earliestYear ?? 0;
  const maxYear = stats.latestYear ?? 0;
  const span = maxYear - minYear || 1;

  const statCards = [
    { label: "Documents", value: String(stats.totalDocuments) },
    { label: "Total Tokens", value: stats.totalTokens.toLocaleString() },
    { label: "Authors", value: String(authors.length) },
    { label: "Year Range", value: `${minYear || "–"} – ${maxYear || "–"}` },
  ];

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader title="Corpus" description="Live corpus data from your pre-1905 source database." />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const Icon = icons[i];
          return (
            <Card key={s.label} style={{ background: "#202020", borderColor: "#353535" }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <Icon size={14} style={{ color: "#808080" }} />
                  <p className="text-xs" style={{ color: "#808080" }}>{s.label}</p>
                </div>
                <p className="mt-1 text-2xl font-semibold tabular-nums" style={{ color: "#d9d9d9" }}>{s.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6" style={{ background: "#202020", borderColor: "#353535" }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium" style={{ color: "#d9d9d9" }}>Publication Timeline</CardTitle>
            <Badge variant="outline" className="text-xs" style={{ borderColor: "#353535", color: "#808080" }}>
              {years.length} years
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {years.length > 0 ? (
            <div className="relative py-6 px-2">
              <div className="absolute left-2 right-2 top-1/2 h-px" style={{ background: "#353535" }} />
              <div className="relative flex justify-between items-center" style={{ height: 24 }}>
                {years.map((y) => {
                  const pct = ((y.year - minYear) / span) * 100;
                  return (
                    <div key={y.year} className="absolute flex flex-col items-center" style={{ left: `${pct}%` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#a0a0a0" }} />
                      <span className="mt-3 text-xs tabular-nums whitespace-nowrap" style={{ color: "#808080" }}>
                        {y.year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed" style={{ borderColor: "#353535" }}>
              <p className="text-sm" style={{ color: "#808080" }}>No data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card style={{ background: "#202020", borderColor: "#353535" }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium" style={{ color: "#d9d9d9" }}>Authors</CardTitle>
              <Badge variant="outline" className="text-xs" style={{ borderColor: "#353535", color: "#808080" }}>{authors.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {authors.map((a) => (
              <div key={a.author} className="flex items-center gap-3">
                <span className="truncate text-sm shrink-0 w-28" style={{ color: "#d9d9d9" }}>{a.author}</span>
                <div className="flex-1 rounded-full" style={{ background: "#2a2a2a", height: 2 }}>
                  <div className="rounded-full" style={{ height: 2, background: "#a0a0a0", width: `${Math.max(4, (a.tokens / maxAuthorTokens) * 100)}%` }} />
                </div>
                <span className="shrink-0 text-xs tabular-nums" style={{ color: "#808080" }}>{(a.tokens / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card style={{ background: "#202020", borderColor: "#353535" }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium" style={{ color: "#d9d9d9" }}>Token Distribution</CardTitle>
              <Badge variant="outline" className="text-xs" style={{ borderColor: "#353535", color: "#808080" }}>{sources.length} docs</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="truncate text-sm shrink-0 w-28" style={{ color: "#d9d9d9" }}>{s.title}</span>
                <div className="flex-1 rounded-full" style={{ background: "#2a2a2a", height: 2 }}>
                  <div className="rounded-full" style={{ height: 2, background: "#a0a0a0", width: `${Math.max(4, (s.token_count / maxSourceTokens) * 100)}%` }} />
                </div>
                <span className="shrink-0 text-xs tabular-nums" style={{ color: "#808080" }}>{(s.token_count / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
