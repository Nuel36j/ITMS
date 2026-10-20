import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";

export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Link href="/" className="mb-8">
        <Wordmark />
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-rule bg-surface p-7 shadow-sm">
        <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stamp">
          <span className="h-0.5 w-5 bg-[#e8603c]" />
          Industrial training
        </p>
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 mb-6 text-sm text-ink-soft">{subtitle}</p>}
        {children}
      </div>

      {footer && <p className="mt-6 text-sm text-ink-soft">{footer}</p>}
    </div>
  );
}