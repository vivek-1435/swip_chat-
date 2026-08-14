"use client";

import { useState } from "react";
import { MessageStatus } from "./MessageStatus";
import { ReactionPicker } from "./ReactionPicker";
import { ReplyPreview } from "./ReplyPreview";
import { classNames, formatTime } from "@/lib/utils";
import { reactToMessage } from "@/services/messageApi";
import type { Message } from "@/types/message";

export function MessageBubble({
  message,
  mine,
  replyTo,
  onReply,
  onUpdate
}: {
  message: Message;
  mine: boolean;
  replyTo?: Message;
  onReply: (message: Message) => void;
  onUpdate: (message: Message) => void;
}) {
  const [picker, setPicker] = useState(false);
  return (
    <div className={classNames("group flex mb-0.5", mine ? "justify-end" : "justify-start")}>
      <div
        className={classNames(
          "relative max-w-[72%] sm:max-w-[65%] px-3 pt-2 pb-1.5 shadow-sm",
          mine
            ? "rounded-[18px] rounded-br-[4px] bg-[#dcf8c6] text-scalar-ink"
            : "rounded-[18px] rounded-bl-[4px] bg-white text-scalar-ink border border-[#e9e9e9]"
        )}
      >
        {replyTo && <ReplyPreview message={replyTo} />}
        <p className="whitespace-pre-wrap break-words text-[14.5px] leading-[1.45]">{message.content}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[11px] text-scalar-pewter">{formatTime(message.created_at)}</span>
          {mine && <MessageStatus status={message.status} />}
        </div>
        {message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((r, i) => (
              <span key={i} className="inline-flex items-center rounded-full bg-black/6 px-1.5 py-0.5 text-xs">{r.emoji}</span>
            ))}
          </div>
        )}
        {/* Action row — always visible on touch, hover on desktop */}
        <div className={classNames("mt-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 touch-visible transition-opacity")}>
          <button
            className="rounded-full bg-black/6 px-2.5 py-0.5 text-[12px] font-medium text-scalar-ink hover:bg-black/10 active:bg-black/15"
            onClick={() => onReply(message)}
          >Reply</button>
          <button
            className="rounded-full bg-black/6 px-2.5 py-0.5 text-[12px] font-medium text-scalar-ink hover:bg-black/10 active:bg-black/15"
            onClick={() => setPicker((v) => !v)}
          >😊</button>
        </div>
        {picker && <ReactionPicker onPick={(emoji) => void reactToMessage(message.id, emoji).then((updated) => { onUpdate(updated); setPicker(false); })} />}
      </div>
    </div>
  );
}
