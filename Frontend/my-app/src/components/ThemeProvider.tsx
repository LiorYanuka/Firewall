"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  const resolvedTheme = useMemo(() => {
    return theme === "system" ? resolveSystemTheme() : theme;
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const sys = resolveSystemTheme();
        root.setAttribute("data-theme", sys);
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const value: ThemeContextValue = { theme, setTheme, resolvedTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
