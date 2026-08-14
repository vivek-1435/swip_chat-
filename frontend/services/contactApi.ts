import { api } from "./api";
import type { User } from "@/types/user";

export type Contact = { id: number; user_id: number; contact_user_id: number; saved_name?: string; created_at: string; contact_user: User };

export const searchUsers = (q: string) => api<User[]>(`/api/users/search?q=${encodeURIComponent(q)}`);
export const getContacts = () => api<Contact[]>("/api/contacts");
export const addContact = (contact_user_id: number, saved_name?: string) => api<Contact>("/api/contacts", { method: "POST", body: JSON.stringify({ contact_user_id, saved_name }) });
export const removeContact = (userId: number) => api<{ success: boolean }>(`/api/contacts/${userId}`, { method: "DELETE" });
