import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCorpusStats } from "@/lib/corpus-db";

export function OverviewCards() {
  const stats = getCorpusStats();

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2 items-stretch">
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Corpus Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-2">
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
            <span className="text-sm">Documents</span>
            <span className="text-sm text-muted-foreground tabular-nums">{stats.totalDocuments}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
            <span className="text-sm">Tokens</span>
            <span className="text-sm text-muted-foreground tabular-nums">{stats.totalTokens.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
            <span className="text-sm">Earliest</span>
            <span className="text-sm text-muted-foreground tabular-nums">{stats.earliestYear ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
            <span className="text-sm">Latest</span>
            <span className="text-sm text-muted-foreground tabular-nums">{stats.latestYear ?? "-"}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Project State</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-4">
          <div className="rounded-md border border-border bg-muted px-4 py-3">
            <p className="text-sm font-medium text-foreground">What is real right now</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The corpus is live from your local SQLite database. Training,
              evaluation, and final model config are not connected yet.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This dashboard only shows real local corpus data right now. Other
            panels stay empty or disconnected until we wire them to real local
            processes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
