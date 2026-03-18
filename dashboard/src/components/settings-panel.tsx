"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ArchivedRun {
  id: string;
  archivedAt: string | null;
  status: string;
  metrics: Record<string, unknown>;
  config: Record<string, unknown>;
  lossHistoryLength: number;
}

interface CorpusInfo {
  totalDocuments: number;
  totalTokens: number;
}

export function SettingsPanel() {
  const [runs, setRuns] = useState<ArchivedRun[]>([]);
  const [corpus, setCorpus] = useState<CorpusInfo | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch("/api/training/archive");
      setRuns((await res.json()).runs || []);
    } catch { /* */ }
  }, []);

  const fetchCorpus = useCallback(async () => {
    try {
      const res = await fetch("/api/corpus");
      const d = await res.json();
      setCorpus({ totalDocuments: d.stats?.totalDocuments ?? 0, totalTokens: d.stats?.totalTokens ?? 0 });
    } catch { /* */ }
  }, []);

  useEffect(() => { fetchRuns(); fetchCorpus(); }, [fetchRuns, fetchCorpus]);

  async function handleDeleteRun(runId: string) {
    if (!confirm("Delete this archived run permanently?")) return;
    await fetch("/api/training/archive", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ runId }) });
    fetchRuns();
  }

  async function clearChatHistory() {
    if (!confirm("Delete all saved conversations? This cannot be undone.")) return;
    setMsg(null);
    try {
      const res = await fetch("/api/chat/history");
      const data = await res.json();
      for (const c of data.chats || []) {
        await fetch("/api/chat/history", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id }) });
      }
      setMsg("Chat history cleared");
    } catch { setMsg("Failed"); }
  }

  async function clearTrainingState() {
    setMsg(null);
    try {
      // Just hit start with fresh=true then immediately stop — or delete state file via a dedicated route
      // Simpler: call archive if there's state, which wipes it
      const res = await fetch("/api/training/status");
      const data = await res.json();
      if (data.status === "done" || data.status === "stopped") {
        await fetch("/api/training/archive", { method: "POST" });
        fetchRuns();
        setMsg("Training state archived and cleared");
      } else if (data.status === "idle") {
        setMsg("No training state to clear");
      } else {
        setMsg("Cannot clear while training is running");
      }
    } catch { setMsg("Failed"); }
  }

  const preview = runs.slice(0, 2);

  return (
    <div className="space-y-4">
      {msg && <p className="text-xs text-muted-foreground px-1">{msg}</p>}

      {/* Training archive */}
      <ArchiveCard runs={runs} preview={preview} onDelete={handleDeleteRun} />

      {/* Danger zone */}
      <DangerCard onClearChats={clearChatHistory} onClearTraining={clearTrainingState} />

      {/* Project info */}
      <InfoCard corpus={corpus} />
    </div>
  );
}

function ArchiveCard({ runs, preview, onDelete }: { runs: ArchivedRun[]; preview: ArchivedRun[]; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Training Archive</CardTitle>
          {runs.length > 0 && <Badge variant="outline" className="text-xs tabular-nums">{runs.length}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {preview.length === 0 ? (
          <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-xs text-muted-foreground">No archived runs</p>
          </div>
        ) : (
          <div className="space-y-2">
            {preview.map((run) => {
              const m = run.metrics as Record<string, number | string>;
              const c = run.config as Record<string, number | string>;
              const date = run.archivedAt ? new Date(run.archivedAt).toLocaleDateString() : "?";
              return (
                <div key={run.id} className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{run.status}</Badge>
                      <span className="text-[11px] text-muted-foreground">{date}</span>
                      {c.parameters && <span className="text-[11px] text-muted-foreground">{String(c.parameters)}</span>}
                      {m.loss && <span className="text-[11px] text-muted-foreground tabular-nums">loss {String(m.loss)}</span>}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0" onClick={() => onDelete(run.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        {runs.length > 2 && (
          <Link href="/settings/archive" className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
            View all {runs.length} runs <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function DangerCard({ onClearChats, onClearTraining }: { onClearChats: () => void; onClearTraining: () => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
          <div>
            <p className="text-sm">Clear chat history</p>
            <p className="text-xs text-muted-foreground">Delete all saved conversations</p>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={onClearChats}>Clear</Button>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
          <div>
            <p className="text-sm">Archive & reset training</p>
            <p className="text-xs text-muted-foreground">Archive current run, wipe state + checkpoints</p>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={onClearTraining}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCard({ corpus }: { corpus: CorpusInfo | null }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Project Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border text-sm">
          {[
            ["Cutoff Date", "April 30, 1905"],
            ["Documents", corpus ? String(corpus.totalDocuments) : "—"],
            ["Tokens", corpus ? corpus.totalTokens.toLocaleString() : "—"],
            ["Corpus DB", "../corpus/corpus.db"],
            ["Checkpoints", "../corpus/checkpoints/"],
            ["GPU", "Auto-detected at training time"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-mono text-xs">{v}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
