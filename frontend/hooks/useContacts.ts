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
    const newContact = await addContact(userId, savedName);
    setContacts((prev) => [newContact, ...prev]);
  }

  async function remove(userId: number) {
    await removeContact(userId);
    setContacts((prev) => prev.filter((c) => c.contact_user_id !== userId));
  }

  return { contacts, results, query, setQuery, add, remove, reload };
}
