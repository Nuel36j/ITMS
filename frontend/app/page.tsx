import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const NAV = [
  { label: "Home", href: "/", active: true },
  { label: "Features", href: "#features", active: false },
  { label: "How It Works", href: "#how-it-works", active: false },
  { label: "About", href: "#about", active: false },
];

const FEATURES = [
  {
    title: "One profile, kept current",
    body: "Matriculation number, school, faculty, department and institution, stored once and reused everywhere you need it.",
    icon: "file",
    tone: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:text-emerald-300 dark:ring-emerald-400/20",
  },
  {
    title: "A daily record you can trust",
    body: "Log what you did today in a minute. Every entry is dated and tied to your account, so your history stays yours.",
    icon: "clock",
    tone: "bg-blue-500/10 text-blue-600 ring-blue-500/25 dark:text-blue-300 dark:ring-blue-400/20",
  },
  {
    title: "AI-assisted summaries",
    body: "Turn a week or a month of entries into a short written summary, generated locally and ready to review or edit.",
    icon: "chip",
    tone: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/25 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/25",
  },
] as const;

const ENTRIES = [
  { text: "Wrote a unit test for the internal ticketing tool.", date: "Thu, 24 Sept 2026" },
  { text: "Shadowed the network team during a router migration.", date: "Fri, 25 Sept 2026" },
  { text: "Configured a staging VLAN and documented the change.", date: "Mon, 28 Sept 2026" },
];

const POINTS = [
  "Clean and intuitive interface",
  "Secure and private",
  "Works on any device",
  "No unnecessary complexity",
];

const BARS = [18, 26, 20, 34, 30, 44, 38, 52];

/* -------------------------------------------------------------------------- */
/*  Icons (inline so no new dependency is needed)                             */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
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
      {children}
    </svg>
  );
}

const ArrowRight = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
const Bolt = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
  </Svg>
);
const Play = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m10.5 8.8 4.5 3.2-4.5 3.2V8.8Z" />
  </Svg>
);
const FileIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);
const ClockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const ChipIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M10 10h4v4h-4zM9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </Svg>
);
const BookIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1V18c-2.5-1-6-1-9 1-3-2-6.5-2-9-1V5.5Z" />
    <path d="M12 6.5V19" />
  </Svg>
);
const CheckCircle = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.3 2.5 2.5 4.5-5" />
  </Svg>
);

function FeatureIcon({ name, className }: { name: (typeof FEATURES)[number]["icon"]; className?: string }) {
  if (name === "file") return <FileIcon className={className} />;
  if (name === "clock") return <ClockIcon className={className} />;
  return <ChipIcon className={className} />;
}

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

function LandingHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BookIcon className="h-8 w-8 text-cyan-600 dark:text-cyan-300" />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">ITMS</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative py-5 text-sm font-medium transition-colors ${
                item.active
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute inset-x-0 bottom-2 h-0.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="mx-auto h-px max-w-7xl bg-slate-200 dark:bg-white/5" />
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard + phone mockup (pure CSS, no images, follows light/dark theme)  */
/* -------------------------------------------------------------------------- */

