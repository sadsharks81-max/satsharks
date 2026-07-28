import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Icon } from "../../components/common/Icon";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Essay } from "../../types";

export const Route = createFileRoute("/dashboard/essays")({
  component: EssaysDashboard,
});

function EssaysDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: essays = [], isLoading } = useQuery({
    queryKey: ["my-essays"],
    queryFn: async () => {
      const res = await api.get("/api/essays/my");
      if (!res.success) throw new Error(res.error);
      return res.data as Essay[];
    },
  });

  const canSubmit = user?.subscription === "PAID" ? essays.length < 7 : essays.length < 2;

  const handleOpenSubmit = () => {
    if (canSubmit) {
      setShowSubmitModal(true);
    }
  };

  return (
    <StudentLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surface">Essay Reviews</h1>
          <p className="mt-1 text-on-surface-variant font-body text-sm">
            Submit your Common App or supplemental essays for expert feedback.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant">
              Usage
            </span>
            <span className="font-bold text-sm text-primary">
              {essays.length} / {user?.subscription === "PAID" ? "7" : "2"}
            </span>
          </div>
          <Button onClick={handleOpenSubmit} disabled={!canSubmit} className="gap-2">
            <Icon name="add" className="text-[18px]" /> Submit Essay
          </Button>
        </div>
      </div>

      {!canSubmit && (
        <div className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
              <Icon name="stars" className="text-[24px]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Review Limit Reached</h3>
              <div className="mt-12 rounded-xl border border-outline-variant/30 bg-surface p-6 text-center shadow-sm">
                <p className="mb-4 text-sm font-medium text-on-surface-variant">Upgrade to our comprehensive essay support package for guaranteed results.</p>
                <Link to="/sat" className="btn-shimmer whitespace-nowrap rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-on-primary">
                  View Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="refresh" className="animate-spin text-4xl text-primary/50" />
        </div>
      ) : essays.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <Icon name="edit_note" className="text-[32px]" />
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface">No essays submitted yet</h3>
          <p className="mt-2 text-on-surface-variant">Submit your first essay to get feedback from our experts.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {essays.map((essay) => (
            <div key={essay._id} className="flex flex-col justify-between rounded-2xl border border-outline-variant/40 bg-surface p-6 shark-shadow hover-lift">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    essay.status === "REVIEWED" ? "bg-accent/20 text-accent" :
                    essay.status === "IN_REVIEW" ? "bg-secondary-container text-on-secondary-container" :
                    "bg-surface-container-highest text-on-surface-variant"
                  }`}>
                    {essay.status.replace("_", " ")}
                  </span>
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    {new Date(essay.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-on-surface line-clamp-1">{essay.targetUniversity || "General/Common App"}</h3>
                <p className="mt-1 font-mono text-xs text-on-surface-variant">{essay.type.replace("_", " ")}</p>
                
                {essay.status === "REVIEWED" && essay.adminFeedback && (
                  <div className="mt-4 rounded-xl bg-surface-container-low p-4 border border-outline-variant/20">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Expert Feedback</p>
                    <p className="text-sm text-on-surface-variant line-clamp-3">{essay.adminFeedback}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSubmitModal && (
        <SubmitEssayModal onClose={() => setShowSubmitModal(false)} onSuccess={() => {
          setShowSubmitModal(false);
          queryClient.invalidateQueries({ queryKey: ["my-essays"] });
        }} />
      )}
    </StudentLayout>
  );
}

function SubmitEssayModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [type, setType] = useState("COMMON_APP");
  const [targetUniversity, setTargetUniversity] = useState("");
  const [essayText, setEssayText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await api.post("/api/essays/submit", {
        type,
        targetUniversity: type === "COMMON_APP" ? "Common App" : targetUniversity,
        essayText
      });

      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || "Failed to submit essay.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface p-6 sm:p-8 shadow-2xl animate-fade-up">
        <button onClick={onClose} className="absolute right-6 top-6 text-on-surface-variant hover:text-on-surface">
          <Icon name="close" className="text-[24px]" />
        </button>
        
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Submit Essay for Review</h2>
        <p className="text-sm text-on-surface-variant mb-6">Paste your essay below to receive detailed feedback from our expert counselors.</p>
        
        {error && (
          <div className="mb-6 rounded-lg bg-error/10 p-4 text-sm text-error flex items-center gap-2">
            <Icon name="error" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
                Essay Type
              </label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="COMMON_APP">Common App</option>
                <option value="SUPPLEMENTAL">Supplemental</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            {type !== "COMMON_APP" && (
              <Input 
                label="Target University" 
                value={targetUniversity} 
                onChange={(e) => setTargetUniversity(e.target.value)} 
                type="text" 
                placeholder="e.g. Yale University" 
                required 
              />
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
              Essay Text
            </label>
            <textarea
              value={essayText} 
              onChange={(e) => setEssayText(e.target.value)}
              rows={12}
              placeholder="Paste your essay here..."
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none font-body leading-relaxed"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Essay"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
