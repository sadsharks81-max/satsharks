import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== "ADMIN") return <Navigate to="/" />;
  return <>{children}</>;
}

export function PaidRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user || user.subscription !== "PAID") return <div className="p-8 text-center">Upgrade required to access this content.</div>;
  return <>{children}</>;
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (user) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} />;
  return <>{children}</>;
}
