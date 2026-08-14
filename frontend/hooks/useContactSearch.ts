"use client";

import { useEffect, useState } from "react";
import { searchUsers } from "@/services/contactApi";
import type { User } from "@/types/user";

export function useContactSearch() {
  const [results, setResults] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => searchUsers(query).then(setResults), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  return { results, query, setQuery };
}
