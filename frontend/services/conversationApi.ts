import { api } from "./api";
import type { Conversation } from "@/types/conversation";

export const getConversations = (q?: string) => api<Conversation[]>(`/api/conversations${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const openDirectConversation = (user_id: number) => api<Conversation>("/api/conversations/direct", { method: "POST", body: JSON.stringify({ user_id }) });
export const createGroup = (payload: { name: string; avatar_url?: string; member_ids: number[] }) => api<Conversation>("/api/groups", { method: "POST", body: JSON.stringify(payload) });
export const addGroupMember = (groupId: number, user_id: number) => api<Conversation>(`/api/groups/${groupId}/members`, { method: "POST", body: JSON.stringify({ user_id }) });
export const removeGroupMember = (groupId: number, userId: number) => api<Conversation>(`/api/groups/${groupId}/members/${userId}`, { method: "DELETE" });
export const updateGroupMemberRole = (groupId: number, userId: number, role: string) => api<Conversation>(`/api/groups/${groupId}/members/${userId}`, { method: "PATCH", body: JSON.stringify({ role }) });
export const deleteGroup = (groupId: number) => api(`/api/groups/${groupId}`, { method: "DELETE" });
