"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Alert, EmptyState, ErrorState, Spinner } from "@/components/ui/Feedback";
import {
  accentLink,
  bodyText,
  card,
  dangerLink,
  divider,
  faintText,
  pageSub,
  pageTitle,
  sectionTitle,
} from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { Summary, SummaryInterval } from "@/types/api";

const subscribeToNoChanges = () => () => {};

// Shared look for the native select and date inputs
const fieldControl =
  "h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-cyan-400/20 dark:bg-[#0a1a30] dark:text-white dark:[color-scheme:dark] dark:focus:border-cyan-400";
const fieldLabel = "text-sm font-medium text-slate-800 dark:text-slate-100";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Parse "YYYY-MM-DD" as a local date (new Date("YYYY-MM-DD") would be UTC and can shift a day).
function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getCurrentWeekMonday() {
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return formatDate(monday);
}

// Suggested end date for a start date + interval:
// weekly = 6 days counting the start day, monthly = last day of the start date's month.
function getDefaultEndDate(start: string, interval: SummaryInterval) {
  if (!start) return "";
  const date = parseDate(start);
  if (interval === "weekly") {
    date.setDate(date.getDate() + 5);
    return formatDate(date);
  }
  return formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

const getServerStartDate = () => "";

export default function AiAssistantPage() {
  const { isReady } = useRequireAuth();
  const router = useRouter();

  // Only the most recent summary is shown here; the full list lives on /ai/history.
  const [latest, setLatest] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [interval, setInterval_] = useState<SummaryInterval>("weekly");
  const defaultStartDate = useSyncExternalStore(
    subscribeToNoChanges,
    getCurrentWeekMonday,
    getServerStartDate,
  );
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const startDate = selectedStartDate ?? defaultStartDate;

  // null = follow the suggested end date; a string = the user picked one manually.
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const endDate = selectedEndDate ?? getDefaultEndDate(startDate, interval);
  const endBeforeStart = !!startDate && !!endDate && endDate < startDate;

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Set when the backend says a summary already exists for the chosen period (409).
  const [duplicate, setDuplicate] = useState<{ id: number; message: string } | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await api.summaries.list();
      setLatest(list[0] ?? null);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Couldn't load your latest summary.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isReady) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function runGenerate(overwrite: boolean) {
    if (endBeforeStart) {
      setGenerateError("The end date can't be earlier than the start date.");
      return;
    }
    setGenerateError(null);
    setDuplicate(null);
    setGenerating(true);
    try {
      const summary = await api.summaries.generate({
        interval_type: interval,
        start_date: startDate,
        end_date: endDate,
        overwrite,
      });
      // The summary just generated becomes the "latest" one shown below.
      setLatest(summary);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && err.duplicateSummaryId !== undefined) {
        setDuplicate({ id: err.duplicateSummaryId, message: err.message });
      } else if (err instanceof ApiError && err.status === 404) {
        setGenerateError(`No logged activities found between ${startDate} and ${endDate}.`);
      } else if (err instanceof ApiError && err.status === 503) {
        setGenerateError("AI assistant not available at the moment");
      } else {
        setGenerateError(err instanceof ApiError ? err.message : "Couldn't generate a summary.");
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this summary? This can't be undone.")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.summaries.remove(id);
      const list = await api.summaries.list(); // shows the previous summary, if any
      setLatest(list[0] ?? null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete that summary.");
    } finally {
      setDeleting(false);
    }
  }

  if (!isReady) return null;

  return (
    <AppShell>
      <h1 className={pageTitle}>AI Assistant</h1>
      <p className={pageSub}>
        Generate a written summary of your recent activities using a locally running model.
      </p>

      <div className={`mt-6 ${card}`}>
        {generateError && (
          <div className="mb-3">
            <Alert tone="error">{generateError}</Alert>
          </div>
        )}
        {duplicate && (
          <div className={`mb-4 rounded-xl border bg-slate-50 p-4 dark:bg-white/5 ${divider}`}>
            <p className={`text-sm ${bodyText}`}>
              {duplicate.message} You can edit it yourself, or have the AI regenerate it.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/ai/history?edit=${duplicate.id}`)}
                className="px-3 py-1.5 text-xs"
              >
                Edit existing summary
              </Button>
              <Button
                type="button"
                onClick={() => runGenerate(true)}
                loading={generating}
                className="px-3 py-1.5 text-xs"
              >
                Regenerate (replaces your current text)
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDuplicate(null)}
                className="px-3 py-1.5 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="interval" className={fieldLabel}>
              Interval
            </label>
            <select
              id="interval"
              value={interval}
              onChange={(e) => {
                setInterval_(e.target.value as SummaryInterval);
                setSelectedEndDate(null);
                setDuplicate(null);
              }}
              className={fieldControl}
            >
              <option value="weekly">Weekly (6 days)</option>
              <option value="monthly">Monthly (calendar month)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="start-date" className={fieldLabel}>
              Start date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setSelectedStartDate(e.target.value);
                setSelectedEndDate(null);
                setDuplicate(null);
              }}
              required
              className={fieldControl}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="end-date" className={fieldLabel}>
              End date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => {
                setSelectedEndDate(e.target.value);
                setDuplicate(null);
              }}
              required
              aria-invalid={endBeforeStart}
              className={`${fieldControl} aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-400/30`}
            />
          </div>
          <Button
            onClick={() => runGenerate(false)}
            loading={generating}
            disabled={!startDate || !endDate || endBeforeStart}
          >
            {generating ? "Generating…" : "Generate summary"}
          </Button>
        </div>
        <p className={`mt-3 text-xs ${endBeforeStart ? "text-red-600 dark:text-red-400" : faintText}`}>
          {endBeforeStart
            ? "The end date can't be earlier than the start date."
            : "The end date is filled in from the interval; change it to cover a custom range."}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className={sectionTitle}>Latest summary</h2>
          <Link href="/ai/history" className={`text-sm ${accentLink}`}>
            View past summaries →
          </Link>
        </div>

        <div className="mt-3">
          {loading && <Spinner label="Loading your latest summary…" />}
          {!loading && loadError && <ErrorState message={loadError} onRetry={load} />}

          {!loading && !loadError && !latest && (
            <EmptyState
              title="No summaries yet"
              description="Generate your first one above once you've logged a few activities."
            />
          )}

          {!loading && !loadError && latest && (
            <div className={card}>
              {deleteError && (
                <div className="mb-3">
                  <Alert tone="error">{deleteError}</Alert>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <p className={`font-mono text-xs ${faintText}`}>
                  {latest.interval_type} · {latest.start_date} — {latest.end_date}
                </p>
                <div className="flex shrink-0 gap-3">
                  <Link href={`/ai/history?edit=${latest.id}`} className={`text-xs ${accentLink}`}>
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
              <p className={`mt-2 whitespace-pre-wrap text-sm ${bodyText}`}>{latest.summary_text}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}