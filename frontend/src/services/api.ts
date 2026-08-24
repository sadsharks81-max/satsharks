const configuredApiBaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env && process.env.VITE_API_URL) ||
  "";

const productionApiBaseUrl = "https://backend-production-a4f63.up.railway.app";

export const API_BASE_URL = (
  configuredApiBaseUrl || (import.meta.env.PROD ? productionApiBaseUrl : "")
).replace(/\/$/, "");

export const resolveImageUrl = (url: string) => {
  if (!url) return "";
  // Already a base64 encoded data URL or absolute URL
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http")) return url;
  // In production with explicit backend URL configured, prepend it
  if (API_BASE_URL) return `${API_BASE_URL}${url}`;
  // In dev, the Vite proxy forwards /uploads/* → localhost:5000
  // so keep the path relative and let the proxy do its job
  return url;
};

/**
 * Relative upload paths can come from the shared production database while an
 * administrator is running the frontend/backend locally. In that case the
 * local uploads folder may not contain the Railway-hosted file. Image views can
 * try the normal URL first and then the canonical production backend.
 */
export const resolveImageUrlCandidates = (url: string) => {
  if (!url) return [];
  const primary = resolveImageUrl(url);
  if (!url.startsWith("/")) return [primary];
  return [...new Set([primary, `${productionApiBaseUrl}${url}`])];
};

// Returns the backend base URL prefix for raw fetch() calls (e.g. file uploads).
// In dev: returns "" so requests stay relative and go through the Vite /api proxy.
// In prod: returns the configured API_BASE_URL.
export const getBackendUrl = (): string => {
  return API_BASE_URL || "";
};

const getUrl = (url: string) => (url.startsWith("http") ? url : `${API_BASE_URL}${url}`);

const TOKEN_STORAGE_KEY = "accessToken";

/**
 * localStorage is unavailable during SSR. Every accessor is guarded so a module
 * imported into a server-rendered route cannot throw a ReferenceError, and so a
 * browser with storage disabled degrades to "logged out" instead of crashing.
 */
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* storage disabled , the in-memory session still works for this tab */
  }
};

export const clearStoredToken = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* nothing recoverable to do */
  }
};

/**
 * Response envelope. Every endpoint returns `success` plus an endpoint-specific
 * payload key (`user`, `questions`, `stats`, ...).
 *
 * The index signature is intentionally `any`: callers across the app destructure
 * these payloads directly, and this preserves the contract they were already
 * written against. Narrowing it to `unknown` would be stricter but would require
 * a cast at ~60 call sites, so per-endpoint response types are better introduced
 * incrementally rather than in one sweep.
 */
export interface ApiResult {
  success: boolean;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const checkUnauthorized = (res: Response, data?: { error?: string } | null) => {
  if (res.status === 401) {
    clearStoredToken();
    if (typeof window !== "undefined") {
      const errorMsg = data?.error || "";
      window.dispatchEvent(new CustomEvent("unauthorized", { detail: { error: errorMsg } }));
    }
  }
};

/** Requests that hang forever otherwise leave spinners up indefinitely. */
const DEFAULT_TIMEOUT_MS = 30000;

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  cache?: RequestCache;
  timeoutMs?: number;
}

/**
 * One implementation behind every verb.
 *
 * publicGet/get/post/put/delete were five near-identical 20-line copies of the
 * same fetch-plus-error-shape logic, so a fix (timeouts, token handling, 401
 * handling) had to be applied five times and drifted between them.
 */
const request = async (url: string, options: RequestOptions = {}): Promise<ApiResult> => {
  const { method = "GET", body, auth = true, cache, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  else if (!auth) headers["Accept"] = "application/json";

  if (auth) {
    const token = getStoredToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    // The unauthenticated variant previously sent no Content-Type at all; keep
    // that shape for public GETs so caching behaviour is unchanged.
    if (body === undefined) headers["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(getUrl(url), {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(cache ? { cache } : {}),
      signal: controller.signal,
    });

    const data = (await res.json().catch(() => null)) as ApiResult | null;

    if (!res.ok) {
      if (auth) checkUnauthorized(res, data);
      return { success: false, error: data?.error || `HTTP error! status: ${res.status}` };
    }
    return data || { success: true };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { success: false, error: "The request timed out. Please try again." };
    }
    console.error(`API ${method} failed:`, e);
    return { success: false, error: "Network error: Connection to server failed." };
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Simple API wrapper with auth token injection and error handling.
 *
 * Each method is generic over its response shape (defaulting to the loose
 * envelope) so typed wrappers such as `liveClassApi` can declare precise return
 * types without casting at the call site.
 */
export const api = {
  publicGet: <T = ApiResult>(url: string) =>
    request(url, { auth: false, cache: "default" }) as Promise<T>,
  publicGetFresh: <T = ApiResult>(url: string) =>
    request(url, { auth: false, cache: "no-store" }) as Promise<T>,
  get: <T = ApiResult>(url: string) => request(url) as Promise<T>,
  post: <T = ApiResult>(url: string, data: unknown) =>
    request(url, { method: "POST", body: data ?? {} }) as Promise<T>,
  put: <T = ApiResult>(url: string, data?: unknown) =>
    request(url, { method: "PUT", ...(data !== undefined ? { body: data } : {}) }) as Promise<T>,
  delete: <T = ApiResult>(url: string) => request(url, { method: "DELETE" }) as Promise<T>,
};
