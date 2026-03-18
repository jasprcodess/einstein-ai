"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { ChatMessages } from "@/components/chat-messages";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

function generateId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatInterface({
  initialChat,
  onSaved,
}: {
  initialChat?: ChatSession | null;
  onSaved?: () => void;
}) {
  const [chatId] = useState(() => initialChat?.id ?? generateId());
  const [messages, setMessages] = useState<Message[]>(initialChat?.messages ?? []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "48px";
    el.style.height = `${Math.min(Math.max(48, el.scrollHeight), 200)}px`;
  }, []);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Save chat to history whenever messages change
  const saveChat = useCallback(async (msgs: Message[]) => {
    if (msgs.length === 0) return;
    const firstUserMsg = msgs.find((m) => m.role === "user");
    const title = firstUserMsg?.content.slice(0, 50) || "Untitled";
    await fetch("/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: chatId, title, messages: msgs }),
    });
    onSaved?.();
  }, [chatId, onSaved]);

  async function handleSend() {
    const msg = input.trim();
    if (!msg || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: msg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "48px";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: msg, messages }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        // Show error but don't save it to history
        setMessages([...newMessages, { role: "assistant" as const, content: `Error: ${data.error || "Request failed"}` }]);
      } else {
        const withReply = [
          ...newMessages,
          { role: "assistant" as const, content: data.text ?? "No response." },
        ];
        setMessages(withReply);
        saveChat(withReply);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant" as const, content: "Error: Failed to reach inference backend." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length > 0 || isLoading ? (
          <ChatMessages messages={messages} isLoading={isLoading} />
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="px-4 pb-5 pt-3">
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-xl border border-border bg-card shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-primary/20">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); adjustHeight(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about pre-1905 science..."
              disabled={isLoading}
              className={cn(
                "w-full resize-none border-none bg-transparent px-4 pt-3.5 pb-3.5 pr-12 text-sm rounded-xl",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground",
                "min-h-[48px] max-h-[200px]",
                isLoading && "opacity-50"
              )}
              style={{ overflow: "hidden", lineHeight: 1.6 }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className={cn(
                "absolute right-2 bottom-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-md transition-all duration-150",
                input.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-sm ring-1 ring-white/[0.03]">
          <Image src="/einsteinai.svg" alt="Einstein AI" width={28} height={28} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Einstein AI</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A language model trained from scratch on data published before April 30, 1905.
        </p>
      </div>
    </div>
  );
}
