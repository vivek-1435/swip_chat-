"use client";

import { LogOut, Settings, Users, MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationSearch } from "@/components/conversations/ConversationSearch";
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
    <aside className="relative flex h-full min-h-0 flex-col bg-white">
      {/* Top bar */}
      <header className="flex h-[60px] items-center justify-between px-4 bg-scalar-green">
        <button onClick={onProfile} className="flex min-w-0 items-center gap-2.5 rounded-lg p-1 text-left transition active:opacity-70">
          <Avatar src={user?.avatar_url} name={user?.display_name ?? "Me"} size="sm" online />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-white">{user?.display_name ?? "SwipChat"}</span>
            <span className="block text-[11px] text-white/70">@{user?.username}</span>
          </span>
        </button>
        <div className="flex items-center gap-0.5">
          <button onClick={onGroup} aria-label="Create group" title="New group" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 active:bg-white/25">
            <Users size={21} strokeWidth={2.2} />
          </button>
          <Link aria-label="Settings" href="/settings" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 active:bg-white/25">
            <Settings size={21} strokeWidth={2.2} />
          </Link>
          <button onClick={onLogout} aria-label="Log out" title="Log out" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 active:bg-white/25">
            <LogOut size={21} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="bg-[#f0f2f5] px-3 py-2">
        <ConversationSearch value={query} onChange={onQuery} />
      </div>

      {/* Conversation list */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        <ConversationList conversations={conversations} contacts={contacts} me={user} activeId={activeId} loading={loading} onSelect={onSelect} />
      </div>

      {/* Floating action button */}
      <button
        onClick={onNew}
        aria-label="New conversation"
        className="absolute bottom-6 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-scalar-green text-white shadow-[0_6px_24px_rgba(6,144,97,0.45)] transition hover:bg-[#057a52] active:scale-95"
      >
        <MessageCirclePlus size={26} strokeWidth={2} />
      </button>
    </aside>
  );
}
