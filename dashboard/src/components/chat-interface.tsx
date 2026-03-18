"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, Lock, Atom } from "lucide-react";
import { ChatMessages } from "@/components/chat-messages";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What is the luminiferous ether?",
  "Explain Maxwell's equations",
  "Describe the Michelson-Morley experiment",
  "What are Newton's laws of motion?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelReady = false;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "52px";
    const next = Math.min(Math.max(52, el.scrollHeight), 200);
    el.style.height = `${next}px`;
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      {
        role: "assistant",
        content:
          "The model has not been trained yet. Build the corpus, train the tokenizer, and run training first.",
      },
    ]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <ChatMessages messages={messages} />
        ) : (
          <EmptyState onSuggestionClick={handleSend} />
        )}
      </div>

      <div className="border-t border-border bg-background px-4 pb-4 pt-3">
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-border bg-card">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about pre-1905 physics..."
              className={cn(
                "w-full resize-none border-none bg-transparent px-4 pt-3.5 pb-12 text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/60",
                "min-h-[52px] max-h-[200px]"
              )}
              style={{ overflow: "hidden" }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 text-[10px] border-border/60 text-muted-foreground">
                  <Lock className="h-2.5 w-2.5" />
                  Pre-1905
                </Badge>
                <Badge
                  variant={modelReady ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {modelReady ? "Online" : "Offline"}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => handleSend()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
                  input.trim()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <Atom className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Einstein AI
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A language model trained from scratch on data published before
          April 30, 1905. Ask about classical mechanics, electrodynamics,
          optics, thermodynamics, or the ether.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:border-primary/30 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
