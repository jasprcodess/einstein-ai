"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, FlaskConical, User, Lock } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const modelReady = false;

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        role: "assistant",
        content:
          "Model not yet trained. Train the model first, then return here to chat.",
      },
    ]);
    setInput("");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1.5 text-xs">
          <Lock className="h-3 w-3" />
          Pre-1905 only
        </Badge>
        <Badge
          variant={modelReady ? "default" : "secondary"}
          className="text-xs"
        >
          {modelReady ? "Model Online" : "Model Offline"}
        </Badge>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pre-1905 physics..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-xl bg-primary/10 p-4">
        <FlaskConical className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold">Einstein AI</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          A language model trained from scratch on data published before April
          30, 1905. Ask about classical mechanics, electrodynamics, optics,
          thermodynamics, or the ether.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {[
          "What is the luminiferous ether?",
          "Explain Maxwell's equations",
          "Mercury's orbital anomaly",
        ].map((q) => (
          <button
            key={q}
            className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FlaskConical className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <User className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}
