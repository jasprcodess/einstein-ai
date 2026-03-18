"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessages({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="py-3"
        >
          {msg.role === "assistant" ? (
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                <Image src="/einsteinai.svg" alt="AI" width={14} height={14} />
              </div>
              <p className="text-sm leading-relaxed pt-0.5">{msg.content}</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">{msg.content}</p>
          )}
        </motion.div>
      ))}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-3"
        >
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
              <Image src="/einsteinai.svg" alt="AI" width={14} height={14} />
            </div>
            <span className="thinking-shimmer text-sm pt-0.5">Thinking</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
