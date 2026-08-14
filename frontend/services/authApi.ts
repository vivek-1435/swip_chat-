import { api, setAuthToken } from "./api";
import type { User } from "@/types/user";

export async function register(payload: { username: string; display_name: string; phone?: string; password: string; avatar_url?: string }) {
  return api<User>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function verifyOtp(username: string, otp: string) {
  const result = await api<{ access_token: string; user: User }>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ username, otp })
  });
  setAuthToken(result.access_token);
  return result.user;
}

export async function login(identifier: string, password: string) {
  const result = await api<{ access_token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password })
  });
  setAuthToken(result.access_token);
  return result.user;
}

export function logout() {
  setAuthToken(null);
}

export function me() {
  return api<User>("/api/auth/me");
}
