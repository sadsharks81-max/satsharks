import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { api, resolveImageUrl } from "../../services/api";
import { EmptyState } from "../../components/ui/EmptyState";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

function AdminPayments() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProofs = async () => {
    setLoading(true);
    const res = await api.get("/api/payment/proofs");
    if (res.success) {
      setProofs(res.proofs || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this payment? This will upgrade the student's subscription to PAID and delete this proof image to save storage space.")) return;
    
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await api.put(`/api/payment/proofs/${id}/approve`);
      if (res.success) {
        setMessage({ type: "success", text: "Payment approved successfully. Student account upgraded!" });
        setProofs((prev) => prev.filter((p) => p._id !== id));
      } else {
        setMessage({ type: "error", text: res.error || "Failed to approve payment." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this payment? This will delete the uploaded proof screenshot file and clear the request.")) return;

    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await api.put(`/api/payment/proofs/${id}/reject`);
      if (res.success) {
        setMessage({ type: "success", text: "Payment proof rejected and deleted." });
        setProofs((prev) => prev.filter((p) => p._id !== id));
      } else {
        setMessage({ type: "error", text: res.error || "Failed to reject payment." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminLayout activeItem="/admin/payments">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payment Verification</h1>
          <p className="text-on-surface-variant text-sm mt-1">Review manual transactions, upgrade student profiles, and clear uploads</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-success/10 text-success border-success/20" 
            : "bg-error/10 text-error border-error/20"
        }`}>
          <Icon name={message.type === "success" ? "check_circle" : "error"} className="shrink-0" />
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading pending proofs...</div>
      ) : proofs.length === 0 ? (
        <EmptyState 
          icon="payments" 
          title="No pending payments" 
          description="All manual transfers have been verified and upgraded." 
        />
      ) : (
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="p-4 font-semibold">Student Name & Email</th>
                <th className="p-4 font-semibold">Plan Detail</th>
                <th className="p-4 font-semibold">Method & Amount</th>
                <th className="p-4 font-semibold">Screenshot Receipt</th>
                <th className="p-4 font-semibold">Date Submitted</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {proofs.map((p) => (
                <tr key={p._id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-sm">{p.user?.name || "Deleted User"}</div>
                    <div className="text-xs text-on-surface-variant">{p.user?.email || "N/A"}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm text-on-surface">{p.planName}</div>
                    <div className="text-xs text-on-surface-variant/80 mt-0.5">Plan code: <span className="font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-[11px]">{p.planId}</span></div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm text-primary">{p.amount}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5 font-semibold flex items-center gap-1">
                      <Icon name="payments" className="text-sm" />
                      {p.paymentMethod}
                    </div>
                  </td>
                  <td className="p-4">
                    <div 
                      onClick={() => setSelectedImage(p.screenshotUrl)}
                      className="w-16 h-16 rounded-lg border border-outline-variant/30 overflow-hidden bg-surface-container-low cursor-pointer hover:opacity-80 hover:border-primary transition-all flex items-center justify-center relative group"
                      title="Click to view full image"
                    >
                      <img 
                        src={resolveImageUrl(p.screenshotUrl)} 
                        alt="Receipt proof"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="zoom_in" className="text-white text-lg" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">
                    {new Date(p.createdAt).toLocaleDateString()}
                    <div className="text-[10px]">{new Date(p.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(p._id)}
                        disabled={actionLoadingId !== null}
                        className="px-3 py-1.5 bg-success/10 text-success hover:bg-success/20 disabled:opacity-50 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Icon name="done" className="text-sm" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        disabled={actionLoadingId !== null}
                        className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 disabled:opacity-50 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Icon name="close" className="text-sm" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-surface-container-lowest rounded-2xl overflow-hidden p-2 flex flex-col cursor-default" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer z-10"
            >
              <Icon name="close" className="text-xl" />
            </button>
            <div className="overflow-auto flex items-center justify-center bg-slate-900 rounded-xl max-h-[85vh]">
              <img 
                src={resolveImageUrl(selectedImage)} 
                alt="Receipt Full View" 
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="py-2.5 px-4 text-center">
              <p className="text-xs text-on-surface-variant font-mono">
                Click outside or the close button to return
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
