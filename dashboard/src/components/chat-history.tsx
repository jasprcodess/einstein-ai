"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface ChatSummary {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export function ChatHistory({
  refreshKey,
  activeChatId,
  onSelect,
  onNew,
}: {
  refreshKey: number;
  activeChatId: string | null;
  onSelect: (chat: ChatSession) => void;
  onNew: () => void;
}) {
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/history");
      const data = await res.json();
      setChats(data.chats || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchChats(); }, [fetchChats, refreshKey]);

  async function handleSelect(id: string) {
    try {
      const res = await fetch(`/api/chat/history/load?id=${id}`);
      if (!res.ok) return;
      const data = await res.json();
      onSelect({ id, title: data.title || "Untitled", messages: data.messages || [] });
    } catch { /* ignore */ }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch("/api/chat/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchChats();
    if (activeChatId === id) onNew();
  }

  return (
    <div className="hidden sm:flex w-[180px] shrink-0 border-r border-border flex-col h-full">
      <div className="p-2 border-b border-border">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {chats.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/40 text-center py-8">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelect(chat.id)}
              className={cn(
                "w-full text-left rounded-md px-2.5 py-1.5 text-[12px] transition-colors group flex items-center gap-1",
                activeChatId === chat.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="flex-1 truncate">{chat.title}</span>
              <Trash2
                className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
                onClick={(e) => handleDelete(chat.id, e)}
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
