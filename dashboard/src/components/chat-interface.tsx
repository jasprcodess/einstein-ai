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
  thinking?: boolean;
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
    el.style.height = "48px";
    el.style.height = `${Math.min(Math.max(48, el.scrollHeight), 200)}px`;
  }, []);

  useEffect(() => { textareaRef.current?.focus(); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "48px";

    // Show thinking state
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "", thinking: true }]);
    }, 200);

    // Replace with response after delay
    setTimeout(() => {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "The model has not been trained yet. Build the corpus, train the tokenizer, and run training first.",
        };
        return copy;
      });
    }, 2200);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <ChatMessages messages={messages} />
        ) : (
          <EmptyState onSuggestionClick={handleSend} />
        )}
      </div>

      <div className="px-4 pb-5 pt-3">
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-xl border border-border bg-card">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); adjustHeight(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about pre-1905 physics..."
              className={cn(
                "w-full resize-none border-none bg-transparent px-4 pt-3.5 pb-3.5 pr-14 text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground",
                "min-h-[48px] max-h-[200px]"
              )}
              style={{ overflow: "hidden" }}
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className={cn(
                "absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
                input.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
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
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted">
          <Image src="/einsteinai.svg" alt="Einstein AI" width={32} height={32} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Einstein AI</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A language model trained from scratch on data published before April 30, 1905.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
