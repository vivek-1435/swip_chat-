"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useContacts } from "@/hooks/useContacts";
import { addGroupMember, removeGroupMember, updateGroupMemberRole, deleteGroup } from "@/services/conversationApi";
import { useNotifications } from "@/hooks/useNotifications";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";

export function ManageGroupModal({ open, onClose, conversation, me, onUpdated }: { open: boolean; onClose: () => void; conversation: Conversation; me: User | null; onUpdated: (conversation: Conversation) => void; }) {
  const { contacts, query, setQuery } = useContacts();
  const { notify } = useNotifications();
  const [tab, setTab] = useState<"add" | "remove" | "admin" | "delete">("add");
  const activeMembers = conversation.members.filter(m => !m.left_at);
  const memberIds = new Set(activeMembers.map((member) => member.user_id));
  
  async function addMember(userId: number) {
    try {
      const updated = await addGroupMember(conversation.id, userId);
      onUpdated(updated);
      notify("Member added", "success");
    } catch (err) {
      const e = err as Error;
      notify(e.message || "Failed to add member", "error");
    }
  }

  async function removeMember(userId: number) {
    try {
      const updated = await removeGroupMember(conversation.id, userId);
      onUpdated(updated);
      notify("Member removed", "success");
    } catch (err) {
      const e = err as Error;
      notify(e.message || "Failed to remove member", "error");
    }
  }

  async function makeAdmin(userId: number) {
    try {
      const updated = await updateGroupMemberRole(conversation.id, userId, "admin");
      onUpdated(updated);
      notify("Member promoted to admin", "success");
    } catch (err) {
      const e = err as Error;
      notify(e.message || "Failed to update role", "error");
    }
  }

  async function handleDeleteGroup() {
    try {
      await deleteGroup(conversation.id);
      notify("Group deleted", "success");
      onClose();
      window.location.href = "/";
    } catch (err) {
      const e = err as Error;
      notify(e.message || "Failed to delete group", "error");
    }
  }

  const filteredResults = contacts
    .map(c => c.contact_user)
    .filter(u => u.display_name.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase()))
    .filter((user) => !memberIds.has(user.id));

  // Exclude the current user from member lists
  const filteredMembers = activeMembers
    .filter((member) => member.user_id !== me?.id)
    .filter((member) => member.user.display_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal title="Manage Group" open={open} onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-4 h-[350px]">
        
        {/* Sidebar Options */}
        <div className="w-full md:w-1/3 flex flex-col gap-1 border-r pr-2 border-scalar-line overflow-y-auto">
          <button type="button" onClick={() => { setTab("add"); setQuery(""); }} className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition ${tab === "add" ? "bg-scalar-wash text-scalar-ink" : "text-scalar-pewter hover:bg-slate-50 hover:text-scalar-ink"}`}>Add Member</button>
          <button type="button" onClick={() => { setTab("remove"); setQuery(""); }} className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition ${tab === "remove" ? "bg-scalar-wash text-scalar-ink" : "text-scalar-pewter hover:bg-slate-50 hover:text-scalar-ink"}`}>Remove Member</button>
          <button type="button" onClick={() => { setTab("admin"); setQuery(""); }} className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition ${tab === "admin" ? "bg-scalar-wash text-scalar-ink" : "text-scalar-pewter hover:bg-slate-50 hover:text-scalar-ink"}`}>Make Admin</button>
          <button type="button" onClick={() => { setTab("delete"); setQuery(""); }} className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition ${tab === "delete" ? "bg-rose-50 text-rose-700" : "text-rose-600 hover:bg-rose-50"}`}>Delete Group</button>
        </div>

        {/* Main Content Pane */}
        <div className="w-full md:w-2/3 flex flex-col">
          {tab !== "delete" && (
            <div className="mb-4">
              <Input 
                placeholder={tab === "add" ? "Search contacts..." : "Search members..."} 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="w-full"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto grid gap-2 content-start">
            {tab === "add" && (
              <>
                {filteredResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-md p-2 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar_url} name={user.display_name} online={user.is_online} />
                      <span className="text-sm font-semibold text-scalar-ink">{user.display_name}</span>
                    </div>
                    <Button type="button" className="bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={() => void addMember(user.id)}>Add</Button>
                  </div>
                ))}
                {filteredResults.length === 0 && (
                  <div className="p-4 text-center text-sm text-scalar-pewter">
                    No contacts found. Add people to your contacts first to invite them to groups.
                  </div>
                )}
              </>
            )}

            {tab === "remove" && (
              <>
                {filteredMembers.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between rounded-md p-2 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.user.avatar_url} name={member.user.display_name} online={member.user.is_online} />
                      <div>
                        <p className="text-sm font-semibold text-scalar-ink">{member.user.display_name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                    <Button type="button" className="bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={() => void removeMember(member.user_id)}>Remove</Button>
                  </div>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="p-4 text-center text-sm text-scalar-pewter">
                    {activeMembers.length <= 1 ? "You are the only member in this group. Add members first." : "No members found to remove."}
                  </div>
                )}
              </>
            )}

            {tab === "admin" && (
              <>
                {filteredMembers.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between rounded-md p-2 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.user.avatar_url} name={member.user.display_name} online={member.user.is_online} />
                      <div>
                        <p className="text-sm font-semibold text-scalar-ink">{member.user.display_name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                    <Button type="button" disabled={member.role === "admin"} className="bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50" onClick={() => void makeAdmin(member.user_id)}>Make Admin</Button>
                  </div>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="p-4 text-center text-sm text-scalar-pewter">
                    {activeMembers.length <= 1 ? "You are the only member in this group. Add members first." : "No eligible members found."}
                  </div>
                )}
              </>
            )}

            {tab === "delete" && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete this group? This action cannot be undone and will permanently remove the group and all its messages for everyone.</p>
                <Button type="button" className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => void handleDeleteGroup()}>Yes, Delete Group</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
