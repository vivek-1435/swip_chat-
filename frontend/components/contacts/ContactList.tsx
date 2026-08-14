import { Avatar } from "@/components/ui/Avatar";
import type { Contact } from "@/services/contactApi";

export function ContactList({ contacts, onOpen }: { contacts: Contact[]; onOpen: (userId: number) => void }) {
  if (!contacts.length) return <p className="py-6 text-center text-sm text-slate-500">No contacts yet</p>;
  return (
    <div className="grid gap-2">
      {contacts.map((contact) => (
        <button key={contact.id} onClick={() => onOpen(contact.contact_user_id)} className="focus-ring flex items-center gap-3 rounded-md p-2 text-left hover:bg-slate-100">
          <Avatar src={contact.contact_user.avatar_url} name={contact.contact_user.display_name} online={contact.contact_user.is_online} />
          <span>
            <span className="block text-sm font-semibold">{contact.contact_user.display_name}</span>
            <span className="block text-xs text-slate-500">@{contact.contact_user.username}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
