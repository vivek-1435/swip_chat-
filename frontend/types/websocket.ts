import type { Message } from "./message";

export type ClientEvent =
  | { type: "send_message"; conversation_id: number; content: string; reply_to_id?: number | null }
  | { type: "typing_start"; conversation_id: number }
  | { type: "typing_stop"; conversation_id: number }
  | { type: "mark_read"; conversation_id: number; message_id?: number };

export type ServerEvent =
  | { type: "new_message"; message: Message }
  | { type: "message_status"; message_id: number; status: Message["status"] }
  | { type: "typing"; conversation_id: number; user_id: number; active: boolean }
  | { type: "presence"; user_id: number; status: "online" | "offline" }
  | { type: "error"; message: string };
