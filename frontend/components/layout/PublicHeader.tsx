"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "./Wordmark";

const cta = "rounded-sm bg-accent px-4 py-2 font-medium text-[#17333f] hover:bg-accent-dark";

export function PublicHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header className="rule-b sticky top-0 z-10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <ThemeToggle />
          {!isLoading && user ? (
            <Link href="/dashboard" className={cta}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link href="/register" className={cta}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}