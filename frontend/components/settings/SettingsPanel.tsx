"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Info, MonitorCog, Shield, UserRound } from "lucide-react";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { PrivacySettings } from "./PrivacySettings";

const tabs = [
  { name: "Profile", icon: UserRound, color: "text-scalar-ink" },
  { name: "Privacy", icon: Shield, color: "text-scalar-green" },
  { name: "Notifications", icon: Bell, color: "text-scalar-blue" },
  { name: "Appearance", icon: MonitorCog, color: "text-scalar-purple" },
  { name: "About", icon: Info, color: "text-scalar-orange" }
] as const;
const placeholders = ["Voice Calls", "Video Calls", "Stories", "Linked Devices", "Real End-to-End Encryption"];
type TabName = (typeof tabs)[number]["name"];

export function SettingsPanel() {
  const [tab, setTab] = useState<TabName>("Privacy");
  const current = tabs.find((item) => item.name === tab) ?? tabs[1];
  const CurrentIcon = current.icon;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(6,144,97,0.07),transparent_30%),linear-gradient(180deg,#ffffff,#f6f6f4)] p-4 md:p-8">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-[244px_1fr]">
        <aside className="scalar-panel h-fit rounded-lg p-2">
          <div className="mb-2 border-b border-scalar-line px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-scalar-pewter">SwipChat</p>
            <h1 className="mt-1 text-lg font-semibold text-scalar-ink">Settings</h1>
          </div>
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setTab(item.name)}
              className={`focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${tab === item.name ? "bg-scalar-ink text-white shadow-[0_12px_24px_rgba(27,27,27,0.16)]" : "text-scalar-ink hover:bg-[#fbfbfa]"}`}
            >
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${tab === item.name ? "border-white/18 bg-white/12 text-white" : `border-scalar-line bg-white ${item.color}`}`}>
                <item.icon size={16} strokeWidth={2.2} />
              </span>
              {item.name}
            </button>
          ))}
        </aside>
        <section className="scalar-panel rounded-lg p-6">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-scalar-line pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-scalar-pewter">Preferences</p>
              <h2 className="mt-1 text-2xl font-semibold text-scalar-ink">{tab}</h2>
            </div>
            <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-scalar-line bg-white shadow-[0_10px_22px_rgba(27,27,27,0.07)] ${current.color}`}>
              <CurrentIcon size={20} strokeWidth={2.2} />
            </span>
          </div>
          {tab === "Privacy" && <PrivacySettings />}
          {tab === "Notifications" && <NotificationSettings />}
          {tab === "Appearance" && <AppearanceSettings />}
          {tab === "Profile" && (
            <div className="grid gap-3">
              <div className="rounded-lg border border-scalar-line bg-[#fbfbfa] p-4">
                <p className="text-sm font-semibold text-scalar-ink">Profile editing</p>
                <p className="mt-1 text-sm text-scalar-slate">Update your display name and avatar from the profile button in the chat sidebar.</p>
              </div>
            </div>
          )}
          {tab === "About" && (
            <div className="grid gap-4 text-sm text-scalar-slate">
              <p>SwipChat is an original Signal-inspired full-stack assignment with mocked security features.</p>
              <div className="grid gap-2">
                {placeholders.map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3 rounded-lg border border-scalar-line bg-[#fbfbfa] px-3 py-3">
                    <span className="font-medium text-scalar-ink">{item}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#d7eee4] bg-[#eef7f3] px-2 py-1 text-[11px] font-bold uppercase text-scalar-green"><CheckCircle2 size={12} /> Planned</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
