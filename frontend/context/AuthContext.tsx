"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/services/authApi";
import type { User } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refresh() {
    try {
      setUser(await authApi.me());
    } catch {
      authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function signIn(identifier: string, password: string) {
    setUser(await authApi.login(identifier, password));
    router.push("/chat");
  }

  function signOut() {
    authApi.logout();
    setUser(null);
    router.push("/login");
  }

  const value = useMemo(() => ({ user, loading, signIn, signOut, refresh, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
