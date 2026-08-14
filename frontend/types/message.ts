import type { User } from "./user";

export type MessageReceipt = {
  user_id: number;
  delivered_at?: string | null;
  read_at?: string | null;
};

export type MessageReaction = {
  user_id: number;
  emoji: string;
};

export type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  status: "sending" | "sent" | "delivered" | "read";
  reply_to_id?: number | null;
  created_at: string;
  updated_at: string;
  sender: User;
  receipts: MessageReceipt[];
  reactions: MessageReaction[];
};
