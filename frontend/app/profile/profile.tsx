"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Alert, ErrorState, Spinner } from "@/components/ui/Feedback";
import { bodyText, card, divider, faintText, pageSub, pageTitle, sectionTitle } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { Profile, ProfileCreatePayload } from "@/types/api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const emptyForm: ProfileCreatePayload = {
  mat_no: "",
  school_name: "",
  faculty: "",
  department: "",
  course: "",
  level: undefined,
  institution: "",
  duration: "",
};

export default function ProfilePage() {
  const { user, isReady } = useRequireAuth();

  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileCreatePayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const p = await api.users.getProfile();
      setProfile(p);
      setForm(toForm(p));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setProfile(null);
        setEditing(true); // straight into the create form
      } else {
        setLoadError(err instanceof ApiError ? err.message : "Couldn't load your profile.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isReady) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  function updateField<K extends keyof ProfileCreatePayload>(key: K, value: ProfileCreatePayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const payload = { ...form, level: form.level ? Number(form.level) : undefined };
      const saved = profile ? await api.users.updateProfile(payload) : await api.users.createProfile(payload);
      setProfile(saved);
      setForm(toForm(saved));
      setEditing(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!isReady) return null;

  return (
    <AppShell>
      <h1 className={pageTitle}>Profile</h1>
      <p className={pageSub}>
        {user?.full_name} · {user?.email}
      </p>

      <div className="mt-8 max-w-xl">
        <section className={`mt-6 max-w-xl ${card}`}>
          <h2 className={sectionTitle}>Appearance</h2>
          <p className={`mb-4 mt-1 text-sm ${faintText}`}>Choose how ITMS looks on this device.</p>
          <ThemeToggle variant="switch" className={bodyText} />
        </section>
        {loading && <Spinner label="Loading your profile…" />}
        {!loading && loadError && <ErrorState message={loadError} onRetry={load} />}

        {!loading && !loadError && !editing && profile && (
          <div className={`mt-6 ${card}`}>
            <dl className="space-y-3 text-sm">
              <DL label="Matriculation number" value={profile.mat_no} mono />
              <DL label="Institution" value={profile.institution} />
              <DL label="School" value={profile.school_name} />
              <DL label="Faculty" value={profile.faculty} />
              <DL label="Department" value={profile.department} />
              <DL label="Course" value={profile.course} />
              <DL label="Level" value={profile.level ? String(profile.level) : undefined} />
              <DL label="Duration" value={`${profile.duration} Months`} />
            </dl>
            <Button variant="secondary" className="mt-5" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          </div>
        )}

        {!loading && !loadError && editing && (
          <form onSubmit={handleSubmit} className={`mt-6 ${card}`} noValidate>
            <p className={`mb-4 text-sm ${faintText}`}>
              {profile ? "Update the details below." : "Tell us about your placement to finish setting up."}
            </p>
            {formError && <Alert tone="error">{formError}</Alert>}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                label="Matriculation number"
                required
                value={form.mat_no}
                onChange={(e) => updateField("mat_no", e.target.value)}
              />
              <Input
                label="Institution"
                required
                value={form.institution}
                onChange={(e) => updateField("institution", e.target.value)}
              />
              <Input
                label="School"
                required
                value={form.school_name}
                onChange={(e) => updateField("school_name", e.target.value)}
              />
              <Input
                label="Course of study"
                required
                value={form.course}
                onChange={(e) => updateField("course", e.target.value)}
              />
              <Input
                label="Faculty"
                value={form.faculty ?? ""}
                onChange={(e) => updateField("faculty", e.target.value)}
              />
              <Input
                label="Department"
                value={form.department ?? ""}
                onChange={(e) => updateField("department", e.target.value)}
              />
              <Input
                label="Level"
                type="number"
                min={1}
                max={999}
                value={form.level ?? ""}
                onChange={(e) => updateField("level", e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                label="Duration"
                placeholder="e.g. 6 months"
                value={form.duration ?? ""}
                onChange={(e) => updateField("duration", e.target.value)}
              />
            </div>
            <div className="mt-5 flex gap-3">
              <Button type="submit" loading={saving}>
                {saving ? "Saving…" : "Save profile"}
              </Button>
              {profile && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setForm(toForm(profile));
                    setFormError(null);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}

function toForm(p: Profile): ProfileCreatePayload {
  return {
    mat_no: p.mat_no,
    school_name: p.school_name,
    faculty: p.faculty ?? "",
    department: p.department ?? "",
    course: p.course,
    level: p.level ?? undefined,
    institution: p.institution,
    duration: p.duration ?? "",
  };
}

function DL({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 border-b pb-2 last:border-b-0 last:pb-0 ${divider}`}>
      <dt className={faintText}>{label}</dt>
      <dd className={`text-right ${bodyText} ${mono ? "font-mono" : ""}`}>{value || "—"}</dd>
    </div>
  );
}