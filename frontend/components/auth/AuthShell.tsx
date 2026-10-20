import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type Mode = "login" | "register";
type IconName = "check" | "shield" | "device" | "bolt" | "lock";

const COPY: Record<
  Mode,
  {
    eyebrow?: string;
    lines: [string, string];
    body: string;
    points: [IconName, string][];
    topPrompt: string;
    topLabel: string;
    topHref: string;
  }
> = {
  login: {
    lines: ["Track your progress.", "Build your future."],
    body: "ITMS helps you keep a record of your training, log your activities, and stay on top of your goals — all in one place.",
    points: [
      ["check", "Easy log tracking"],
      ["shield", "Secure & private"],
      ["device", "Access anywhere"],
    ],
    topPrompt: "New here?",
    topLabel: "Create an account",
    topHref: "/register",
  },
  register: {
    eyebrow: "Join ITMS",
    lines: ["Better records.", "Bigger goals."],
    body: "Create your account and start logging your training, tracking your progress, and building a stronger future.",
    points: [
      ["bolt", "Fast & simple setup"],
      ["lock", "Your data is secure"],
      ["device", "Use on any device"],
    ],
    topPrompt: "Already have an account?",
    topLabel: "Log in",
    topHref: "/login",
  },
};

/* ------------------------------ icons ------------------------------ */

function Icon({ name, className = "h-5 w-5" }: { name: IconName | "book"; className?: string }) {
  const paths: Record<string, ReactNode> = {
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.3 2.5 2.5 4.5-5" />
      </>
    ),
    shield: <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />,
    device: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    book: (
      <>
        <path d="M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1V18c-2.5-1-6-1-9 1-3-2-6.5-2-9-1V5.5Z" />
        <path d="M12 6.5V19" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

/* ------------------------------ shell ------------------------------ */

export function AuthShell({
  mode,
  title,
  subtitle,
  footer,
  children,
}: {
  mode: Mode;
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  const c = COPY[mode];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-700 dark:bg-[#050d1a] dark:text-slate-200">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 90% 10%, rgba(37,99,235,0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(20,184,166,0.14), transparent 70%)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 text-cyan-600 ring-1 ring-cyan-500/30 dark:text-cyan-300">
            <Icon name="book" className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-bold tracking-tight text-slate-900 dark:text-white">ITMS</span>
            <span className="block text-[10px] tracking-[0.25em] text-slate-500 dark:text-slate-400">
              TRAINING LOGBOOK
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <p className="hidden text-sm text-slate-600 sm:block dark:text-slate-300">
            {c.topPrompt}{" "}
            <Link href={c.topHref} className="font-medium text-blue-600 hover:underline dark:text-cyan-300">
              {c.topLabel} ›
            </Link>
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-2 lg:grid-cols-2 lg:gap-12 lg:pt-8">
        {/* Left: pitch (stacked above the form on mobile) */}
        <section>
          {c.eyebrow && (
            <p className="mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              <span className="h-px w-5 bg-cyan-500" />
              {c.eyebrow.toUpperCase()}
            </p>
          )}
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-slate-900 sm:text-5xl dark:text-white">
            {c.lines[0]}
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent dark:from-cyan-300 dark:to-teal-300">
              {c.lines[1]}
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 lg:mt-6 dark:text-slate-300">{c.body}</p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 lg:mt-8 lg:block lg:space-y-4">
            {c.points.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-500/10 text-cyan-600 ring-1 ring-cyan-500/25 dark:text-cyan-300">
                  <Icon name={icon} className="h-4.5 w-4.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          {mode === "login" ? (
            <p className="mt-8 max-w-xs border-l-2 lg:mt-16 border-cyan-500 pl-4 font-serif text-lg italic text-slate-600 dark:text-slate-300">
              “Discipline today, results tomorrow.”
            </p>
          ) : (
            <p
              className="mt-8 max-w-[14rem] text-2xl lg:mt-14 lg:text-3xl leading-tight text-cyan-700 dark:text-cyan-200/90"
              style={{
                fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
                transform: "rotate(-6deg)",
              }}
            >
              Good Things Take Consistent Effort.
            </p>
          )}
        </section>

        {/* Right: form card */}
        <div className="mx-auto w-full max-w-md lg:max-w-lg lg:justify-self-end">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-cyan-400/15 dark:bg-[#0a1628]/90 dark:shadow-[0_30px_80px_-30px_rgba(34,211,238,0.25)]">
            <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            <div className="mt-7">{children}</div>
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</p>
          </div>
        </div>
      </main>
    </div>
  );
}