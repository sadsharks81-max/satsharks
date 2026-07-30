import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "../common/Icon";

const navItems = [
  { to: "/teacher", label: "Dashboard", icon: "dashboard" },
  { to: "/teacher/classes", label: "Live Classes", icon: "video_camera_front" },
  { to: "/teacher/practice", label: "Practice Questions", icon: "fitness_center" },
  { to: "/teacher/sat-tests", label: "Digital SAT Practice Tests", icon: "school" },
  { to: "/teacher/student-progress", label: "Student Progress", icon: "monitoring" },
  { to: "/teacher/study-materials", label: "Study Materials", icon: "menu_book" },
];

export function TeacherLayout({ children, activeItem }: { children: ReactNode; activeItem: string }) {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-surface-variant font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "TEACHER") {
    return <div className="p-8 text-center text-error font-semibold">Unauthorized. Teachers only.</div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden border-b border-outline-variant/30 bg-surface px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">Teacher Menu</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-lg border border-outline-variant/30"
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-[16px]" />
          {navItems.find(item => activeItem === item.to)?.label || "Menu"}
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
      <main className="flex-1 flex max-w-[1400px] mx-auto w-full">
        <aside className="w-64 border-r border-outline-variant/30 p-6 hidden md:block">
          <h2 className="font-bold mb-6 text-on-surface-variant uppercase tracking-widest text-xs">
            Teacher Panel
          </h2>
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
        <div className="flex-1 min-w-0 p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
