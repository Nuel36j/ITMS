"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "./Wordmark";

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", d: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/profile", label: "Student profile", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" },
  { href: "/logs", label: "Activity log", d: "M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2ZM12 6v14" },
  { href: "/ai", label: "AI summary", d: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" },
];

function initials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper md:flex">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-sidebar px-4 py-3 md:hidden">
        <Link href="/dashboard">
          <Wordmark tone="light" />
        </Link>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-sm border border-white/25 px-3 py-1.5 text-sm text-white"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" className="flex flex-col gap-1 bg-sidebar px-4 pb-4 md:hidden">
          <SidebarLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          <div className="mt-2 border-t border-white/10 pt-3">
            <ThemeToggle variant="switch" className="px-3 py-2 text-white/80" />
            <LogoutButton onClick={logout} />
          </div>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar px-5 py-6 md:sticky md:top-0 md:flex md:h-screen">
        <Link href="/dashboard" className="mb-8">
          <Wordmark tone="light" />
        </Link>
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
          Your workspace
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          <SidebarLinks pathname={pathname} />
        </nav>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-sm text-[#17333f]">
              {initials(user?.full_name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.full_name}</p>
              <p className="truncate text-xs text-white/55">{user?.email}</p>
            </div>
          </div>
          <ThemeToggle variant="switch" className="rounded-sm px-3 py-2 text-white/80 hover:bg-white/5" />
          <LogoutButton onClick={logout} />
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-1 w-full rounded-sm px-3 py-2 text-left text-sm text-[#ff9b7d] hover:bg-white/5"
    >
      Log out
    </button>
  );
}

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            {active && (
              <span className="absolute -left-5 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-r bg-[#e8603c] md:block" />
            )}
            <Icon d={item.d} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}