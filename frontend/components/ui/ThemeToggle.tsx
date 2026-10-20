"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/theme";

function Sun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

type Props = {
  /** "icon" = compact button (navbars, auth pages). "switch" = labelled row with a switch (sidebar, settings). */
  variant?: "icon" | "switch";
  className?: string;
};

export function ThemeToggle({ variant = "icon", className = "" }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  // Avoid a hydration mismatch: the server can't know the saved theme
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  if (variant === "switch") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        className={`flex w-full items-center justify-between gap-3 text-sm ${className}`}
      >
        <span className="flex items-center gap-2">
          {isDark ? <Moon /> : <Sun />}
          {isDark ? "Dark mode" : "Light mode"}
        </span>
        <span
          className={`relative h-5 w-9 rounded-full transition-colors ${isDark ? "bg-stamp" : "bg-ink/25"}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${isDark ? "left-[1.1rem]" : "left-0.5"}`}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-sm border border-rule text-ink-soft hover:text-ink ${className}`}
    >
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}