import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "../common/Icon";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/dashboard/practice", label: "Practice Questions", icon: "fitness_center" },
  { to: "/dashboard/sat-tests", label: "Digital SAT Practice Tests", icon: "school" },
  { to: "/dashboard/history", label: "Test History", icon: "history" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "insights" },
  { to: "/dashboard/leaderboard", label: "Leaderboard", icon: "emoji_events" },
  { to: "/dashboard/study-materials", label: "Study Materials", icon: "menu_book" },
  { to: "/dashboard/live-classes", label: "Live Classes", icon: "video_camera_front" },
];

export function StudentLayout({ children, activeItem }: { children: ReactNode; activeItem: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-surface-variant font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "STUDENT") {
    return <div className="p-8 text-center text-error font-semibold">Unauthorized. Students only.</div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
        <aside className="w-64 border-r border-outline-variant/30 p-6 hidden md:block">
          <div className="mb-6">
            <h2 className="font-bold mb-1.5 text-on-surface-variant uppercase tracking-widest text-xs">
              Student Portal
            </h2>
            {user?.subscription === "PAID" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/25">
                <Icon name="workspace_premium" className="text-xs" /> Premium Member
              </span>
            ) : user?.hasPendingPayment ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/25 animate-pulse">
                <Icon name="hourglass_empty" className="text-xs" /> Pending Approval
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                <Icon name="account_circle" className="text-xs" /> Free Account
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  activeItem === item.to
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <Icon name={item.icon} className="text-[20px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
