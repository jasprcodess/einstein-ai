"use client";

import { ChatInterface } from "@/components/chat-interface";
import { ChatHistory } from "@/components/chat-history";
import { useState, useCallback, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const chatKeyRef = useRef(0);

  const handleNewChat = useCallback(() => {
    chatKeyRef.current += 1;
    setActiveChat(null);
  }, []);

  const handleSelectChat = useCallback((chat: ChatSession) => {
    chatKeyRef.current += 1;
    setActiveChat(chat);
  }, []);

  const handleChatSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex h-full">
      <ChatHistory
        refreshKey={refreshKey}
        activeChatId={activeChat?.id ?? null}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
      />
      <div className="flex-1 min-w-0">
        <ChatInterface
          key={chatKeyRef.current}
          initialChat={activeChat}
          onSaved={handleChatSaved}
        />
      </div>
    </div>
  );
}
