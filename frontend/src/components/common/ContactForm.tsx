import { useState } from "react";
import { Icon } from "../common/Icon";
import { Input } from "../ui/Input";
import { api } from "../../services/api";

export function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await api.post("/api/contact/inquiry", {
        firstName,
        lastName,
        email,
        category,
        message,
      });
      if (res.success) {
        setSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        setError(res.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 md:py-28 bg-surface-container-low border-t border-outline-variant/60">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Get in Touch
          </span>
          <h2 className="font-display text-4xl font-extrabold text-primary md:text-5xl leading-tight">
            Have Questions?<br />
            Let’s Connect.
          </h2>
          <div className="h-[2px] w-12 bg-accent" />
          <p className="text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed max-w-md">
            Whether you want to learn more about our course schedules, admission advising modules, or customized prep tools, our SAT Sharks support team is here to assist you.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary border border-outline-variant/40">
                <Icon name="mail" className="text-[20px]" />
              </span>
              <div>
                <h4 className="font-body text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">Email Support</h4>
                <a href="mailto:satsharks@gmail.com" className="font-mono text-sm font-semibold text-primary hover:underline">satsharks@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary border border-outline-variant/40">
                <Icon name="call" className="text-[20px]" />
              </span>
              <div>
                <h4 className="font-body text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">Phone Support</h4>
                <a href="tel:+923164514334" className="font-mono text-sm font-semibold text-primary hover:underline">+92 316 451 4334</a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-2xl bg-surface text-on-surface p-8 md:p-10 shark-shadow border border-outline-variant/40 space-y-6"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline text-2xl font-semibold text-primary">Inquiry Details</h3>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Icon name="chat" className="text-[18px]" />
            </span>
          </div>

          {success && (
            <div className="p-4 bg-primary-container text-on-primary-container rounded-xl text-sm font-semibold flex items-center gap-2 border border-primary/20">
              <Icon name="check_circle" className="text-[18px]" />
              <span>Inquiry sent successfully! Our admin will review and reply soon.</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-error/10 text-error rounded-xl border border-error/30 text-sm flex items-center gap-2">
              <Icon name="warning" className="text-[18px]" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="Jane"
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">
              Inquiry Type
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary focus:shadow-sm"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="SAT Prep Classes">SAT Prep Classes</option>
                <option value="Admission Consulting">Admission Consulting</option>
                <option value="LUMS Counseling">LUMS Counseling</option>
                <option value="Premium Essay Advisory">Premium Essay Advisory</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70">
                <Icon name="unfold_more" className="text-[18px]" />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Write your query or message here..."
              required
              className="w-full rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary focus:shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-shimmer flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-on-primary shark-shadow hover:bg-accent disabled:opacity-50 transition-all cursor-pointer border-none"
          >
            {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
            <Icon name="send" className="text-[16px]" />
          </button>
        </form>
      </div>
    </section>
  );
}
