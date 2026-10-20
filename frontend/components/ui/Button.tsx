import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-[#17333f] hover:bg-accent-dark",
  secondary: "border border-ink/20 text-ink bg-surface hover:bg-paper",
  ghost: "text-ink-soft hover:text-ink hover:bg-ink/5",
  danger: "bg-rust text-white hover:bg-rust/90",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, className = "", children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
