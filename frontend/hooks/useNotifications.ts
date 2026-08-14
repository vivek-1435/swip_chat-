"use client";

import { useCallback, useState } from "react";

export type Toast = { id: number; tone: "success" | "error" | "info"; message: string };

export function useNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now();
    setToasts((items) => [...items, { id, tone, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 3500);
  }, []);
  return { toasts, notify };
}
