import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate sending email
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background animate-fade-up">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em]">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Enter your email to receive a reset link
            </p>
          </div>
          {submitted ? (
            <div className="text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
              </div>
              <p className="text-sm text-on-surface">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
              </p>
              <Link to="/auth/login" className="block w-full">
                <Button variant="outline" className="w-full">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
          {!submitted && (
            <p className="mt-6 text-center text-sm text-on-surface-variant">
              Remembered your password?{" "}
              <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
