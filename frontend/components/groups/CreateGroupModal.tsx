"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useContacts } from "@/hooks/useContacts";
import { createGroup } from "@/services/conversationApi";

export function CreateGroupModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (id: number) => void }) {
  const { contacts } = useContacts();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const group = await createGroup({ name, member_ids: selected });
    onCreated(group.id);
    onClose();
  }

  return (
    <Modal title="Create Group" open={open} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <Input aria-label="Group name" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid gap-2">
          {contacts.map((contact) => (
            <label key={contact.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-100">
              <input type="checkbox" checked={selected.includes(contact.contact_user_id)} onChange={(e) => setSelected((items) => e.target.checked ? [...items, contact.contact_user_id] : items.filter((id) => id !== contact.contact_user_id))} />
              <span className="text-sm">{contact.contact_user.display_name}</span>
            </label>
          ))}
        </div>
        <Button disabled={!name.trim()}>Create group</Button>
      </form>
    </Modal>
  );
}
