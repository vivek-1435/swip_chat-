"use client";

import { useEffect, useState } from "react";
import { addContact, getContacts, removeContact, searchUsers, type Contact } from "@/services/contactApi";
import type { User } from "@/types/user";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [results, setResults] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  async function reload() {
    setContacts(await getContacts());
  }

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => searchUsers(query).then(setResults), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  async function add(userId: number, savedName?: string) {
    await addContact(userId, savedName);
    await reload();
  }

  async function remove(userId: number) {
    await removeContact(userId);
    await reload();
  }

  return { contacts, results, query, setQuery, add, remove, reload };
}
