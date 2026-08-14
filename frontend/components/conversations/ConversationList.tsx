import { ConversationItem } from "./ConversationItem";
import { Loading } from "@/components/ui/Loading";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function ConversationList({ conversations, contacts, me, activeId, loading, onSelect }: { conversations: Conversation[]; contacts?: Contact[]; me: User | null; activeId?: number; loading: boolean; onSelect: (id: number) => void }) {
  if (loading) return <Loading label="Loading conversations..." />;
  if (!conversations.length) return <div className="p-4 text-sm text-scalar-slate">No conversations yet</div>;
  return (
    <div className="grid gap-1 p-2">
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} contacts={contacts} me={me} active={activeId === conversation.id} onClick={() => onSelect(conversation.id)} />
      ))}
    </div>
  );
}
