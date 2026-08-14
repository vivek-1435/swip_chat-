"use client";

import { Moon, Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function AppearanceSettings() {
  const { mode, resolved, setMode } = useTheme();

  return (
    <section className="grid gap-3">
      <label className="flex items-center justify-between gap-4 rounded-lg border border-scalar-line bg-[#fbfbfa] p-4">
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dfd1fa] bg-[#f4efff] text-scalar-purple">
            <Moon size={17} strokeWidth={2.2} />
          </span>
          <span className="text-sm font-semibold text-scalar-ink">
            Dark mode
          </span>
        </span>
        <input
          type="checkbox"
          className="scalar-toggle shrink-0"
          checked={resolved === "dark"}
          onChange={(e) => setMode(e.target.checked ? "dark" : "light")}
        />
      </label>
      <label className="grid gap-2 rounded-lg border border-scalar-line bg-[#fbfbfa] p-4">
        <span className="flex items-center gap-3 text-sm font-semibold text-scalar-ink">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-scalar-line bg-white text-scalar-ink">
            <Palette size={17} strokeWidth={2.2} />
          </span>
          Interface theme
        </span>
        <select
          className="scalar-select w-full"
          value={mode}
          aria-label="Theme"
          onChange={(e) => setMode(e.target.value as "system" | "light" | "dark")}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </section>
  );
}
