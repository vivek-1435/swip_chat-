"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { AddContactModal } from "@/components/contacts/AddContactModal";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { GroupInfoModal } from "@/components/groups/GroupInfoModal";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { ToastStack } from "@/components/ui/Toast";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useContacts } from "@/hooks/useContacts";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useNotifications } from "@/hooks/useNotifications";
import { useWebSocket } from "@/hooks/useWebSocket";
import { openDirectConversation } from "@/services/conversationApi";
import type { Message } from "@/types/message";

export function ChatLayout({ activeId }: { activeId?: number }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { status, lastEvent, send } = useWebSocket();
  const { conversations, setConversations, loading, query, setQuery, reload } = useConversations();
  const { contacts, add: addContact, remove: removeContact } = useContacts();
  const { toasts, notify } = useNotifications();
  const [newOpen, setNewOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [reply, setReply] = useState<Message | null>(null);
  const active = conversations.find((conversation) => conversation.id === activeId);
  const { messages, loading: messagesLoading, create, remove, update } = useMessages(activeId, lastEvent);

  useEffect(() => {
    if (lastEvent?.type === "error") notify(lastEvent.message, "error");
    if (lastEvent?.type === "new_message" && lastEvent.message.sender_id !== user?.id) {
      notify(`New message from ${lastEvent.message.sender.display_name}`);
    }
  }, [lastEvent, notify, user?.id]);

  const typingNames = useMemo(() => {
    if (lastEvent?.type !== "typing" || lastEvent.conversation_id !== activeId || !lastEvent.active) return [];
    const member = active?.members.find((item) => item.user_id === lastEvent.user_id);
    return member ? [member.user.display_name] : [];
  }, [lastEvent, active, activeId]);

  async function openDirect(userId: number) {
    const convo = await openDirectConversation(userId);
    setNewOpen(false);
    // Optimistically add the conversation to the top of the list if not already there
    setConversations((prev) => {
      if (prev.find((c) => c.id === convo.id)) return prev;
      return [convo, ...prev];
    });
    await reload();
    router.push(`/chat/${convo.id}`);
  }

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden bg-scalar-wash md:grid-cols-[360px_1fr]">
      <div className={active ? "hidden md:block" : "block"}>
        <Sidebar user={user} conversations={conversations} contacts={contacts} loading={loading} query={query} activeId={activeId} onQuery={setQuery} onSelect={(id) => router.push(`/chat/${id}`)} onNew={() => setNewOpen(true)} onGroup={() => setGroupOpen(true)} onProfile={() => setProfileOpen(true)} onLogout={signOut} />
      </div>
      <main className={active ? "flex min-h-0 flex-col bg-[#efeae2]" : "hidden min-h-0 flex-col bg-[#efeae2] md:flex"}>

        {!active ? (
          <div className="flex flex-1 items-center justify-center text-sm text-scalar-slate">Select a conversation to start messaging</div>
        ) : (
          <>
            <ChatHeader conversation={active} me={user} contacts={contacts} onInfo={() => setInfoOpen(true)} />
            {status === "reconnecting" && <div className="border-b border-[#ffd4bf] bg-[#fff4ee] px-4 py-2 text-center text-xs font-semibold text-scalar-orange">Reconnecting...</div>}
            <MessageList messages={messages} me={user} loading={messagesLoading} onReply={setReply} onUpdate={update} />
            <TypingIndicator names={typingNames} />
            <MessageInput reply={reply} onCancelReply={() => setReply(null)} onTyping={(activeTyping) => activeId && send({ type: activeTyping ? "typing_start" : "typing_stop", conversation_id: activeId })} onSend={async (content, replyId) => {
              const optimisticId = user ? create(content, user.id, replyId) : null;
              const sent = activeId ? send({ type: "send_message", conversation_id: activeId, content, reply_to_id: replyId ?? null }) : false;
              if (!sent) {
                if (optimisticId) remove(optimisticId);
                notify("Message could not be sent while disconnected.", "error");
                return;
              }
              try {
                await reload();
              } catch {
                // Ignore reload error since websocket events will reconcile this.
              }
            }} />
          </>
        )}
      </main>
      <AddContactModal open={newOpen} onClose={() => setNewOpen(false)} onOpenDirect={openDirect} contacts={contacts} onAdd={async (userId, savedName) => { await addContact(userId, savedName); notify("Contact added.", "success"); }} onRemove={async (userId) => { await removeContact(userId); notify("Contact removed.", "success"); void reload(); }} />
      <CreateGroupModal open={groupOpen} onClose={() => setGroupOpen(false)} onCreated={(id) => { notify("Group created.", "success"); void reload(); router.push(`/chat/${id}`); }} />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      {active && <GroupInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} conversation={active} me={user} onUpdated={(updated) => setConversations((items) => items.map((item) => item.id === updated.id ? updated : item))} />}
      <ToastStack toasts={toasts} />
    </div>
  );
}
