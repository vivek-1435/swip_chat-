import { getAuthToken } from "@/services/api";
import { WS_URL } from "./constants";
import type { ClientEvent, ServerEvent } from "@/types/websocket";

export type SocketHandlers = {
  onEvent: (event: ServerEvent) => void;
  onStatus: (status: "connected" | "reconnecting" | "disconnected") => void;
};

export class RealtimeSocket {
  private socket: WebSocket | null = null;
  private retry = 0;
  private closed = false;

  constructor(private userId: number, private handlers: SocketHandlers) {}

  connect() {
    const token = getAuthToken();
    if (!token || this.socket) return;
    this.closed = false;
    this.socket = new WebSocket(`${WS_URL}/ws/${this.userId}?token=${encodeURIComponent(token)}`);
    this.socket.onopen = () => {
      this.retry = 0;
      this.handlers.onStatus("connected");
    };
    this.socket.onmessage = (message) => {
      this.handlers.onEvent(JSON.parse(message.data) as ServerEvent);
    };
    this.socket.onclose = () => {
      this.socket = null;
      if (!this.closed) this.reconnect();
    };
  }

  send(event: ClientEvent) {
    if (this.socket?.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify(event));
    return true;
  }

  disconnect() {
    this.closed = true;
    this.socket?.close();
    this.socket = null;
    this.handlers.onStatus("disconnected");
  }

  private reconnect() {
    this.handlers.onStatus("reconnecting");
    const delay = Math.min(8000, 500 * 2 ** this.retry);
    this.retry += 1;
    window.setTimeout(() => this.connect(), delay);
  }
}
