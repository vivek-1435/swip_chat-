import { Avatar } from "@/components/ui/Avatar";
import { classNames, conversationAvatar, conversationTitle, formatTime } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function ConversationItem({ conversation, contacts, me, active, onClick }: { conversation: Conversation; contacts?: Contact[]; me: User | null; active?: boolean; onClick: () => void }) {
  const other = conversation.members.find((member) => member.user_id !== me?.id)?.user;
  const lastMsg = conversation.last_message;
  const isGroup = conversation.type === "group";
  const senderName = isGroup && lastMsg ? conversation.members.find(m => m.user_id === lastMsg.sender_id)?.user?.display_name : null;

  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-[#f0f2f5]",
        active ? "bg-[#f0f2f5]" : "hover:bg-[#f9f9f9]"
      )}
    >
      <Avatar
        src={conversationAvatar(conversation, me)}
        name={conversationTitle(conversation, me, contacts)}
        online={conversation.type === "direct" ? other?.is_online : undefined}
        size="md"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px] font-semibold text-scalar-ink">{conversationTitle(conversation, me, contacts)}</span>
          <span className={classNames("flex-shrink-0 text-[12px]", conversation.unread_count > 0 ? "text-scalar-green font-semibold" : "text-scalar-pewter")}>
            {formatTime(lastMsg?.created_at ?? conversation.updated_at)}
          </span>
        </span>
        <span className="flex items-center justify-between gap-2 mt-0.5">
          <span className="min-w-0 flex-1">
            {senderName && <span className="text-[13px] font-semibold text-scalar-slate">{senderName}: </span>}
            <span className="text-[13px] text-scalar-slate truncate">{lastMsg?.content ?? "Tap to start chatting"}</span>
          </span>
          {conversation.unread_count > 0 && (
            <span className="flex-shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-scalar-green px-1.5 text-[11px] font-bold text-white">
              {conversation.unread_count}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
