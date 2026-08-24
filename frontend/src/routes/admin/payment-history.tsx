import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";

export const Route = createFileRoute("/admin/payment-history")({
  component: PaymentHistory,
});

type PaymentStatus = "APPROVED" | "REJECTED";

interface PaymentRecord {
  _id: string;
  user?: { name?: string; email?: string } | null;
  userName?: string;
  userEmail?: string;
  planId: string;
  planName: string;
  amount: string;
  paymentMethod: string;
  status: PaymentStatus;
  processedBy?: { name?: string; email?: string } | null;
  processedAt?: string;
  createdAt: string;
}

function PaymentHistory() {
  const { user, isLoading: authLoading } = useAuth();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | PaymentStatus>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const isPrimaryAdmin = user?.email?.trim().toLowerCase() === "admin@satsharks.com";

  useEffect(() => {
    if (authLoading) return;
    if (!isPrimaryAdmin) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api.get("/api/payment/history").then((res) => {
      if (cancelled) return;
      if (res.success) setRecords(res.records || []);
      else setError(res.error || "Could not load payment records.");
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isPrimaryAdmin]);

  const filteredRecords = useMemo(
    () => records.filter((record) => filter === "ALL" || record.status === filter),
    [filter, records],
  );

  const deleteRecord = async (record: PaymentRecord) => {
    const customer = record.user?.email || record.userEmail || "this user";
    if (!confirm(`Permanently delete the ${record.status.toLowerCase()} payment record for ${customer}?`)) return;

    setDeletingId(record._id);
    const res = await api.delete(`/api/payment/history/${record._id}`);
    setDeletingId(null);
    if (res.success) {
      setRecords((current) => current.filter((item) => item._id !== record._id));
    } else {
      alert(res.error || "Could not delete this payment record.");
    }
  };

  return (
    <AdminLayout activeItem="/admin/payment-history">
      {!authLoading && !isPrimaryAdmin ? (
        <div className="rounded-xl border border-error/20 bg-error/10 p-6 text-center font-semibold text-error">
          Payment Records are available only to admin@satsharks.com.
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Payment Records</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Approved and declined payment metadata. Receipt screenshots are deleted when a payment is processed and are never shown here.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {(["ALL", "APPROVED", "REJECTED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === status
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {status === "REJECTED" ? "Declined" : status === "ALL" ? "All records" : "Approved"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4 text-sm font-semibold text-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-on-surface-variant">Loading payment records...</div>
          ) : filteredRecords.length === 0 ? (
            <EmptyState
              icon="receipt_long"
              title="No payment records"
              description="Processed payments will appear here after another administrator approves or declines them."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest shark-shadow">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant/40 bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Plan</th>
                    <th className="p-4 font-semibold">Payment</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Processed by</th>
                    <th className="p-4 font-semibold">Processed</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-surface-container-low/50">
                      <td className="p-4">
                        <div className="text-sm font-semibold">{record.user?.name || record.userName || "Deleted user"}</div>
                        <div className="text-xs text-on-surface-variant">{record.user?.email || record.userEmail || "Email unavailable"}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-semibold">{record.planName}</div>
                        <div className="text-xs text-on-surface-variant">{record.planId}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-primary">{record.amount}</div>
                        <div className="text-xs text-on-surface-variant">{record.paymentMethod}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={record.status === "APPROVED" ? "success" : "error"}>
                          {record.status === "APPROVED" ? "Approved" : "Declined"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{record.processedBy?.name || "Administrator"}</div>
                        <div className="text-xs text-on-surface-variant">{record.processedBy?.email || "—"}</div>
                      </td>
                      <td className="p-4 text-sm text-on-surface-variant">
                        {record.processedAt ? new Date(record.processedAt).toLocaleString() : "—"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteRecord(record)}
                          disabled={deletingId === record._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-error/10 px-3 py-1.5 text-xs font-bold text-error transition-colors hover:bg-error/20 disabled:opacity-50"
                        >
                          <Icon name="delete" className="text-base" />
                          {deletingId === record._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
