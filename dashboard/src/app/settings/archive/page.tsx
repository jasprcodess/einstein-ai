"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ArchivedRun {
  id: string;
  archivedAt: string | null;
  status: string;
  metrics: Record<string, unknown>;
  config: Record<string, unknown>;
  lossHistoryLength: number;
}

export default function ArchivePage() {
  const [runs, setRuns] = useState<ArchivedRun[]>([]);

  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch("/api/training/archive");
      const data = await res.json();
      setRuns(data.runs || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchRuns(); }, [fetchRuns]);

  async function handleDelete(runId: string) {
    if (!confirm("Delete this archived run permanently?")) return;
    await fetch("/api/training/archive", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId }),
    });
    fetchRuns();
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Link href="/settings" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" />
          Back to Settings
        </Link>
      </div>
      <PageHeader title="Training Archive" description={`${runs.length} archived training run${runs.length !== 1 ? "s" : ""}`} />

      {runs.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">No archived runs</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <ArchiveCard key={run.id} run={run} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveCard({ run, onDelete }: { run: ArchivedRun; onDelete: (id: string) => void }) {
  const m = run.metrics as Record<string, number | string>;
  const c = run.config as Record<string, number | string>;
  const date = run.archivedAt ? new Date(run.archivedAt).toLocaleString() : "Unknown";

  const configEntries = Object.entries(c).slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium font-mono">{run.id}</CardTitle>
            <Badge variant="outline" className="text-[10px]">{run.status}</Badge>
          </div>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onDelete(run.id)}>
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <Stat label="Archived" value={date} />
          {m.loss && <Stat label="Final Loss" value={String(m.loss)} />}
          {m.step && <Stat label="Steps" value={String(m.step)} />}
          {c.parameters && <Stat label="Params" value={String(c.parameters)} />}
        </div>
        {configEntries.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {configEntries.map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5">
                <span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span>
                <span className="font-mono tabular-nums">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-mono tabular-nums mt-0.5">{value}</p>
    </div>
  );
}
