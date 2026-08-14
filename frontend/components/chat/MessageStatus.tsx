import { Check, CheckCheck, Clock } from "lucide-react";
import type { Message } from "@/types/message";

export function MessageStatus({ status }: { status: Message["status"] }) {
  if (status === "sending") return <Clock size={13} aria-label="Sending" />;
  if (status === "sent") return <Check size={14} aria-label="Sent" />;
  return <CheckCheck size={14} className={status === "read" ? "text-white" : undefined} aria-label={status === "read" ? "Read" : "Delivered"} />;
}
