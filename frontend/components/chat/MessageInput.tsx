"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import type { Message } from "@/types/message";

export function MessageInput({ onSend, onTyping, reply, onCancelReply }: { onSend: (content: string, replyId?: number | null) => Promise<void>; onTyping: (active: boolean) => void; reply?: Message | null; onCancelReply: () => void }) {
  const [content, setContent] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function changed(value: string) {
    setContent(value);
    onTyping(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onTyping(false), 900);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = content.trim();
    if (!text) return;
    setContent("");
    onTyping(false);
    await onSend(text, reply?.id);
    onCancelReply();
  }

  return (
    <form onSubmit={submit} className="border-t border-scalar-line bg-white/95 p-3">
      {reply && (
        <div className="mb-2 flex items-center justify-between rounded-lg border border-scalar-line bg-[#fbfbfa] px-3 py-2 text-xs text-scalar-slate shadow-[0_6px_14px_rgba(27,27,27,0.04)]">
          <span className="truncate">Replying to {reply.sender.display_name}: {reply.content}</span>
          <button type="button" aria-label="Cancel reply" className="text-scalar-green" onClick={onCancelReply}><X size={15} /></button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button type="button" aria-label="Attach file" title="Attach file" className="topbar-icon-button text-scalar-blue"><Paperclip size={24} strokeWidth={2.25} /></button>
        <textarea value={content} onChange={(e) => changed(e.target.value)} placeholder="Type a message..." className="focus-ring max-h-32 min-h-11 flex-1 resize-none rounded-[22px] border border-scalar-line bg-[#fbfbfa] px-4 py-3 text-sm text-scalar-ink shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] transition placeholder:text-scalar-pewter hover:border-scalar-pewter/60" />
        <button type="submit" aria-label="Send message" title="Send message" className="topbar-icon-button text-scalar-green"><Send size={24} strokeWidth={2.25} /></button>
      </div>
    </form>
  );
}
