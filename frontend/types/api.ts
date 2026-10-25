// These mirror the Pydantic schemas in the ITMS backend (app/schemas) exactly.
// If the backend schema changes, update the matching type here.

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// app/schemas/user.py -> ProfileBase / ProfileCreate / ProfileUpdate / UserProfileResponse
export interface Profile {
  id: number;
  user_id: number;
  mat_no: string;
  school_name: string;
  faculty: string | null;
  department: string | null;
  course: string;
  level: number | null;
  institution: string;
  duration: string | null;
}

export type ProfileCreatePayload = {
  mat_no: string;
  school_name: string;
  faculty?: string | null;
  department?: string | null;
  course: string;
  level?: number | null;
  institution: string;
  duration?: string | null;
};

// Every field optional: PUT /users/myprofile only changes what you send.
export type ProfileUpdatePayload = Partial<ProfileCreatePayload>;

// app/schemas/log.py -> LogEntry / LogUpdate / LogResponse
export interface LogCreatePayload {
  daily_activity: string;
  // Optional ISO datetime string. Backend defaults to "now" on the server when omitted.
  date?: string;
}

export type LogUpdatePayload = Partial<LogCreatePayload>;

export interface LogEntryResponse {
  id: number;
  user_id: number;
  daily_activity: string | null;
  // NOTE: the backend serializes this as a human-readable string
  // (e.g. "Monday, 28 September 2026"), not an ISO date. It cannot be
  // reliably parsed back into a Date on the frontend - see lib/api.ts.
  date: string;
}

// app/schemas/log.py -> SummaryResponse / SummaryUpdate
export type SummaryInterval = "weekly" | "monthly";

export interface Summary {
  id: number;
  column_name: string;
  interval_type: SummaryInterval;
  start_date: string;
  end_date: string;
  summary_text: string;
}

export interface SummaryGenerateParams {
  interval_type: SummaryInterval;
  start_date: string;
  end_date?: string;
  overwrite?: boolean;
}

export interface SummaryUpdatePayload {
  summary_text: string;
}
