import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Icon } from "../../components/common/Icon";
import { Button } from "../../components/ui/Button";
import { api } from "../../services/api";
import { ConsultingRequest } from "../../types";

export const Route = createFileRoute("/admin/consulting")({
  component: AdminConsulting,
});

function AdminConsulting() {
  const queryClient = useQueryClient();
  const [selectedReq, setSelectedReq] = useState<ConsultingRequest | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-consulting"],
    queryFn: async () => {
      const res = await api.get("/api/consulting/admin/all");
      if (!res.success) throw new Error(res.error);
      return res.data as ConsultingRequest[];
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center rounded-full bg-surface-container-highest px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">Pending</span>;
      case "IN_REVIEW":
        return <span className="inline-flex items-center rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-medium text-on-secondary-container">In Review</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center rounded-full bg-primary-container px-2.5 py-0.5 text-xs font-medium text-on-primary-container">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Consulting Requests</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Manage student profiles submitted for consulting.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-lowest text-on-surface-variant">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Student</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">GPA / SAT</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Grade</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Date</th>
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
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    No consulting requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="transition-colors hover:bg-surface-container-lowest/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{(req.student as any)?.name || "Unknown"}</div>
                      <div className="text-xs text-on-surface-variant">{(req.student as any)?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-on-surface">
                        {req.level === "GRADUATE" 
                          ? `GPA: ${req.gpa}` 
                          : `Sec: ${req.secondaryType} | High: ${req.higherType}`}
                      </div>
                      <div className="font-mono text-xs text-on-surface-variant">SAT: {req.satScore}</div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{req.gradeYear}</td>
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" onClick={() => setSelectedReq(req)} className="h-8 px-3 text-xs">
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReq && (
        <ReviewReqModal 
          req={selectedReq} 
          onClose={() => setSelectedReq(null)}
          onSuccess={() => {
            setSelectedReq(null);
            queryClient.invalidateQueries({ queryKey: ["admin-consulting"] });
          }}
        />
      )}
    </AdminLayout>
  );
}

function ReviewReqModal({ req, onClose, onSuccess }: { req: ConsultingRequest, onClose: () => void, onSuccess: () => void }) {
  const [status, setStatus] = useState(req.status);
  const [adminNotes, setAdminNotes] = useState(req.adminNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.put(`/api/consulting/admin/${req._id}`, {
        status,
        adminNotes
      });
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
            <h2 className="font-display text-xl font-bold text-on-surface">Review Consulting Profile</h2>
            <p className="text-xs text-on-surface-variant">{(req.student as any)?.name}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {req.level === "GRADUATE" ? (
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">GPA</p>
                  <p className="font-display text-2xl font-bold text-primary">{req.gpa}</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Sec: {req.secondaryType.replace("_", "-")}</p>
                    <p className="font-display text-xl font-bold text-primary">
                      {req.secondaryType === "MATRIC" && req.secondaryTotal 
                        ? `${req.secondaryObtained} / ${req.secondaryTotal} (${((req.secondaryObtained! / req.secondaryTotal!) * 100).toFixed(1)}%)`
                        : req.secondaryGrades}
                    </p>
                  </div>
                  <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">High: {req.higherType.replace("_", "-")}</p>
                    <p className="font-display text-xl font-bold text-primary">
                      {req.higherType === "FSC" && req.higherTotal 
                        ? `${req.higherObtained} / ${req.higherTotal} (${((req.higherObtained! / req.higherTotal!) * 100).toFixed(1)}%)`
                        : req.higherGrades}
                    </p>
                  </div>
                </>
              )}
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">SAT Score</p>
                <p className="font-display text-2xl font-bold text-primary">{req.satScore}</p>
              </div>
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Grade</p>
                <p className="font-display text-lg font-bold text-primary">{req.gradeYear}</p>
              </div>
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Budget</p>
                <p className="font-display text-sm font-bold text-primary mt-1">{req.budgetRange}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant mb-2">Target Universities</h3>
              <div className="flex flex-wrap gap-2">
                {req.targetUniversities.map((uni, idx) => (
                  <span key={idx} className="inline-flex items-center rounded-lg bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                    {uni}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant mb-2">Extracurriculars</h3>
              <p className="text-sm text-on-surface-variant bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 whitespace-pre-wrap">{req.extracurriculars}</p>
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
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
                Admin Private Notes
              </label>
              <textarea
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={12}
                placeholder="Private notes for counselors..."
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none font-body leading-relaxed"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-outline-variant/40 px-6 py-4 shrink-0 flex items-center justify-end gap-3 bg-surface-container-lowest rounded-b-3xl">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Updates"}
          </Button>
        </div>
      </div>
    </div>
  );
}
