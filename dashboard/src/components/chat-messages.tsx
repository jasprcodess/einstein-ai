"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const msgVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="relative">
      {/* Top scroll fade */}
      <div className="pointer-events-none sticky top-0 z-10 h-6 bg-gradient-to-b from-background to-transparent" />

      <div className="mx-auto max-w-2xl space-y-1 px-3 sm:px-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            variants={msgVariants}
            initial="hidden"
            animate="visible"
            className="group rounded-lg px-3 py-4"
          >
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-white/[0.04]">
                {msg.role === "assistant" ? (
                  <Image src="/einsteinai.svg" alt="AI" width={16} height={16} />
                ) : (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {msg.role === "assistant" ? "Einstein AI" : "You"}
                </p>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom scroll fade */}
      <div className="pointer-events-none sticky bottom-0 z-10 h-6 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
