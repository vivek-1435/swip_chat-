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
    <div className={classNames("group flex", mine ? "justify-end" : "justify-start")}>
      <div className={classNames("max-w-[78%] rounded-2xl px-3 py-2 shadow-[0_10px_22px_rgba(27,27,27,0.07)] ring-1", mine ? "rounded-br-md bg-[linear-gradient(135deg,#069061,#057a52)] text-white ring-scalar-green/25" : "rounded-bl-md bg-white text-scalar-ink ring-scalar-line")}>
        {replyTo && <ReplyPreview message={replyTo} />}
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
        <div className={classNames("mt-1 flex items-center justify-end gap-1 text-[11px]", mine ? "text-white/80" : "text-scalar-pewter")}>
          {formatTime(message.created_at)}
          {mine && <MessageStatus status={message.status} />}
        </div>
        {message.reactions.length > 0 && <div className="mt-1 text-xs">{message.reactions.map((r) => r.emoji).join(" ")}</div>}
        <div className="mt-2 hidden items-center gap-2 group-hover:flex">
          <button className={classNames("rounded-full px-2 py-1 text-xs font-semibold no-underline transition", mine ? "bg-white/12 text-white hover:bg-white/18" : "bg-[#eef7f3] text-scalar-green hover:bg-[#e2f2eb]")} onClick={() => onReply(message)}>Reply</button>
          <button className={classNames("rounded-full px-2 py-1 text-xs font-semibold no-underline transition", mine ? "bg-white/12 text-white hover:bg-white/18" : "bg-[#eef7f3] text-scalar-green hover:bg-[#e2f2eb]")} onClick={() => setPicker((value) => !value)}>React</button>
        </div>
        {picker && <ReactionPicker onPick={(emoji) => void reactToMessage(message.id, emoji).then((updated) => {
          onUpdate(updated);
          setPicker(false);
        })} />}
      </div>
    </div>
  );
}
