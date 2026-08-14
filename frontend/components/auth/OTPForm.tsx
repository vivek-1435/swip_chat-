"use client";

import { FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { verifyOtp } from "@/services/authApi";
import { useAuth } from "@/hooks/useAuth";

export function OTPForm({ username }: { username: string }) {
  const { setUser } = useAuth();
  const [otp, setOtp] = useState("123456");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      setUser(await verifyOtp(username, otp));
      window.location.href = "/chat";
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "OTP failed");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <p className="text-sm text-scalar-slate">Mock verification code for this assignment: 123456.</p>
      <Input aria-label="Mock OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button>
        <ShieldCheck size={18} /> Verify
      </Button>
    </form>
  );
}
