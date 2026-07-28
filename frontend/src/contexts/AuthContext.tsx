import { createContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password?: string, country?: string) => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await api.get("/api/users/me");
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (e) {
          logout();
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await api.post("/api/auth/login", { email, password });
    if (res.success) {
      localStorage.setItem("accessToken", res.accessToken);
      setUser(res.user);
      setIsLoading(false);
      return null;
    }
    setIsLoading(false);
    return res.error || "Invalid email or password.";
  };

  const register = async (name: string, email: string, password?: string, country?: string) => {
    setIsLoading(true);
    const res = await api.post("/api/auth/register", { name, email, password: password || "password123", country });
    if (res.success) {
      localStorage.setItem("accessToken", res.accessToken);
      setUser(res.user);
      setIsLoading(false);
      return null;
    }
    setIsLoading(false);
    return res.error || "Unable to create this account.";
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const res = await api.get("/api/users/me");
        if (res.success) {
          setUser(res.user);
        }
      } catch (e) {
        console.error("Refresh user profile failed:", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
