"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessages({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="group py-4"
        >
          {msg.role === "assistant" ? (
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted border border-border shadow-sm">
                <Image src="/einsteinai.svg" alt="AI" width={16} height={16} className="opacity-90" />
              </div>
              <div className="min-w-0 flex-1 mt-0.5">
                <p className="text-sm leading-relaxed text-foreground">{msg.content}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5 text-[15px] leading-relaxed text-foreground shadow-sm">
                {msg.content}
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-4"
        >
          <div className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted border border-border shadow-sm">
              <Image src="/einsteinai.svg" alt="AI" width={16} height={16} className="opacity-90" />
            </div>
            <div className="min-w-0 flex-1 mt-1.5 flex items-center">
              <span className="thinking-shimmer text-sm font-medium tracking-wide">Thinking</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
