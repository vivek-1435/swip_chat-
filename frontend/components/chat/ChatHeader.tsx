import { Info, Phone, Video } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { conversationAvatar, conversationTitle } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function ChatHeader({ conversation, me, contacts, onInfo }: { conversation: Conversation; me: User | null; contacts?: Contact[]; onInfo: () => void }) {
  const other = conversation.members.find((member) => member.user_id !== me?.id)?.user;
  return (
    <header className="flex h-16 items-center justify-between border-b border-scalar-line bg-white/95 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar src={conversationAvatar(conversation, me)} name={conversationTitle(conversation, me, contacts)} online={conversation.type === "direct" ? other?.is_online : undefined} />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-scalar-ink">{conversationTitle(conversation, me, contacts)}</h1>
          <p className="truncate text-xs text-scalar-slate">{conversation.type === "group" ? `${conversation.members.filter(m => !m.left_at).length} members` : other?.is_online ? "Online" : "Last seen recently"}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button aria-label="Voice call coming soon" title="Voice call" className="topbar-icon-button p-0 text-scalar-green"><Phone size={25} strokeWidth={2.25} /></Button>
        <Button aria-label="Video call coming soon" title="Video call" className="topbar-icon-button p-0 text-scalar-blue"><Video size={25} strokeWidth={2.25} /></Button>
        <Button aria-label="Conversation info" title="Conversation info" onClick={onInfo} className="topbar-icon-button p-0 text-scalar-ink"><Info size={25} strokeWidth={2.25} /></Button>
      </div>
    </header>
  );
}
