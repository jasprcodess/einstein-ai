import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CorpusPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <PageHeader
        title="Corpus"
        description="All training data must be published on or before April 30, 1905."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Source Distribution</CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono">
                Cutoff: 1905-04-30
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md bg-muted/40">
              <p className="text-xs text-muted-foreground">
                Distribution chart will appear once sources are ingested.
              </p>
            </div>

            <div className="mt-4 rounded-md border border-primary/15 bg-primary/5 px-3 py-2">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Start the corpus pipeline to collect verified pre-1905 texts
                from public domain archives.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Source Registry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-md bg-muted/40">
              <p className="text-xs text-muted-foreground">
                No sources ingested yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
