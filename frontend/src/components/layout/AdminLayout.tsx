import { ReactNode, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "../common/Icon";
import { api } from "../../services/api";

interface AdminNavItem {
  to: string;
  label: string;
  icon: string;
  primaryOnly?: boolean;
}

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/users", label: "Users", icon: "group" },
  { to: "/admin/student-progress", label: "Student Progress", icon: "monitoring" },
  { to: "/admin/payments", label: "Payments", icon: "payments" },
  { to: "/admin/payment-history", label: "Payment Records", icon: "receipt_long", primaryOnly: true },
  { to: "/admin/tests", label: "Tests", icon: "quiz" },
  { to: "/admin/questions", label: "Questions", icon: "help_center" },
  { to: "/admin/vocabulary", label: "Vocabulary", icon: "spellcheck" },
  { to: "/admin/uploads", label: "Test & Question Uploads", icon: "upload_file" },
  { to: "/admin/success-stories", label: "Success Stories", icon: "social_leaderboard" },
  { to: "/admin/contact-requests", label: "Queries", icon: "mail" },
  { to: "/admin/essays", label: "Essays", icon: "edit_note" },
  { to: "/admin/consulting", label: "Consulting", icon: "account_balance" },
  { to: "/admin/universities", label: "Universities", icon: "school" },
  { to: "/admin/study-materials", label: "Study Materials", icon: "menu_book" },
  { to: "/admin/reports", label: "Reported Issues", icon: "report_problem" },
  { to: "/admin/classes", label: "Live Classes", icon: "video_camera_front" },
  { to: "/admin/settings", label: "Site Settings", icon: "settings" },
] as const satisfies readonly AdminNavItem[];

export function AdminLayout({ children, activeItem = "" }: { children: ReactNode; activeItem?: string }) {
  const { user, isLoading } = useAuth();
  const [reportCount, setReportCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const visibleNavItems = navItems.filter(
    (item) =>
      !("primaryOnly" in item) ||
      !item.primaryOnly ||
      user?.email?.trim().toLowerCase() === "admin@satsharks.com",
  );

  useEffect(() => {
    if (user?.role === "ADMIN") {
      api.get("/api/reports/count").then((res) => {
        if (res.success) setReportCount(res.count);
      }).catch(() => {});
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-surface-variant font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <div className="p-8 text-center text-error font-semibold">Unauthorized. Admins only.</div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden border-b border-outline-variant/30 bg-surface px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">Admin Menu</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-lg border border-outline-variant/30"
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-[16px]" />
          {visibleNavItems.find(item => activeItem === item.to)?.label || "Menu"}
        </button>
      </div>
      {mobileMenuOpen && (
        <nav className="md:hidden border-b border-outline-variant/30 bg-surface-container-lowest p-4 space-y-1">
          {visibleNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeItem === item.to
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon} className="text-[20px]" />
                {item.label}
              </div>
              {item.to === "/admin/reports" && reportCount > 0 && (
                <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {reportCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      )}
      <main className="flex-1 flex max-w-[1400px] mx-auto w-full">
        <aside className="w-64 border-r border-outline-variant/30 p-6 hidden md:block">
          <h2 className="font-bold mb-6 text-on-surface-variant uppercase tracking-widest text-xs">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  activeItem === item.to
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} className="text-[20px]" />
                  {item.label}
                </div>
                {item.to === "/admin/reports" && reportCount > 0 && (
                  <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {reportCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0 p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
