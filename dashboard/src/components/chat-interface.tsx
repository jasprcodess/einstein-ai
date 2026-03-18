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
  const scrollRef = useRef<HTMLDivElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "44px";
    const next = Math.min(Math.max(44, el.scrollHeight), 200);
    el.style.height = `${next}px`;
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
      textareaRef.current.style.height = "44px";
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <ChatMessages messages={messages} />
        ) : (
          <EmptyState onSuggestionClick={handleSend} />
        )}
      </div>

      <div className="px-3 pb-4 pt-3 sm:px-4">
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-xl border border-border bg-card">
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
                "w-full resize-none border-none bg-transparent px-4 pt-3 pb-3 pr-12 text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground",
                "min-h-[44px] max-h-[200px]"
              )}
              style={{ overflow: "hidden" }}
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className={cn(
                "absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150",
                input.trim()
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUpIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Enter to send · Shift+Enter for new line · Pre-1905 data only
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
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
          <Image src="/einsteinai.svg" alt="Einstein AI" width={28} height={28} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Einstein AI
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A language model trained from scratch on data published before
          April 30, 1905.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
