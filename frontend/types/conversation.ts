import type { Message } from "./message";
import type { User } from "./user";

export type ConversationMember = {
  user_id: number;
  role: "admin" | "member";
  joined_at: string;
  left_at?: string | null;
  user: User;
};

export type Conversation = {
  id: number;
  type: "direct" | "group";
  name?: string | null;
  avatar_url?: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  members: ConversationMember[];
  last_message?: Message | null;
  unread_count: number;
};
