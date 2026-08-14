"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("alice");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(identifier, password);
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input aria-label="Username or phone" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Username or phone" />
      <Input aria-label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button disabled={loading}>
        <LogIn size={18} /> {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
