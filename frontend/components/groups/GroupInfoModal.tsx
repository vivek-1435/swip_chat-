"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { GroupMembers } from "./GroupMembers";
import { ManageGroupModal } from "./ManageGroupModal";
import { useNotifications } from "@/hooks/useNotifications";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";

export function GroupInfoModal({
  open,
  onClose,
  conversation,
  me,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  conversation: Conversation;
  me: User | null;
  onUpdated: (conversation: Conversation) => void;
}) {
  const [manage, setManage] = useState(false);
  const { notify } = useNotifications();
  const canManage = conversation.members.some((member) => !member.left_at && member.user_id === me?.id && member.role === "admin");


  return (
    <Modal title={conversation.type === "group" ? "Group Info" : "Conversation Info"} open={open} onClose={onClose}>
      <div className="grid gap-4">
        <p className="text-sm text-slate-600">Real end-to-end encryption is a coming-soon placeholder. Encryption is simulated for this assignment.</p>
        {conversation.type === "group" && canManage && <Button onClick={() => setManage(true)}>Manage group</Button>}
        <GroupMembers conversation={conversation} />
        <ManageGroupModal open={manage} onClose={() => setManage(false)} conversation={conversation} me={me} onUpdated={onUpdated} />
      </div>
    </Modal>
  );
}
