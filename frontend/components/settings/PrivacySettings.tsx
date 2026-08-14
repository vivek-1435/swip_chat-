"use client";

import { Eye, Keyboard, LockKeyhole, Radio } from "lucide-react";

const items = [
  { label: "Read receipts", icon: Eye, checked: true },
  { label: "Typing indicators", icon: Keyboard, checked: true },
  { label: "Online status", icon: Radio, checked: true }
];

export function PrivacySettings() {
  return (
    <section className="grid gap-3">
      {items.map((item) => (
        <label key={item.label} className="flex items-center justify-between gap-4 rounded-lg border border-scalar-line bg-[#fbfbfa] p-4">
          <span className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7eee4] bg-[#eef7f3] text-scalar-green">
              <item.icon size={17} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold text-scalar-ink">{item.label}</span>
          </span>
          <input type="checkbox" defaultChecked={item.checked} className="scalar-toggle shrink-0" />
        </label>
      ))}
      <div className="flex gap-3 rounded-lg border border-[#d7eee4] bg-[#f4fbf8] p-4 text-sm text-scalar-slate">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-scalar-green text-white shadow-[0_10px_20px_rgba(6,144,97,0.18)]">
          <LockKeyhole size={17} strokeWidth={2.2} />
        </span>
        <div>
          <p className="font-semibold text-scalar-ink">Real end-to-end encryption</p>
          <p className="mt-1">Coming soon. This build uses a documented mock encryption layer only.</p>
        </div>
      </div>
    </section>
  );
}
