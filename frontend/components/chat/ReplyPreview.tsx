import type { Message } from "@/types/message";

export function ReplyPreview({ message }: { message: Message }) {
  return <div className="mb-2 border-l-2 border-scalar-orange pl-2 text-xs opacity-80">{message.sender.display_name}: {message.content}</div>;
}
