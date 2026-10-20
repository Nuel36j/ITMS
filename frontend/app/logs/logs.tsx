"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Alert, EmptyState, ErrorState, Spinner } from "@/components/ui/Feedback";
import { accentLink, bodyText, card, dangerLink, faintText, pageSub, pageTitle, sectionTitle } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { LogEntryResponse } from "@/types/api";

// YYYY-MM-DD in the user's local time
function todayLocal() {
  return new Date().toLocaleDateString("en-CA");
}

export default function LogsPage() {
  const { isReady } = useRequireAuth();

  // Only the most recent entry is shown here; the full list lives on /logs/history.
  const [latest, setLatest] = useState<LogEntryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newActivity, setNewActivity] = useState("");
  const [newDate, setNewDate] = useState(todayLocal);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function loadLatest() {
    setLoading(true);
    setError(null);
    try {
      const list = await api.logs.list({ limit: 1 });
      setLatest(list[0] ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load your latest activity.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isReady) loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Refetch quietly (no spinner) after create/delete.
  // The backend returns `date` as a display string, so we can't sort or
  // compare it locally. Refetch instead.
  async function refreshLatest() {
    try {
      const list = await api.logs.list({ limit: 1 });
      setLatest(list[0] ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't refresh your activities.");
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!newActivity.trim() || !newDate) return;
    setCreateError(null);
    setCreating(true);
    try {
      await api.logs.create({
        daily_activity: newActivity.trim(),
        date: newDate,
      });
      setNewActivity("");
      await refreshLatest();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "Couldn't save that activity.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this activity? This can't be undone.")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.logs.remove(id);
      await refreshLatest(); // shows the previous entry, if any
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete that activity.");
    } finally {
      setDeleting(false);
    }
  }

  if (!isReady) return null;

  return (
    <AppShell>
      <h1 className={pageTitle}>Activities</h1>
      <p className={pageSub}>Your daily industrial training record.</p>

      <form onSubmit={handleCreate} className={`mt-6 ${card}`}>
        {createError && (
          <div className="mb-3">
            <Alert tone="error">{createError}</Alert>
          </div>
        )}
        <Input
          label="Date of entry"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          max={todayLocal()}
          className="mb-3 max-w-[10rem]"
          required
        />
        <Textarea
          label="What did you work on today?"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="e.g. Reviewed pull requests and fixed a login bug."
          required
        />
        <Button type="submit" loading={creating} className="mt-3">
          {creating ? "Adding…" : "Add activity"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className={sectionTitle}>Latest entry</h2>
          <Link href="/logs/history" className={`text-sm ${accentLink}`}>
            View past logs →
          </Link>
        </div>

        <div className="mt-3">
          {loading && <Spinner label="Loading your latest activity…" />}
          {!loading && error && <ErrorState message={error} onRetry={loadLatest} />}

          {!loading && !error && !latest && (
            <EmptyState
              title="No activities recorded yet"
              description="Add your first entry above to start building your history."
            />
          )}

          {!loading && !error && latest && (
            <div className={card}>
              {deleteError && (
                <div className="mb-3">
                  <Alert tone="error">{deleteError}</Alert>
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className={`font-mono text-xs ${faintText}`}>{latest.date}</p>
                  <p className={`mt-1 text-sm ${bodyText}`}>{latest.daily_activity}</p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Link href={`/logs/history?edit=${latest.id}`} className={`text-xs ${accentLink}`}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(latest.id)}
                    disabled={deleting}
                    className={`text-xs ${dangerLink} disabled:opacity-50`}
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}