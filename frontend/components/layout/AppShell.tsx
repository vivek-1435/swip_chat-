"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { ChatLayout } from "./ChatLayout";

export function AppShell({ activeId }: { activeId?: number }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return <Loading label="Restoring secure session..." />;
  if (!user) return null;
  return <ChatLayout activeId={activeId} />;
}
