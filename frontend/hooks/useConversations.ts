"use client";

import { useCallback, useEffect, useState } from "react";
import { getConversations } from "@/services/conversationApi";
import type { Conversation } from "@/types/conversation";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setConversations(await getConversations(query));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const id = window.setTimeout(() => void reload(), 250);
    return () => window.clearTimeout(id);
  }, [reload]);

  return { conversations, setConversations, loading, query, setQuery, reload };
}
