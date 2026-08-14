"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import type { Message } from "@/types/message";

export function MessageInput({ onSend, onTyping, reply, onCancelReply }: { onSend: (content: string, replyId?: number | null) => Promise<void>; onTyping: (active: boolean) => void; reply?: Message | null; onCancelReply: () => void }) {
  const [content, setContent] = useState("");
  const timer = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }

  function changed(value: string) {
    setContent(value);
    autoResize();
    onTyping(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onTyping(false), 900);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = content.trim();
    if (!text) return;
    setContent("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onTyping(false);
    await onSend(text, reply?.id);
    onCancelReply();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit(e as unknown as FormEvent);
    }
  }

  return (
    <form onSubmit={submit} className="border-t border-scalar-line bg-white/95 p-2 sm:p-3 pb-safe">
      {reply && (
        <div className="mb-2 flex items-center justify-between rounded-lg border border-scalar-line bg-[#fbfbfa] px-3 py-2 text-xs text-scalar-slate shadow-[0_6px_14px_rgba(27,27,27,0.04)]">
          <span className="truncate">Replying to {reply.sender.display_name}: {reply.content}</span>
          <button type="button" aria-label="Cancel reply" className="text-scalar-green ml-2 flex-shrink-0" onClick={onCancelReply}><X size={15} /></button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button type="button" aria-label="Attach file" title="Attach file" className="topbar-icon-button text-scalar-blue flex-shrink-0"><Paperclip size={22} strokeWidth={2.25} /></button>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => changed(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="focus-ring flex-1 resize-none overflow-hidden rounded-[22px] border border-scalar-line bg-[#fbfbfa] px-4 py-3 text-[16px] leading-relaxed text-scalar-ink shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] transition placeholder:text-scalar-pewter hover:border-scalar-pewter/60 min-h-[44px]"
        />
        <button type="submit" aria-label="Send message" title="Send message" className="topbar-icon-button text-scalar-green flex-shrink-0"><Send size={22} strokeWidth={2.25} /></button>
      </div>
    </form>
  );
}
