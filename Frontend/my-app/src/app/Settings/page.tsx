"use client";
import { useTheme } from "@/components/ThemeProvider";

export default function Settings() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <section className="p-6">
      <h2 className="text-[17px] font-semibold mb-4">Settings</h2>
      <div className="card p-5 space-y-4">
        <div>
          <div className="text-sm text-[var(--secondary)] mb-2">Appearance</div>
          <div className="segmented inline-flex space-x-2">
            <button
              className={`text-sm ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              className={`text-sm ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
            <button
              className={`text-sm ${theme === "system" ? "active" : ""}`}
              onClick={() => setTheme("system")}
            >
              System
            </button>
          </div>
        </div>
        <div className="text-xs text-[var(--secondary)]">
          Resolved theme: {resolvedTheme}
        </div>
      </div>
    </section>
  );
}
