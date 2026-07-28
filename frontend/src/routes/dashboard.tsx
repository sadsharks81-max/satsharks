import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth/login" />;
  if (user.role === "ADMIN") return <Navigate to="/admin" />;
  return <Outlet />;
}
