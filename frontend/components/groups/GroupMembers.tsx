import { Avatar } from "@/components/ui/Avatar";

import type { Conversation } from "@/types/conversation";

export function GroupMembers({ conversation }: { conversation: Conversation }) {
  return (
    <div className="grid gap-2">
      {conversation.members.filter(m => !m.left_at).map((member) => (
        <div key={member.user_id} className="flex items-center justify-between rounded-md p-2 hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <Avatar src={member.user.avatar_url} name={member.user.display_name} online={member.user.is_online} />
            <div>
              <p className="text-sm font-semibold">{member.user.display_name}</p>
              <p className="text-xs text-slate-500">{member.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
