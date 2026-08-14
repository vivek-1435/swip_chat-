"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { ContactSearch } from "./ContactSearch";
import { useContacts } from "@/hooks/useContacts";
import { useNotifications } from "@/hooks/useNotifications";
import type { User } from "@/types/user";

export function AddContactModal({ open, onClose, onOpenDirect, onAdded }: { open: boolean; onClose: () => void; onOpenDirect: (userId: number) => void; onAdded?: () => void }) {
  const { contacts, results, query, setQuery, add, remove } = useContacts();
  const { notify } = useNotifications();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [savedName, setSavedName] = useState("");
  
  const contactUserIds = new Set(contacts.map(c => c.contact_user_id));
  const filteredResults = results.filter(u => !contactUserIds.has(u.id));

  async function handleAddContact() {
    if (!selectedUser) return;
    try {
      await add(selectedUser.id, savedName.trim() || undefined);
      notify("Contact added successfully", "success");
      setSelectedUser(null);
      setSavedName("");
      onAdded?.();
    } catch (err) {
      const e = err as Error;
      notify(e.message || "Failed to add contact", "error");
    }
  }

  async function handleRemoveContact(e: React.MouseEvent, userId: number) {
    e.stopPropagation();
    try {
      await remove(userId);
      notify("Contact removed successfully", "success");
    } catch (err) {
      const e = err as Error;
      notify(e.message || "Failed to remove contact", "error");
    }
  }

  return (
    <Modal title="Manage Contacts" open={open} onClose={() => { setSelectedUser(null); onClose(); }}>
      <div className="grid gap-4">
        {selectedUser ? (
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Add Contact Details</h3>
              <p className="text-xs text-slate-500">You are adding @{selectedUser.username} to your contacts.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Saved Name (Optional)</label>
              <Input 
                value={savedName}
                onChange={(e) => setSavedName(e.target.value)}
                placeholder="e.g. Mom, Best Friend"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setSelectedUser(null)}>Cancel</Button>
              <Button type="button" onClick={() => void handleAddContact()}>Save Contact</Button>
            </div>
          </div>
        ) : (
          <>
            <ContactSearch value={query} onChange={setQuery} />
            <div className="grid gap-2">
              {filteredResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar src={user.avatar_url} name={user.display_name} online={user.is_online} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{user.display_name}</span>
                      <span className="block truncate text-xs text-slate-500">@{user.username}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { setSelectedUser(user); setSavedName(""); }}>Add</Button>
                    <Button onClick={() => onOpenDirect(user.id)}>Open</Button>
                  </div>
                </div>
              ))}
              {query && filteredResults.length === 0 && <p className="py-4 text-center text-sm text-slate-500">No results found</p>}
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Your Contacts</h3>
              {contacts.length === 0 && <p className="text-sm text-slate-500 mb-2">No contacts yet.</p>}
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between rounded-md p-2 hover:bg-slate-50 group cursor-pointer" onClick={() => onOpenDirect(contact.contact_user_id)}>
                  <div className="flex items-center gap-3">
                    <Avatar src={contact.contact_user.avatar_url} name={contact.saved_name || contact.contact_user.display_name} />
                    <div>
                      <span className="block text-sm font-medium">{contact.saved_name || contact.contact_user.display_name}</span>
                      {contact.saved_name && <span className="block text-xs text-slate-500">@{contact.contact_user.username}</span>}
                    </div>
                  </div>
                  <Button type="button" className="opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={(e) => handleRemoveContact(e, contact.contact_user_id)}>Remove</Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
