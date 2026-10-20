export function Wordmark({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "light";
}) {
  const light = tone === "light";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 items-center justify-center rounded-md border ${
          light ? "border-white/25 text-accent" : "border-rule text-stamp"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2ZM12 6v14" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-xl ${light ? "text-white" : "text-ink"}`}>ITMS</span>
        <span className={`mt-0.5 text-[9px] font-medium uppercase tracking-[0.14em] ${light ? "text-white/60" : "text-ink-faint"}`}>
          Training logbook
        </span>
      </span>
    </span>
  );
}