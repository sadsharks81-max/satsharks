import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { User } from "../types";
import { api, clearStoredToken, getStoredToken, setStoredToken } from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password?: string,
    country?: string,
  ) => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredToken();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      const token = getStoredToken();
      if (token) {
        const res = await api.get("/api/users/me");
        // Guards against a state update after unmount and against a stale
        // response overwriting a newer session.
        if (cancelled) return;
        if (res.success) setUser(res.user as User);
        else logout();
      }
      if (!cancelled) setIsLoading(false);
    };

    void fetchUser();
    return () => {
      cancelled = true;
    };
  }, [logout]);

  useEffect(() => {
    const handleUnauthorized = (e: Event) => {
      const errorText = (e as CustomEvent).detail?.error;
      logout();
      if (errorText === "Session expired: logged in from another device") {
        alert("Your session has expired because this account was logged in from another device.");
      } else {
        alert("Your session has expired. Please log in again.");
      }
      window.location.href = "/auth/login";
    };
    window.addEventListener("unauthorized", handleUnauthorized as EventListener);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized as EventListener);
    };
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.success) {
        setStoredToken(res.accessToken as string);
        setUser(res.user as User);
        return null;
      }
      return res.error || "Invalid email or password.";
    } finally {
      // `finally` so a failure cannot leave the form stuck loading forever.
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password?: string, country?: string) => {
      setIsLoading(true);
      try {
        // A missing password used to silently become the literal "password123",
        // creating a trivially guessable account on a real email address.
        if (!password) return "A password is required.";

        const res = await api.post("/api/auth/register", { name, email, password, country });
        if (res.success) {
          setStoredToken(res.accessToken as string);
          setUser(res.user as User);
          return null;
        }
        return res.error || "Unable to create this account.";
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;
    const res = await api.get("/api/users/me");
    if (res.success) setUser(res.user as User);
  }, []);

  // Memoised so the provider does not hand every consumer a brand new object on
  // each render. Previously any state change here produced a new context value
  // and re-rendered the whole authenticated tree, including the SAT runner.
  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshUser }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
