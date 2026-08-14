"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? "");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const updated = await api<User>("/api/users/me", { method: "PATCH", body: JSON.stringify({ display_name: displayName, avatar_url: avatarUrl }) });
    setUser(updated);
    onClose();
  }

  return (
    <Modal title="Profile" open={open} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <Avatar src={avatarUrl} name={displayName || user?.username || "U"} className="h-16 w-16" />
        <Input aria-label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input aria-label="Avatar URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Avatar URL" />
        <p className="text-sm text-slate-500">@{user?.username}</p>
        <Button>Save profile</Button>
      </form>
    </Modal>
  );
}
