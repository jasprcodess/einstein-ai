import { PageHeader } from "@/components/page-header";
import { ChatInterface } from "@/components/chat-interface";

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col p-6 lg:p-8">
      <PageHeader
        title="Chat"
        description="Converse with Einstein AI. All responses grounded in pre-1905 sources only."
      />
      <ChatInterface />
    </div>
  );
}
