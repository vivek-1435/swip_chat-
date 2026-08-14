"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { RealtimeSocket } from "@/lib/websocket";
import type { ClientEvent, ServerEvent } from "@/types/websocket";
import { useAuth } from "./AuthContext";

type WebSocketContextValue = {
  status: "connected" | "reconnecting" | "disconnected";
  lastEvent: ServerEvent | null;
  send: (event: ClientEvent) => boolean;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const socket = useRef<RealtimeSocket | null>(null);
  const [status, setStatus] = useState<WebSocketContextValue["status"]>("disconnected");
  const [lastEvent, setLastEvent] = useState<ServerEvent | null>(null);

  useEffect(() => {
    socket.current?.disconnect();
    socket.current = null;
    if (!user) return;
    socket.current = new RealtimeSocket(user.id, { onEvent: setLastEvent, onStatus: setStatus });
    socket.current.connect();
    return () => socket.current?.disconnect();
  }, [user?.id]);

  const value = useMemo(() => ({ status, lastEvent, send: (event: ClientEvent) => socket.current?.send(event) ?? false }), [status, lastEvent]);
  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useRealtime() {
  const value = useContext(WebSocketContext);
  if (!value) throw new Error("useRealtime must be used inside WebSocketProvider");
  return value;
}
