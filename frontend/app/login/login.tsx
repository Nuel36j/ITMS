"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField, AuthSubmit } from "@/components/auth/AuthField";
import { Alert } from "@/components/ui/Feedback";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  // NOTE: I couldn't see your original login page, so this assumes the same
  // shape as register: `login(email, password)` from useAuth. If yours differs,
  // change only the `login(...)` call inside handleSubmit.
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      mode="login"
      title="Welcome back"
      subtitle="Log in to continue your training journey."
      footer={
        <>
          New to ITMS?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-cyan-300">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {error && <Alert tone="error">{error}</Alert>}

        <AuthField
          label="Email"
          icon="mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="Password"
          icon="lock"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthSubmit loading={submitting}>{submitting ? "Logging in…" : "Log in"}</AuthSubmit>
      </form>
    </AuthShell>
  );
}