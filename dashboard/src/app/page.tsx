import { CheckCircle, Circle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCorpusStats } from "@/lib/corpus-db";

export default function OverviewPage() {
  const stats = getCorpusStats();

  const steps = [
    { label: "Corpus", desc: "Collect pre-1905 texts", done: stats.totalDocuments > 0, detail: `${stats.totalDocuments} docs, ${stats.totalTokens.toLocaleString()} tokens` },
    { label: "Tokenizer", desc: "Build BPE from corpus", done: false },
    { label: "Training", desc: "Train transformer from scratch", done: false },
    { label: "Evaluation", desc: "Test temporal boundary", done: false },
    { label: "Chat", desc: "Connect model for inference", done: false },
  ];

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Overview"
        description="Einstein AI — a model trained from scratch on pre-1905 data only."
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-5">
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.label} className="relative flex items-start gap-3">
                  <div className="absolute -left-5 mt-0.5">
                    {step.done ? (
                      <CheckCircle className="h-[18px] w-[18px] text-green-500 fill-green-500" />
                    ) : (
                      <Circle className="h-[18px] w-[18px] text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                    {step.done && step.detail && (
                      <p className="mt-0.5 text-xs tabular-nums text-green-600">{step.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
