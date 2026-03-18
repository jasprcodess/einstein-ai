"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  thinking?: boolean;
}

const msgVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

function ThinkingShimmer() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="thinking-shimmer text-sm text-muted-foreground">Thinking</span>
      <span className="flex gap-0.5">
        <span className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          variants={msgVariants}
          initial="hidden"
          animate="visible"
          className="py-4"
        >
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              {msg.role === "assistant" ? (
                <Image src="/einsteinai.svg" alt="AI" width={16} height={16} />
              ) : (
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              {msg.thinking ? (
                <ThinkingShimmer />
              ) : (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
