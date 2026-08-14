"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "system" | "light" | "dark";
type ThemeContextValue = {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const raw = localStorage.getItem("swipchat-theme");
      return (raw as ThemeMode) ?? "system";
    } catch {
      return "system";
    }
  });

  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    function resolve(m: ThemeMode) {
      if (m === "system") return mq.matches ? "dark" : "light";
      return m === "dark" ? "dark" : "light";
    }

    function apply(m: ThemeMode) {
      const r = resolve(m);
      setResolved(r);
      document.documentElement.setAttribute("data-theme", r);
      try {
        localStorage.setItem("swipchat-theme", m);
      } catch {}
    }

    apply(mode);

    const onChange = () => {
      if (mode === "system") apply("system");
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, resolved, setMode: setModeState }),
    [mode, resolved],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const v = useContext(ThemeContext);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
