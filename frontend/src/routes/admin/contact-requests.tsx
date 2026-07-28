import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/admin/contact-requests")({
  component: AdminContactRequests,
});

function AdminContactRequests() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.role === "ADMIN") {
      api.get("/api/contact").then((res) => {
        if (res.success) setInquiries(res.inquiries || []);
      });
    }
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const res = await api.put(`/api/contact/${id}/status`, { status });
    if (res.success) {
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    }
  };

  const submitReply = async (id: string, currentStatus: string) => {
    const text = replyTexts[id];
    if (!text) return;
    const res = await api.put(`/api/contact/${id}/status`, { status: currentStatus, adminReply: text });
    if (res.success) {
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, adminReply: text, status: res.inquiry?.status || "RESOLVED" } : i)));
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const statusVariant = (s: string): "error" | "warning" | "success" => {
    if (s === "NEW") return "error";
    if (s === "IN_PROGRESS") return "warning";
    return "success";
  };

  return (
    <AdminLayout activeItem="/admin/contact-requests">
      <h1 className="text-3xl font-bold mb-8">Contact Inquiries</h1>

      {inquiries.length === 0 ? (
        <EmptyState icon="mail" title="No inquiries yet" description="Contact form submissions will appear here" />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry: any) => (
            <div key={inquiry._id} className="rounded-xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow hover-lift">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {inquiry.firstName} {inquiry.lastName}
                    </h3>
                    <Badge variant={statusVariant(inquiry.status || "NEW")}>
                      {inquiry.status || "NEW"}
                    </Badge>
                  </div>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1">
                    <Icon name="mail" className="text-[14px]" /> {inquiry.email}
                  </p>
                  <p className="mt-2 font-medium text-sm">
                    <Badge variant="info">{inquiry.category}</Badge>
                  </p>
                  <p className="mt-3 text-sm text-on-surface leading-relaxed">{inquiry.message}</p>
                  <p className="mt-2 text-xs text-on-surface-variant">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={inquiry.status || "NEW"}
                  onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                  className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              
              {inquiry.adminReply ? (
                <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Admin Reply</h4>
                  <p className="text-sm text-on-surface">{inquiry.adminReply}</p>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <textarea
                    placeholder="Type your reply here..."
                    className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm outline-none resize-none focus:border-primary"
                    rows={2}
                    value={replyTexts[inquiry._id] || ""}
                    onChange={(e) => setReplyTexts({ ...replyTexts, [inquiry._id]: e.target.value })}
                  />
                  <button
                    onClick={() => submitReply(inquiry._id, inquiry.status || "NEW")}
                    disabled={!replyTexts[inquiry._id]}
                    className="self-end px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
