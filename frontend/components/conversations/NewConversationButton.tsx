import { MessageSquarePlus } from "lucide-react";


export function NewConversationButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="New conversation" onClick={onClick} className="topbar-icon-button h-10 w-10 text-scalar-green">
      <MessageSquarePlus size={22} strokeWidth={2.25} />
    </button>
  );
}
