import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, FileText } from "lucide-react";

export default function CorpusPage() {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Corpus"
        description="All training data must be published on or before April 30, 1905."
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 items-stretch">
        <Card className="flex h-full flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Source Distribution</CardTitle>
              <Badge variant="outline" className="text-xs font-mono">
                Cutoff: 1905-04-30
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <div className="flex h-36 flex-col items-center justify-center rounded-md border border-dashed border-border">
              <Database className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No sources yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Agents will collect sources automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Source Registry</CardTitle>
              <Badge variant="secondary" className="text-xs">0 sources</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <div className="flex h-36 flex-col items-center justify-center rounded-md border border-dashed border-border">
              <FileText className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Empty registry</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pre-1905 books, papers, and lectures.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
