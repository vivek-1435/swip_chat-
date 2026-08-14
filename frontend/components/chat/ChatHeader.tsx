import { ArrowLeft, Info, Phone, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { conversationAvatar, conversationTitle } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function ChatHeader({ conversation, me, contacts, onInfo }: { conversation: Conversation; me: User | null; contacts?: Contact[]; onInfo: () => void }) {
  const router = useRouter();
  const other = conversation.members.find((member) => member.user_id !== me?.id)?.user;
  return (
    <header className="flex h-[60px] items-center justify-between bg-scalar-green px-3">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="md:hidden inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white/90 transition active:bg-white/20"
        >
          <ArrowLeft size={22} strokeWidth={2.25} />
        </button>
        <Avatar src={conversationAvatar(conversation, me)} name={conversationTitle(conversation, me, contacts)} online={conversation.type === "direct" ? other?.is_online : undefined} />
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-bold text-white">{conversationTitle(conversation, me, contacts)}</h1>
          <p className="truncate text-[12px] text-white/75">{conversation.type === "group" ? `${conversation.members.filter(m => !m.left_at).length} members` : other?.is_online ? "Online" : "Last seen recently"}</p>
        </div>
      </div>
      <div className="flex gap-0.5 flex-shrink-0">
        <button aria-label="Voice call coming soon" title="Voice call" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent border-0 shadow-none text-white/90 transition hover:bg-white/15 active:bg-white/25 p-0"><Phone size={21} strokeWidth={2.2} /></button>
        <button aria-label="Video call coming soon" title="Video call" className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent border-0 shadow-none text-white/90 transition hover:bg-white/15 active:bg-white/25 p-0"><Video size={21} strokeWidth={2.2} /></button>
        <button aria-label="Conversation info" title="Conversation info" onClick={onInfo} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent border-0 shadow-none text-white/90 transition hover:bg-white/15 active:bg-white/25 p-0"><Info size={21} strokeWidth={2.2} /></button>
      </div>
    </header>
  );
}
