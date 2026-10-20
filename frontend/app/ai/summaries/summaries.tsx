"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Alert, EmptyState, ErrorState, Spinner } from "@/components/ui/Feedback";
import { accentLink, bodyText, dangerLink, divider, faintText, pageSub, pageTitle } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { Summary } from "@/types/api";

// useSearchParams needs a Suspense boundary in the App Router.
export default function SummariesHistoryPage() {
  return (
    <Suspense fallback={null}>
      <SummariesHistory />
    </Suspense>
  );
}

function SummariesHistory() {
  const { isReady } = useRequireAuth();
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const editIdFromUrl = editParam && !Number.isNaN(Number(editParam)) ? Number(editParam) : null;
  const handledEditParam = useRef(false);

  const [summaries, setSummaries] = useState<Summary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      setSummaries(await api.summaries.list());
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Couldn't load your summaries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isReady) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Arriving from an "Edit" link on the AI Assistant page: open that summary for editing.
  useEffect(() => {
    if (handledEditParam.current || !summaries || editIdFromUrl === null) return;
    handledEditParam.current = true;

    (async () => {
      let target = summaries.find((s) => s.id === editIdFromUrl);
      if (!target) {
        try {
          target = await api.summaries.get(editIdFromUrl);
        } catch (err) {
          setRowError(err instanceof ApiError ? err.message : "Couldn't open that summary.");
          return;
        }
      }
      startEdit(target);
      setTimeout(() => {
        document
          .getElementById(`summary-${editIdFromUrl}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaries, editIdFromUrl]);

  function startEdit(s: Summary) {
    setEditingId(s.id);
    setEditText(s.summary_text);
    setRowError(null);
  }

  async function saveEdit(id: number) {
    if (!editText.trim()) return;
    setSavingEdit(true);
    setRowError(null);
    try {
      const updated = await api.summaries.update(id, { summary_text: editText.trim() });
      setSummaries((prev) => (prev ? prev.map((s) => (s.id === id ? updated : s)) : prev));
      setEditingId(null);
    } catch (err) {
      setRowError(err instanceof ApiError ? err.message : "Couldn't save your edit.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this summary? This can't be undone.")) return;
    setDeletingId(id);
    setRowError(null);
    try {
      await api.summaries.remove(id);
      setSummaries((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
    } catch (err) {
      setRowError(err instanceof ApiError ? err.message : "Couldn't delete that summary.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!isReady) return null;

  return (
    <AppShell>
      <Link href="/ai" className={`text-sm ${accentLink}`}>
        ← Back to AI Assistant
      </Link>
      <h1 className={`mt-3 ${pageTitle}`}>Past summaries</h1>
      <p className={pageSub}>Every summary you&apos;ve generated.</p>

      <div className="mt-6">
        {loading && <Spinner label="Loading your summaries…" />}
        {!loading && loadError && <ErrorState message={loadError} onRetry={load} />}

        {!loading && !loadError && summaries && summaries.length === 0 && (
          <EmptyState
            title="No summaries yet"
            description="Generate your first one on the AI Assistant page."
          />
        )}

        {!loading && !loadError && summaries && summaries.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b1a2e] dark:shadow-none">
            {rowError && (
              <div className={`border-b p-3 ${divider}`}>
                <Alert tone="error">{rowError}</Alert>
              </div>
            )}
            <ul>
              {summaries.map((s) => (
                <li
                  key={s.id}
                  id={`summary-${s.id}`}
                  className={`border-b px-6 py-4 last:border-b-0 ${divider}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className={`font-mono text-xs ${faintText}`}>
                      {s.interval_type} · {s.start_date} — {s.end_date}
                    </p>
                    {editingId !== s.id && (
                      <div className="flex shrink-0 gap-3">
                        <button onClick={() => startEdit(s)} className={`text-xs ${accentLink}`}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingId === s.id}
                          className={`text-xs ${dangerLink} disabled:opacity-50`}
                        >
                          {deletingId === s.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === s.id ? (
                    <div className="mt-2">
                      <Textarea label="Summary" value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          onClick={() => saveEdit(s.id)}
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
                    <p className={`mt-2 whitespace-pre-wrap text-sm ${bodyText}`}>{s.summary_text}</p>
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