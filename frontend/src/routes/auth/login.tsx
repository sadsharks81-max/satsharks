import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email && password) {
      const loginError = await login(email, password);
      if (loginError) {
        setError(loginError);
        return;
      }

      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background animate-fade-up">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em]">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Log in to continue your SAT prep journey
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm font-medium text-error">
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="font-mono text-[12px] uppercase tracking-[0.08em] text-primary hover:text-primary-container transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link to="/auth/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
