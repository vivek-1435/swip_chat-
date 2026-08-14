import { Avatar } from "@/components/ui/Avatar";
import { classNames, conversationAvatar, conversationTitle, formatTime } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function ConversationItem({ conversation, contacts, me, active, onClick }: { conversation: Conversation; contacts?: Contact[]; me: User | null; active?: boolean; onClick: () => void }) {
  const other = conversation.members.find((member) => member.user_id !== me?.id)?.user;
  return (
    <button
      onClick={onClick}
      className={classNames("focus-ring grid w-full grid-cols-[auto_1fr_auto] gap-3 rounded-lg border border-transparent p-3 text-left transition hover:border-scalar-line hover:bg-[#fbfbfa] hover:shadow-[0_8px_18px_rgba(27,27,27,0.05)]", active && "border-scalar-line bg-white shadow-[0_10px_22px_rgba(27,27,27,0.07)]")}
    >
      <Avatar src={conversationAvatar(conversation, me)} name={conversationTitle(conversation, me, contacts)} online={conversation.type === "direct" ? other?.is_online : undefined} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-scalar-ink">{conversationTitle(conversation, me, contacts)}</span>
        <span className="block truncate text-xs text-scalar-slate">{conversation.last_message?.content ?? "Start a conversation"}</span>
      </span>
      <span className="flex flex-col items-end gap-1">
        <span className="text-[11px] text-scalar-pewter">{formatTime(conversation.last_message?.created_at ?? conversation.updated_at)}</span>
        {conversation.unread_count > 0 && <span className="rounded-full bg-scalar-green px-2 py-0.5 text-[11px] font-bold text-white shadow-[0_8px_16px_rgba(6,144,97,0.22)]">{conversation.unread_count}</span>}
      </span>
    </button>
  );
}
