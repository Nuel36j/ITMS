import type {
  LogCreatePayload,
  LogEntryResponse,
  LogUpdatePayload,
  ProfileCreatePayload,
  ProfileUpdatePayload,
  Profile,
  RegisterPayload,
  Summary,
  SummaryGenerateParams,
  SummaryUpdatePayload,
  TokenResponse,
  User,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_V1 = `${API_BASE}/api/v1`;

const TOKEN_KEY = "itms_token";

/** Read/write the JWT. Reads from localStorage only in the browser. */
export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

/**
 * Thrown for any non-2xx response. `status` lets callers branch on 401/404/etc.
 * `duplicateSummaryId` is set when POST /summarize/ returns 409 because a summary
 * already exists for the period, so the UI can offer "overwrite" or "edit manually".
 */
export class ApiError extends Error {
  status: number;
  duplicateSummaryId?: number;
  constructor(status: number, message: string, duplicateSummaryId?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.duplicateSummaryId = duplicateSummaryId;
  }
}

// FastAPI error bodies come in two shapes:
//  - HTTPException:                {"detail": "Email already registered"}
//  - Pydantic validation (422):    {"detail": [{"loc": [...], "msg": "...", "type": "..."}]}
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((d) => (d && typeof d === "object" && "msg" in d ? String((d as { msg: unknown }).msg) : null))
        .filter(Boolean);
      if (messages.length) return messages.join(" ");
    }
  }
  return fallback;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // attach Authorization header (default true)
  query?: Record<string, string | number | undefined>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, query } = options;

  let url = `${API_V1}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, String(value));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStore.get();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the ITMS server. Check that the backend is running.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    // Duplicate summary: backend sends {"detail": {"message": "...", "summary_id": 12}}
    const detail =
      data && typeof data === "object" && "detail" in data
        ? (data as { detail: unknown }).detail
        : null;

    if (response.status === 409 && detail && typeof detail === "object" && !Array.isArray(detail)) {
      const d = detail as { message?: string; summary_id?: number };
      throw new ApiError(409, d.message ?? "You already have a summary for this period.", d.summary_id);
    }

    const fallback =
      response.status === 401
        ? "Your session has expired. Please log in again."
        : response.status === 403
          ? "You don't have permission to do that."
          : response.status === 404
            ? "That record couldn't be found."
            : response.status >= 500
              ? "The server ran into a problem. Please try again."
              : "Something went wrong with that request.";
    throw new ApiError(response.status, extractErrorMessage(data, fallback));
  }

  return data as T;
}

/** Login uses OAuth2PasswordRequestForm on the backend: form-encoded, field name "username". */
async function login(email: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  let response: Response;
  try {
    response = await fetch(`${API_V1}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the ITMS server. Check that the backend is running.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, extractErrorMessage(data, "Incorrect email or password."));
  }
  return data as TokenResponse;
}

export const api = {
  auth: {
    login,
    register: (payload: RegisterPayload) =>
      request<User>("/auth/register", { method: "POST", body: payload, auth: false }),
  },
  users: {
    me: () => request<User>("/users/me"),
    getProfile: () => request<Profile>("/users/myprofile"),
    createProfile: (payload: ProfileCreatePayload) =>
      request<Profile>("/users/createprofile", { method: "POST", body: payload }),
    updateProfile: (payload: ProfileUpdatePayload) =>
      request<Profile>("/users/myprofile", { method: "PUT", body: payload }),
  },
  logs: {
    list: (params?: { skip?: number; limit?: number }) =>
      request<LogEntryResponse[]>("/logs/", { query: params }),
    byDate: (isoDate: string) => request<LogEntryResponse[]>(`/logs/by-date/${isoDate}`),
    get: (id: number) => request<LogEntryResponse>(`/logs/${id}`),
    create: (payload: LogCreatePayload) => request<LogEntryResponse>("/logs/", { method: "POST", body: payload }),
    update: (id: number, payload: LogUpdatePayload) =>
      request<LogEntryResponse>(`/logs/${id}`, { method: "PUT", body: payload }),
    remove: (id: number) => request<void>(`/logs/${id}`, { method: "DELETE" }),
  },
  summaries: {
    generate: (params: SummaryGenerateParams) =>
      request<Summary>("/summarize/", {
        method: "POST",
        query: {
          interval_type: params.interval_type,
          start_date: params.start_date,
          overwrite: params.overwrite ? "true" : undefined,
        },
      }),
    list: () => request<Summary[]>("/summaries/"),
    get: (id: number) => request<Summary>(`/summaries/${id}`),
    update: (id: number, payload: SummaryUpdatePayload) =>
      request<Summary>(`/summaries/${id}`, { method: "PUT", body: payload }),
    remove: (id: number) => request<void>(`/summaries/${id}`, { method: "DELETE" }),
  },
};