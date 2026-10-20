"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ErrorState, Spinner } from "@/components/ui/Feedback";
import { accentLink, bodyText, card, divider, faintText, pageSub, pageTitle, sectionTitle } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { LogEntryResponse, Profile } from "@/types/api";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user, isReady } = useRequireAuth();

  const [profile, setProfile] = useState<Profile | null | undefined>(undefined); // undefined = loading
  const [logs, setLogs] = useState<LogEntryResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [profileResult, logsResult] = await Promise.allSettled([
        api.users.getProfile(),
        api.logs.list({ limit: 5 }),
      ]);

      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
      } else if (profileResult.reason instanceof ApiError && profileResult.reason.status === 404) {
        setProfile(null); // no profile yet - not an error
      } else {
        throw profileResult.reason;
      }

      if (logsResult.status === "fulfilled") {
        setLogs(logsResult.value);
      } else {
        throw logsResult.reason;
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load your dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isReady) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  if (!isReady) return null;

  return (
    <AppShell>
      <h1 className={pageTitle}>
        {greeting()}, {user?.full_name?.split(" ")[0] ?? "there"} 👋
      </h1>
      <p className={pageSub}>Here&apos;s where things stand.</p>

      {loading && <Spinner label="Loading your dashboard…" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className={card}>
            <h2 className={sectionTitle}>Profile</h2>
            {profile ? (
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Mat. no." value={profile.mat_no} mono />
                <Row label="Institution" value={profile.institution} />
                <Row label="Course" value={profile.course} />
                {profile.level && <Row label="Level" value={String(profile.level)} />}
              </dl>
            ) : (
              <div className="mt-4">
                <p className={`text-sm ${faintText}`}>You haven&apos;t set up your profile yet.</p>
                <Link href="/profile" className="mt-3 inline-block">
                  <Button variant="secondary">Set up profile</Button>
                </Link>
              </div>
            )}
            {profile && (
              <Link href="/profile" className={`mt-5 inline-block text-sm ${accentLink}`}>
                View full profile →
              </Link>
            )}
          </section>

          <section className={card}>
            <div className="flex items-center justify-between">
              <h2 className={sectionTitle}>Recent activity</h2>
              <Link href="/logs" className={`text-sm ${accentLink}`}>
                View all →
              </Link>
            </div>
            {logs && logs.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm">
                {logs.map((log) => (
                  <li key={log.id} className={`border-b pb-3 last:border-b-0 last:pb-0 ${divider}`}>
                    <p className={`font-mono text-xs ${faintText}`}>{log.date}</p>
                    <p className={`mt-0.5 ${bodyText}`}>{log.daily_activity}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <p className={`text-sm ${faintText}`}>No activities recorded yet.</p>
                <Link href="/logs" className="mt-3 inline-block">
                  <Button variant="secondary">Add your first activity</Button>
                </Link>
              </div>
            )}
          </section>

          <section className={`${card} md:col-span-2`}>
            <h2 className={sectionTitle}>Quick actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/logs">
                <Button variant="secondary">Log today&apos;s activity</Button>
              </Link>
              <Link href="/ai">
                <Button variant="secondary">Generate an AI summary</Button>
              </Link>
              {!profile && (
                <Link href="/profile">
                  <Button variant="primary">Complete your profile</Button>
                </Link>
              )}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={faintText}>{label}</dt>
      <dd className={`text-right ${bodyText} ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}