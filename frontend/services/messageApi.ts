import { api } from "./api";
import type { Message } from "@/types/message";

export const getMessages = (conversationId: number, beforeId?: number) =>
  api<Message[]>(`/api/conversations/${conversationId}/messages?limit=50${beforeId ? `&before_id=${beforeId}` : ""}`);
export const sendMessage = (conversationId: number, content: string, reply_to_id?: number | null) =>
  api<Message>(`/api/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ content, reply_to_id }) });
export const markRead = (messageId: number) => api<Message>(`/api/messages/${messageId}/read`, { method: "POST" });
export const reactToMessage = (messageId: number, emoji: string) => api<Message>(`/api/messages/${messageId}/reactions`, { method: "POST", body: JSON.stringify({ emoji }) });
