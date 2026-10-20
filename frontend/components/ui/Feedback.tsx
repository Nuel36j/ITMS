export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-8 text-sm text-ink-soft">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-ink-soft border-t-transparent"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    error: "border-rust/30 bg-rust-light text-rust",
    success: "border-stamp/30 bg-stamp-light text-stamp-dark",
    info: "border-brass/30 bg-brass-light text-ink",
  }[tone];
  return (
    <div className={`rounded-sm border px-3 py-2 text-sm ${styles}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-sm border border-rust/30 bg-rust-light px-4 py-4 text-sm text-rust">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="font-medium underline underline-offset-2 hover:text-rust/80">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-sm border border-dashed border-ink/20 px-6 py-10 text-left">
      <p className="font-serif text-lg text-ink">{title}</p>
      {description && <p className="text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  );
}
