import { API_URL } from "@/lib/constants";

let token: string | null = null;

export function setAuthToken(value: string | null) {
  token = value;
  if (typeof window !== "undefined") {
    if (value) localStorage.setItem("swipchat_token", value);
    else localStorage.removeItem("swipchat_token");
  }
}

export function getAuthToken() {
  if (!token && typeof window !== "undefined") token = localStorage.getItem("swipchat_token");
  return token;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  const saved = getAuthToken();
  if (saved) headers.set("Authorization", `Bearer ${saved}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(body.detail ?? body.message ?? "Request failed");
  }
  return response.json() as Promise<T>;
}
