import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";

export const Route = createFileRoute("/admin/reports/")({
  component: ReportsDashboard,
});

function ReportsDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const query = filter !== "ALL" ? `?status=${filter}` : "";
        const res = await api.get(`/api/reports${query}`);
        if (res.success) {
          setReports(res.reports);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [filter]);

  const handleDeleteResolved = async (report: any) => {
    if (report.status !== "RESOLVED") return;
    if (!confirm("Permanently delete this resolved issue? This cannot be undone.")) return;
    setDeletingReportId(report._id);
    const res = await api.delete(`/api/reports/${report._id}`);
    setDeletingReportId(null);
    if (res.success) {
      setReports((previous) => previous.filter((item) => item._id !== report._id));
    } else {
      alert(res.error || "Failed to delete resolved issue.");
    }
  };

  return (
    <AdminLayout activeItem="/admin/reports">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background mb-2 tracking-tight">Reported Issues</h1>
            <p className="text-on-surface-variant text-sm max-w-2xl">
              Manage and resolve issues reported by students regarding practice and test questions.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/30 shark-shadow">
            {["ALL", "OPEN", "RESOLVED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <Icon name="check_circle" className="text-4xl text-success mb-4 opacity-50" />
              <p className="text-lg font-bold text-on-surface mb-2">No reported issues</p>
              <p className="text-sm text-on-surface-variant">Everything looks good! No reports matching your filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-container-low/50 text-xs uppercase font-bold text-on-surface-variant tracking-wider border-b border-outline-variant/40">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Reported By</th>
                    <th className="px-6 py-4">Question ID</th>
                    <th className="px-6 py-4 w-full">Reason</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <Badge variant={report.status === "OPEN" ? "warning" : "success"}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-on-surface">{report.reportedBy?.name || "Unknown"}</div>
                        <div className="text-xs text-on-surface-variant">{report.reportedBy?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                        {report.question?._id || "Deleted"}
                      </td>
                      <td className="px-6 py-4 whitespace-normal max-w-sm">
                        <p className="line-clamp-2 text-sm text-on-surface" title={report.reason}>
                          {report.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to="/admin/reports/$id"
                            params={{ id: report._id }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors font-semibold text-xs"
                          >
                            <Icon name="visibility" className="text-[14px]" />
                            Review
                          </Link>
                          {report.status === "RESOLVED" && (
                            <button
                              onClick={() => handleDeleteResolved(report)}
                              disabled={deletingReportId === report._id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-error/10 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/20 disabled:opacity-50"
                            >
                              <Icon name="delete" className="text-[14px]" />
                              {deletingReportId === report._id ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
  );
}
