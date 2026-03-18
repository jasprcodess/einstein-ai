import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CorpusPage() {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Corpus"
        description="All training data must be published on or before April 30, 1905."
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
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
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-border">
              <Database className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No sources yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Distribution chart will appear once sources are ingested.
              </p>
            </div>

            <div className="mt-4 rounded-md border border-border bg-secondary px-3 py-2">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Sources will be collected from Project Gutenberg, Internet Archive,
                Wikisource, and other public domain archives.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Source Registry</CardTitle>
              <Badge variant="secondary" className="text-[10px]">0 sources</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-border">
              <FileText className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Empty registry</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add pre-1905 books, papers, and lectures.
              </p>
            </div>

            <Button className="mt-4 w-full gap-2" variant="secondary" disabled>
              <Upload className="h-4 w-4" />
              Import Sources
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
