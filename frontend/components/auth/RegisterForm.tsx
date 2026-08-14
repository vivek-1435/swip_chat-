"use client";

import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { register } from "@/services/authApi";
import { OTPForm } from "./OTPForm";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pendingUser, setPendingUser] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await register({ username, display_name: displayName, phone: phone || undefined, password });
      setPendingUser(username);
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Registration failed");
    }
  }

  if (pendingUser) return <OTPForm username={pendingUser} />;

  return (
    <form onSubmit={submit} className="grid gap-3">
      <Input aria-label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" />
      <Input aria-label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <Input aria-label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone optional" />
      <Input aria-label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button>
        <UserPlus size={18} /> Create account
      </Button>
    </form>
  );
}
