import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { api } from "../../services/api";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPassword,
  // The emailed link carries ?token=...; validate lazily so a missing token
  // produces an inline message rather than a route-level crash.
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // This handler previously navigated straight to /auth/login without calling
  // anything, so the password was never actually changed.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!token) {
      setError("This reset link is invalid. Please request a new one.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/auth/reset-password/confirm", { token, password });
      if (!res.success) {
        setError(res.error || "Unable to update your password. Please request a new link.");
        return;
      }
      navigate({ to: "/auth/login" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background animate-fade-up">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em]">
              Set New Password
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Please enter your new password below
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              error={error}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-on-surface-variant">
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Return to login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
