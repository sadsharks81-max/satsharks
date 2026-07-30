import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "../common/Icon";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/dashboard/practice", label: "Practice Questions", icon: "fitness_center" },
  { to: "/dashboard/sat-tests", label: "Digital SAT Practice Tests", icon: "school" },
  { to: "/dashboard/vocabulary", label: "Vocab Mastery", icon: "spellcheck" },
  { to: "/dashboard/history", label: "Test History", icon: "history" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "insights" },
  { to: "/dashboard/leaderboard", label: "Leaderboard", icon: "emoji_events" },
  { to: "/dashboard/study-materials", label: "Study Materials", icon: "menu_book" },
  { to: "/dashboard/live-classes", label: "Live Classes", icon: "video_camera_front" },
];

export function StudentLayout({ children, activeItem }: { children: ReactNode; activeItem: string }) {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-surface-variant font-semibold">Loading...</div>
      </div>
    );
  }

  // Redirect if logged in as admin/teacher but somehow here
  if (user && user.role !== "STUDENT" && user.role !== "ADMIN") {
    return <div className="p-8 text-center text-error font-semibold">Unauthorized. Students only.</div>;
  }

  const isGuest = !user;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative">
      <Header />
      
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden border-b border-outline-variant/30 bg-surface px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">Student Menu</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-lg border border-outline-variant/30"
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-[16px]" />
          {navItems.find(item => activeItem === item.to || activeItem.startsWith(item.to + "/"))?.label || "Menu"}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <nav className="md:hidden border-b border-outline-variant/30 bg-surface-container-lowest p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
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
      )}

      <div className="flex-1 flex max-w-[1400px] mx-auto w-full relative">
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
        
        {/* Main Content Area: Blurred if Guest */}
        <main className={`flex-1 p-6 lg:p-10 transition-all duration-300 ${isGuest ? "blur-[5px] select-none pointer-events-none" : ""}`}>
          {children}
        </main>
      </div>

      {/* Guest Block Overlay */}
      {isGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[3px] p-4">
          <div className="bg-surface border border-outline-variant/50 max-w-md w-full rounded-2xl p-8 text-center shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Icon name="lock" className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-3">Unlock Your Student Dashboard</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Create an account or log in to get access to all our premium features including diagnostic tests, personalized analytics, practice questions, and live classes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth/login"
                className="flex-1 py-3 text-center bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-outline-variant/30"
              >
                Log In
              </Link>
              <Link
                to="/auth/register"
                className="flex-1 py-3 text-center bg-primary hover:bg-accent text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
