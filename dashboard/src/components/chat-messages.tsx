"use client";

import Image from "next/image";
import { User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="mx-auto max-w-2xl space-y-1 px-3 py-6 sm:px-4">
      {messages.map((msg, i) => (
        <div key={i} className="group rounded-lg px-3 py-4">
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
              {msg.role === "assistant" ? (
                <Image src="/einsteinai.svg" alt="AI" width={16} height={16} />
              ) : (
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">
                {msg.role === "assistant" ? "Einstein AI" : "You"}
              </p>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
