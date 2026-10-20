"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Alert, EmptyState, ErrorState, Spinner } from "@/components/ui/Feedback";
import { accentLink, bodyText, dangerLink, divider, faintText, pageSub, pageTitle } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { LogEntryResponse } from "@/types/api";

// useSearchParams needs a Suspense boundary in the App Router.
export default function LogsHistoryPage() {
  return (
    <Suspense fallback={null}>
      <LogsHistory />
    </Suspense>
  );
}

function LogsHistory() {
  const { isReady } = useRequireAuth();
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const editIdFromUrl = editParam && !Number.isNaN(Number(editParam)) ? Number(editParam) : null;
  const handledEditParam = useRef(false);

  const [logs, setLogs] = useState<LogEntryResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterDate, setFilterDate] = useState("");
  const [filtering, setFiltering] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  async function loadAll() {
    setFilterDate("");
    setLoading(true);
    setError(null);
    try {
      setLogs(await api.logs.list({ limit: 100 }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load your activities.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isReady) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Arriving from the "Edit" link on the Activities page: open that entry for editing.
  useEffect(() => {
    if (handledEditParam.current || !logs || editIdFromUrl === null) return;
    handledEditParam.current = true;
    const target = logs.find((l) => l.id === editIdFromUrl);
    if (!target) return;
    startEdit(target);
    setTimeout(() => {
      document.getElementById(`log-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, editIdFromUrl]);

  async function handleFilter(e: FormEvent) {
    e.preventDefault();
    if (!filterDate) return loadAll();
    setFiltering(true);
    setError(null);
    try {
      setLogs(await api.logs.byDate(filterDate));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't filter your activities.");
    } finally {
      setFiltering(false);
    }
  }

  function startEdit(log: LogEntryResponse) {
    setEditingId(log.id);
    setEditText(log.daily_activity ?? "");
    setRowError(null);
  }

  async function saveEdit(id: number) {
    if (!editText.trim()) return;
    setSavingEdit(true);
    setRowError(null);
    try {
      const updated = await api.logs.update(id, { daily_activity: editText.trim() });
      setLogs((prev) => (prev ? prev.map((l) => (l.id === id ? updated : l)) : prev));
      setEditingId(null);
    } catch (err) {
      setRowError(err instanceof ApiError ? err.message : "Couldn't update that activity.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this activity? This can't be undone.")) return;
    setDeletingId(id);
    setRowError(null);
    try {
      await api.logs.remove(id);
      setLogs((prev) => (prev ? prev.filter((l) => l.id !== id) : prev));
    } catch (err) {
      setRowError(err instanceof ApiError ? err.message : "Couldn't delete that activity.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!isReady) return null;

  return (
    <AppShell>
      <Link href="/logs" className={`text-sm ${accentLink}`}>
        ← Back to Activities
      </Link>
      <h1 className={`mt-3 ${pageTitle}`}>Past logs</h1>
      <p className={pageSub}>Every activity you&apos;ve recorded.</p>

      <form onSubmit={handleFilter} className="mt-6 flex flex-wrap items-end gap-3">
        <Input
          label="Filter by date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="max-w-[10rem]"
        />
        <Button type="submit" variant="secondary" loading={filtering}>
          Apply
        </Button>
        {filterDate && (
          <Button type="button" variant="ghost" onClick={loadAll}>
            Clear filter
          </Button>
        )}
      </form>

      <div className="mt-6">
        {loading && <Spinner label="Loading your activities…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadAll} />}

        {!loading && !error && logs && logs.length === 0 && (
          <EmptyState
            title="No activities found"
            description="Add entries on the Activities page to build your history."
          />
        )}

        {!loading && !error && logs && logs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b1a2e] dark:shadow-none">
            {rowError && (
              <div className={`border-b p-3 ${divider}`}>
                <Alert tone="error">{rowError}</Alert>
              </div>
            )}
            <ul>
              {logs.map((log) => (
                <li
                  key={log.id}
                  id={`log-${log.id}`}
                  className={`flex items-start justify-between gap-4 border-b px-6 py-4 last:border-b-0 ${divider}`}
                >
                  {editingId === log.id ? (
                    <div className="flex-1">
                      <Textarea
                        label="Edit activity"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          onClick={() => saveEdit(log.id)}
                          loading={savingEdit}
                          className="px-3 py-1.5 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className={`font-mono text-xs ${faintText}`}>{log.date}</p>
                        <p className={`mt-1 text-sm ${bodyText}`}>{log.daily_activity}</p>
                      </div>
                      <div className="flex shrink-0 gap-3">
                        <button onClick={() => startEdit(log)} className={`text-xs ${accentLink}`}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={deletingId === log.id}
                          className={`text-xs ${dangerLink} disabled:opacity-50`}
                        >
                          {deletingId === log.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}