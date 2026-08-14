"use client";

import { useEffect, useState } from "react";
import { getMessages, markRead } from "@/services/messageApi";
import type { Message } from "@/types/message";
import type { ServerEvent } from "@/types/websocket";

export function useMessages(conversationId?: number, lastEvent?: ServerEvent | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    getMessages(conversationId)
      .then((items) => {
        setMessages(items);
        const last = items.at(-1);
        if (last) void markRead(last.id);
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.type === "new_message" && lastEvent.message.conversation_id === conversationId) {
      setMessages((items) => {
        if (items.some((item) => item.id === lastEvent.message.id)) return items;
        const optimisticIndex = items.findIndex((item) => isOptimisticMatch(item, lastEvent.message));
        if (optimisticIndex === -1) return [...items, lastEvent.message];
        return items.map((item, index) => (index === optimisticIndex ? lastEvent.message : item));
      });
      void markRead(lastEvent.message.id);
    }
    if (lastEvent.type === "message_status") {
      setMessages((items) => items.map((item) => (item.id === lastEvent.message_id ? { ...item, status: lastEvent.status } : item)));
    }
  }, [lastEvent, conversationId]);

  function create(content: string, senderId: number, replyToId?: number | null) {
    if (!conversationId) return null;
    const optimistic: Message = {
      id: Date.now() * -1,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: "text",
      status: "sending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: { id: senderId, username: "me", display_name: "Me", is_online: true, created_at: new Date().toISOString() },
      receipts: [],
      reactions: [],
      reply_to_id: replyToId ?? null
    };
    setMessages((items) => [...items, optimistic]);
    return optimistic.id;
  }

  function remove(messageId: number) {
    setMessages((items) => items.filter((item) => item.id !== messageId));
  }

  function update(updated: Message) {
    setMessages((items) => items.map((item) => (item.id === updated.id ? updated : item)));
  }

  return { messages, setMessages, loading, create, remove, update };
}

function isOptimisticMatch(optimistic: Message, confirmed: Message) {
  return (
    optimistic.id < 0 &&
    optimistic.conversation_id === confirmed.conversation_id &&
    optimistic.sender_id === confirmed.sender_id &&
    optimistic.content === confirmed.content &&
    (optimistic.reply_to_id ?? null) === (confirmed.reply_to_id ?? null)
  );
}
