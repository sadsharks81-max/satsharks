import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Icon } from "../../components/common/Icon";
import { Button } from "../../components/ui/Button";
import { api } from "../../services/api";
import { Essay } from "../../types";

export const Route = createFileRoute("/admin/essays")({
  component: AdminEssays,
});

function AdminEssays() {
  const queryClient = useQueryClient();
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  const { data: essays = [], isLoading } = useQuery({
    queryKey: ["admin-essays"],
    queryFn: async () => {
      const res = await api.get("/api/essays/admin/all");
      if (!res.success) throw new Error(res.error);
      return res.data as Essay[];
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center rounded-full bg-surface-container-highest px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">Pending</span>;
      case "IN_REVIEW":
        return <span className="inline-flex items-center rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-medium text-on-secondary-container">In Review</span>;
      case "REVIEWED":
        return <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent">Reviewed</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Essay Reviews</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Manage and review student essay submissions.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-lowest text-on-surface-variant">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Student</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Target Uni</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Submitted</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    <Icon name="refresh" className="animate-spin text-2xl" />
                  </td>
                </tr>
              ) : essays.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    No essays found.
                  </td>
                </tr>
              ) : (
                essays.map((essay) => (
                  <tr key={essay._id} className="transition-colors hover:bg-surface-container-lowest/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{(essay.student as any)?.name || "Unknown"}</div>
                      <div className="text-xs text-on-surface-variant">{(essay.student as any)?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{essay.type.replace("_", " ")}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{essay.targetUniversity || "-"}</td>
                    <td className="px-6 py-4">{getStatusBadge(essay.status)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{new Date(essay.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" onClick={() => setSelectedEssay(essay)} className="h-8 px-3 text-xs">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEssay && (
        <ReviewEssayModal 
          essay={selectedEssay} 
          onClose={() => setSelectedEssay(null)}
          onSuccess={() => {
            setSelectedEssay(null);
            queryClient.invalidateQueries({ queryKey: ["admin-essays"] });
          }}
        />
      )}
    </AdminLayout>
  );
}

function ReviewEssayModal({ essay, onClose, onSuccess }: { essay: Essay, onClose: () => void, onSuccess: () => void }) {
  const [status, setStatus] = useState(essay.status);
  const [feedback, setFeedback] = useState(essay.adminFeedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.put(`/api/essays/admin/${essay._id}`, {
        status,
        adminFeedback: feedback
      });
      if (res.success) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this essay request?")) return;
    setIsSubmitting(true);
    try {
      const res = await api.delete(`/api/essays/admin/${essay._id}`);
      if (res.success) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-surface shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-4 shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold text-on-surface">Review Essay</h2>
            <p className="text-xs text-on-surface-variant">{(essay.student as any)?.name} • {essay.type.replace("_", " ")}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant mb-3">Student Essay Text</h3>
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-body text-sm leading-relaxed text-on-surface">
              {essay.essayText}
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
                Status
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="REVIEWED">Reviewed</option>
              </select>
            </div>
            
            <div>
              <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
                Expert Feedback
              </label>
              <textarea
                value={feedback} 
                onChange={(e) => setFeedback(e.target.value)}
                rows={12}
                placeholder="Provide detailed feedback here..."
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none font-body leading-relaxed"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-outline-variant/40 px-6 py-4 shrink-0 flex items-center justify-between gap-3 bg-surface-container-lowest rounded-b-3xl">
          <Button variant="outline" className="text-error border-error/50 hover:bg-error/10 hover:text-error" onClick={handleDelete} disabled={isSubmitting}>
            Delete
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