function StatTile({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#0e2038]">
      <span className={`mb-2 block h-5 w-5 rounded-md ${accent}`} />
      <p className="text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

/**
 * The scene is designed at a fixed 640 x 500 canvas. DashboardMockup below
 * scales it down on small screens so the whole composition always fits.
 */
function MockupScene() {
  return (
    <div className="relative h-[500px] w-[640px] origin-top-left scale-[0.42] min-[400px]:scale-[0.54] min-[480px]:scale-[0.66] min-[560px]:scale-[0.8] sm:scale-[0.9] lg:scale-100">
      {/* Tablet */}
      <div
        className="absolute left-0 top-6 w-[560px] origin-top-left rounded-2xl border border-cyan-500/20 bg-white shadow-[0_30px_80px_-20px_rgba(37,99,235,0.30)] dark:border-cyan-300/20 dark:bg-[#0a1628] dark:shadow-[0_30px_80px_-20px_rgba(34,211,238,0.25)]"
        style={{ transform: "perspective(1400px) rotateY(-6deg) rotateX(2deg) rotateZ(-3deg)" }}
      >
        <div className="flex">
          <aside className="w-[130px] shrink-0 border-r border-slate-200 p-3 dark:border-white/5">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
              <span className="h-5 w-5 rounded-md bg-blue-500/80" />
              ITMS
            </div>
            {["Dashboard", "Profile", "Daily Records", "Summaries", "Settings"].map((item, i) => (
              <div
                key={item}
                className={`mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
                  i === 0
                    ? "bg-blue-500/10 text-slate-900 dark:bg-blue-500/20 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    i === 0 ? "bg-blue-500 dark:bg-blue-400" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                />
                {item}
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 p-4">
            <div className="mb-3 flex items-center justify-end gap-2 text-[10px] text-slate-600 dark:text-slate-300">
              <span className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-300 to-orange-500" />
              Nuel
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Good morning, Nuel 👋</p>
            <p className="mb-3 text-[10px] text-slate-500 dark:text-slate-400">
              Here&apos;s your training progress at a glance.
            </p>

            <div className="grid grid-cols-4 gap-2">
              <StatTile value="12" label="Total Entries" accent="bg-violet-500/70" />
              <StatTile value="5" label="This Week" accent="bg-blue-500/70" />
              <StatTile value="3" label="Departments" accent="bg-indigo-500/70" />
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 dark:border-emerald-400/20 dark:bg-emerald-500/15">
                <span className="mb-2 block h-5 w-5 rounded-md bg-emerald-500/70 dark:bg-emerald-400/70" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">On Track</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Progress</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
              <div className="col-span-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#0c1b30]">
                <div className="mb-2 flex justify-between text-[10px]">
                  <span className="font-medium text-slate-900 dark:text-white">Recent Activity</span>
                  <span className="text-blue-600 dark:text-blue-400">View all</span>
                </div>
                <ul className="space-y-2">
                  {ENTRIES.map((e) => (
                    <li key={e.date} className="flex gap-2">
                      <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-blue-500/20 dark:bg-blue-500/25" />
                      <div className="min-w-0">
                        <p className="truncate text-[9px] text-slate-700 dark:text-slate-200">{e.text}</p>
                        <p className="text-[8px] text-slate-400 dark:text-slate-500">{e.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#0c1b30]">
                <p className="mb-2 text-[10px] font-medium text-slate-900 dark:text-white">Your Progress</p>
                <div className="relative mx-auto h-16 w-16">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden="true">
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" className="stroke-slate-200 dark:stroke-white/10" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="64 94"
                      className="stroke-cyan-500 dark:stroke-cyan-400"
                    />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-900 dark:text-white">
                    68%
                  </span>
                </div>
                <p className="mt-1 text-center text-[9px] text-slate-600 dark:text-slate-300">Training Complete</p>
                <div className="mt-2 flex h-8 items-end gap-1">
                  {BARS.map((h, i) => (
                    <span
                      key={i}
                      className="w-full rounded-sm bg-cyan-500/60 dark:bg-cyan-400/60"
                      style={{ height: `${(h / 52) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div
        className="absolute bottom-0 right-0 w-[190px] rounded-[2rem] border-2 border-cyan-500/30 bg-white p-3 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)] dark:border-cyan-300/30 dark:bg-[#0a1628] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
        style={{ transform: "rotate(6deg)" }}
      >
        <div className="mb-2 flex items-center justify-between text-[8px] text-slate-600 dark:text-slate-300">
          <span>9:41</span>
          <span className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
        <p className="text-[10px] font-semibold text-slate-900 dark:text-white">ITMS</p>
        <p className="mt-2 text-[11px] font-semibold text-slate-900 dark:text-white">Good morning, Nuel 👋</p>
        <p className="mb-2 text-[8px] text-slate-500 dark:text-slate-400">
          Here&apos;s your training progress at a glance.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["12", "Total Entries"],
            ["5", "This Week"],
            ["3", "Departments"],
            ["On Track", "Progress"],
          ].map(([v, l], i) => (
            <div
              key={l}
              className={`rounded-lg p-2 ${
                i === 3 ? "bg-emerald-500/10 dark:bg-emerald-500/15" : "bg-slate-100 dark:bg-[#0e2038]"
              }`}
            >
              <p className="text-xs font-semibold text-slate-900 dark:text-white">{v}</p>
              <p className="text-[8px] text-slate-500 dark:text-slate-400">{l}</p>
            </div>
          ))}
        </div>
        <p className="mb-1.5 mt-3 text-[9px] font-medium text-slate-900 dark:text-white">Recent Activity</p>
        <div className="space-y-1.5">
          {ENTRIES.slice(0, 2).map((e) => (
            <div key={e.date} className="rounded-md bg-slate-100 p-1.5 dark:bg-[#0c1b30]">
              <p className="truncate text-[8px] text-slate-700 dark:text-slate-200">{e.text}</p>
              <p className="text-[7px] text-slate-400 dark:text-slate-500">{e.date}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-around border-t border-slate-200 pt-2 text-[8px] text-slate-500 dark:border-white/5 dark:text-slate-400">
          <span className="text-blue-600 dark:text-blue-400">Home</span>
          <span>Records</span>
          <span>Profile</span>
        </div>
      </div>

      {/* Handwritten tagline */}
      <p
        className="absolute -top-2 right-0 hidden text-right text-2xl leading-tight text-cyan-700 dark:text-cyan-200/90 xl:block"
        style={{ fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive", transform: "rotate(-8deg)" }}
        aria-hidden="true"
      >
        Log.
        <br />
        Track.
        <br />
        Grow!
      </p>
    </div>
  );
}

// The wrapper's width/height match the scaled scene at each breakpoint
// (640 x 500 multiplied by the same scale), so the layout reserves the right space.
function DashboardMockup() {
  return (
    <div className="mx-auto h-[210px] w-[269px] min-[400px]:h-[270px] min-[400px]:w-[346px] min-[480px]:h-[330px] min-[480px]:w-[422px] min-[560px]:h-[400px] min-[560px]:w-[512px] sm:h-[450px] sm:w-[576px] lg:mx-0 lg:h-[500px] lg:w-[640px]">
      <MockupScene />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-700 transition-colors dark:bg-[#050d1a] dark:text-slate-200">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 85% 20%, rgba(37,99,235,0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 0%, rgba(20,184,166,0.12), transparent 70%)",
        }}
      />

      <LandingHeader />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-12 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300">
              <Bolt className="h-4 w-4" />
              Smarter Records. Better Decisions.
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl dark:text-white">
              Your Industrial
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-500">
                Training, Digitally.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
              ITMS replaces the paper logbook with one place to hold your profile, your daily activity
              records, and a running history you can hand to a supervisor without digging through old
              notes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <FileIcon className="h-5 w-5" />
                Create Your Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden="true">
                {[
                  "from-amber-300 to-orange-500",
                  "from-sky-300 to-blue-600",
                  "from-rose-300 to-pink-600",
                  "from-emerald-300 to-teal-600",
                ].map((g) => (
                  <span
                    key={g}
                    className={`h-8 w-8 rounded-full border-2 border-slate-50 bg-gradient-to-br dark:border-[#050d1a] ${g}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Trusted by students across multiple departments
              </p>
            </div>
          </div>

          {/* Visible on every screen size: scaled down on phones */}
          <div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative border-t border-slate-200 bg-white/70 dark:border-white/5 dark:bg-[#071120]/70"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:gap-0">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex gap-5 md:px-8 ${
                i > 0 ? "md:border-l md:border-slate-200 dark:md:border-white/10" : "md:pl-0"
              }`}
            >
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ring-1 ${f.tone}`}>
                <FeatureIcon name={f.icon} className="h-7 w-7" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built for your growth */}
      <section id="about" className="relative mx-auto max-w-7xl px-6 py-16">
        <div
          id="how-it-works"
          className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[320px_1fr] dark:border-white/10 dark:bg-[#071526] dark:shadow-none"
        >
          {/* Swap this placeholder for a real <Image /> if you have a photo */}
          <div
            aria-hidden="true"
            className="min-h-[180px] bg-gradient-to-br from-slate-300 via-slate-200 to-white dark:from-slate-700 dark:via-slate-900 dark:to-[#071526]"
          />

          <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-medium tracking-wide text-emerald-600 dark:text-emerald-300">
                Built for your growth
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Simple. Focused. Reliable.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                ITMS is designed for students, by students — clean, fast, and easy to use, so you can focus
                on what really matters: your training.
              </p>
            </div>

            <ul className="space-y-4 md:border-l md:border-slate-200 md:pl-8 dark:md:border-white/10">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-slate-200 px-6 py-8 text-center text-xs text-slate-500 dark:border-white/5">
        ITMS — IT Management System
      </footer>
    </div>
  );
}