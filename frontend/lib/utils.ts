import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatTime(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function conversationTitle(conversation: Conversation, me?: User | null, contacts?: Contact[]) {
  if (conversation.type === "group") return conversation.name ?? "Unnamed group";
  const other = conversation.members.find((member) => member.user_id !== me?.id)?.user;
  if (!other) return "Direct chat";
  const contact = contacts?.find(c => c.contact_user_id === other.id);
  return contact?.saved_name || other.display_name;
}

export function conversationAvatar(conversation: Conversation, me?: User | null) {
  if (conversation.type === "group") return conversation.avatar_url;
  return conversation.members.find((member) => member.user_id !== me?.id)?.user.avatar_url;
}
