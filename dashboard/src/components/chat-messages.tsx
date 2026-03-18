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
    <div className="mx-auto max-w-2xl px-3 py-6 sm:px-4">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          variants={msgVariants}
          initial="hidden"
          animate="visible"
          className="rounded-lg px-3 py-4"
        >
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              {msg.role === "assistant" ? (
                <Image src="/einsteinai.svg" alt="AI" width={18} height={18} />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
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
  );
}
