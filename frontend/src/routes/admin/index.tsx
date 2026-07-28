import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { StatCard } from "../../components/ui/StatCard";
import { api } from "../../services/api";
import type { AdminOverview } from "../../types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/analytics/overview").then((res) => {
      if (res.success) setOverview(res.overview);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout activeItem="/admin">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Total Users" value={overview?.totalUsers ?? 0} icon="group" color="primary" />
            <StatCard label="Paid Users" value={overview?.paidUsers ?? 0} icon="paid" color="accent" />
            <StatCard label="Published Questions" value={overview?.publishedQuestions ?? 0} icon="help_center" color="secondary" />
            <StatCard label="Active Tests" value={overview?.activeTests ?? 0} icon="quiz" color="primary" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Total Attempts" value={overview?.totalAttempts ?? 0} icon="assignment_turned_in" color="primary" />
            <StatCard label="Pending Uploads" value={overview?.pendingUploads ?? 0} icon="upload_file" color="accent" />
            <StatCard label="Pending Inquiries" value={overview?.pendingInquiries ?? 0} icon="mail" color="error" />
            <StatCard label="Success Stories" value={overview?.totalStories ?? 0} icon="social_leaderboard" color="secondary" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction to="/admin/tests" icon="quiz" title="Manage Tests" desc="Create and manage diagnostic tests" />
            <QuickAction to="/admin/questions" icon="help_center" title="Question Bank" desc="Add and organize questions" />
            <QuickAction to="/admin/uploads" icon="upload_file" title="Upload Tests" desc="Upload PDFs and extract questions" />
          </div>
        </>
      )}
    </AdminLayout>
  );
}

import { Link } from "@tanstack/react-router";
import { Icon } from "../../components/common/Icon";

function QuickAction({ to, icon, title, desc }: { to: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shark-shadow hover-lift group"
    >
      <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:bg-primary transition-colors">
        <Icon name={icon} className="text-[24px] text-primary group-hover:text-on-primary transition-colors" />
      </div>
      <div>
        <div className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</div>
        <div className="text-xs text-on-surface-variant">{desc}</div>
      </div>
    </Link>
  );
}
