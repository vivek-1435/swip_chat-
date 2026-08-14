"use client";

import { BellRing, UsersRound } from "lucide-react";

const items = [
  { label: "Message notifications", icon: BellRing },
  { label: "Group notifications", icon: UsersRound }
];

export function NotificationSettings() {
  return (
    <section className="grid gap-3">
      {items.map((item) => (
        <label key={item.label} className="flex items-center justify-between gap-4 rounded-lg border border-scalar-line bg-[#fbfbfa] p-4">
          <span className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#cfe8f6] bg-[#edf8ff] text-scalar-blue">
              <item.icon size={17} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold text-scalar-ink">{item.label}</span>
          </span>
          <input type="checkbox" defaultChecked className="scalar-toggle shrink-0" />
        </label>
      ))}
    </section>
  );
}
