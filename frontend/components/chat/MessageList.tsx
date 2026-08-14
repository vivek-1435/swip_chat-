import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Loading } from "@/components/ui/Loading";
import type { Message } from "@/types/message";
import type { User } from "@/types/user";

export function MessageList({
  messages,
  me,
  loading,
  onReply,
  onUpdate
}: {
  messages: Message[];
  me: User | null;
  loading: boolean;
  onReply: (message: Message) => void;
  onUpdate: (message: Message) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: messages.length > 1 ? "smooth" : "instant" } as ScrollIntoViewOptions);
  }, [messages]);

  if (loading) return <Loading label="Loading messages..." />;
  if (!messages.length) return <div className="flex flex-1 items-center justify-center text-sm text-scalar-slate">Start a conversation</div>;
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-3 sm:px-4 py-5">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} mine={message.sender_id === me?.id} replyTo={messages.find((item) => item.id === message.reply_to_id)} onReply={onReply} onUpdate={onUpdate} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
