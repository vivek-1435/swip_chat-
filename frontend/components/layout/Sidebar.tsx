"use client";

import { LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationSearch } from "@/components/conversations/ConversationSearch";
import { NewConversationButton } from "@/components/conversations/NewConversationButton";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import type { Contact } from "@/services/contactApi";

export function Sidebar({
  user,
  conversations,
  contacts,
  loading,
  query,
  activeId,
  onQuery,
  onSelect,
  onNew,
  onGroup,
  onProfile,
  onLogout
}: {
  user: User | null;
  conversations: Conversation[];
  contacts?: Contact[];
  loading: boolean;
  query: string;
  activeId?: number;
  onQuery: (value: string) => void;
  onSelect: (id: number) => void;
  onNew: () => void;
  onGroup: () => void;
  onProfile: () => void;
  onLogout: () => void;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-scalar-line bg-white/95">
      <header className="flex h-16 items-center justify-between border-b border-scalar-line px-4">
        <button onClick={onProfile} className="focus-ring flex min-w-0 items-center gap-3 rounded-md p-1 text-left transition hover:opacity-85">
          <Avatar src={user?.avatar_url} name={user?.display_name ?? "Me"} online />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-scalar-ink">{user?.display_name ?? "SwipChat"}</span>
            <span className="block text-xs text-scalar-slate">@{user?.username}</span>
          </span>
        </button>
        <div className="flex gap-1">
          <Button onClick={onGroup} aria-label="Create group" title="Create group" className="topbar-icon-button p-0 text-scalar-green"><Users size={25} strokeWidth={2.25} /></Button>
          <Link aria-label="Settings" title="Settings" href="/settings" className="topbar-icon-button text-scalar-blue"><Settings size={25} strokeWidth={2.25} /></Link>
          <Button onClick={onLogout} aria-label="Log out" title="Log out" className="topbar-icon-button p-0 text-scalar-orange"><LogOut size={25} strokeWidth={2.25} /></Button>
        </div>
      </header>
      <div className="flex gap-2 p-3">
        <ConversationSearch value={query} onChange={onQuery} />
        <NewConversationButton onClick={onNew} />
      </div>
      <ConversationList conversations={conversations} contacts={contacts} me={user} activeId={activeId} loading={loading} onSelect={onSelect} />
    </aside>
  );
}
