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

// Returns the backend base URL prefix for raw fetch() calls (e.g. file uploads).
// In dev: returns "" so requests stay relative and go through the Vite /api proxy.
// In prod: returns the configured API_BASE_URL.
export const getBackendUrl = (): string => {
  return API_BASE_URL || "";
};

const getUrl = (url: string) => url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

// simple API wrapper with auth token injection and error handling
export const api = {
  async publicGet(url: string) {
    try {
      const res = await fetch(getUrl(url), {
        headers: { Accept: "application/json" },
        cache: "default",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP error! status: ${res.status}` };
      }
      return data || { success: true };
    } catch (e: any) {
      console.error("Public API GET failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },

  async get(url: string) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(getUrl(url), { headers });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP error! status: ${res.status}` };
      }
      return data || { success: true };
    } catch (e: any) {
      console.error("API GET failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },

  async post(url: string, data: any) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(getUrl(url), {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const dataJson = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: dataJson?.error || `HTTP error! status: ${res.status}` };
      }
      return dataJson || { success: true };
    } catch (e: any) {
      console.error("API POST failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },

  async put(url: string, data?: any) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(getUrl(url), {
        method: "PUT",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      const dataJson = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: dataJson?.error || `HTTP error! status: ${res.status}` };
      }
      return dataJson || { success: true };
    } catch (e: any) {
      console.error("API PUT failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },

  async delete(url: string) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(getUrl(url), {
        method: "DELETE",
        headers,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP error! status: ${res.status}` };
      }
      return data || { success: true };
    } catch (e: any) {
      console.error("API DELETE failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },
};
