"use client";

import { InputHTMLAttributes, ReactNode, useId, useState } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  icon: "mail" | "lock" | "user";
  error?: string;
  hint?: string;
};

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  mail: (
    <Glyph>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Glyph>
  ),
  lock: (
    <Glyph>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Glyph>
  ),
  user: (
    <Glyph>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </Glyph>
  ),
};

export function AuthField({ label, icon, error, hint, type = "text", required, ...rest }: Props) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-100">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          {ICONS[icon]}
        </span>

        <input
          id={id}
          type={isPassword && show ? "text" : type}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          {...rest}
          className={`h-12 w-full rounded-lg border bg-white pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-[#0a1a30] dark:text-white dark:placeholder:text-slate-500 ${
            isPassword ? "pr-11" : "pr-4"
          } ${
            error
              ? "border-red-400 focus:ring-red-400/30 dark:border-red-400/60"
              : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-500/30 dark:border-cyan-400/20 dark:focus:border-cyan-400"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 dark:hover:text-slate-200"
          >
            <Glyph>
              {show ? (
                <>
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 6.1A9.7 9.7 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.4 7.6A17 17 0 0 0 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8" />
                  <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                </>
              )}
            </Glyph>
          </button>
        )}
      </div>

      {(error || hint) && (
        <p
          id={`${id}-msg`}
          className={`mt-1.5 text-xs ${error ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function AuthSubmit({ loading, children }: { loading?: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}