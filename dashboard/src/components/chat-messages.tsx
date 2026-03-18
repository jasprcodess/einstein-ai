"use client";

import { Atom, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {messages.map((msg, i) => (
        <div key={i} className="flex gap-3">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              msg.role === "assistant"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {msg.role === "assistant" ? (
              <Atom className="h-3.5 w-3.5" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              {msg.role === "assistant" ? "Einstein AI" : "You"}
            </p>
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
