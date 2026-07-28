import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "../common/Icon";
import logoImg from "@/assets/logo.png";
import { useAuth } from "../../hooks/useAuth";
import { NotificationBell } from "../common/NotificationBell";

export function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" as any });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", hash: "services", label: "Services" },
    { to: "/university-matcher", hash: undefined, label: "University Matcher" },
    { to: "/sat", hash: "pricing", label: "Pricing" },
    { to: "/contact", hash: undefined, label: "Contact" },
    ...(user?.role === "STUDENT" ? [{ to: "/dashboard/", hash: undefined, label: "Dashboard" }] : []),
    ...(user?.role === "ADMIN" ? [{ to: "/admin", hash: undefined, label: "Admin Panel" }] : []),
    ...(user?.role === "TEACHER" ? [{ to: "/teacher", hash: undefined, label: "Teacher Panel" }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full border-b py-3 md:py-4 ${scrolled
        ? "bg-surface/95 backdrop-blur-md shadow-sm border-outline-variant/20"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]">
          <img src={logoImg} alt="SAT Sharks" className="h-12 md:h-16 w-auto relative -top-1 md:-top-1.5 mix-blend-multiply" />
        </Link>
        <nav className={`hidden items-center ${user ? "gap-4 xl:gap-6" : "gap-8"} lg:flex`}>
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              onClick={(e) => {
                if (l.hash && window.location.pathname === l.to) {
                  const el = document.getElementById(l.hash);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="relative py-1 font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary transition-colors duration-300 group whitespace-nowrap"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className={`hidden lg:flex items-center ${user ? "gap-3 xl:gap-5" : "gap-5"}`}>
          {user ? (
            <div className="flex items-center gap-5">
              <NotificationBell />
              <span className="font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-on-surface whitespace-nowrap">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-[13px] font-bold uppercase tracking-[0.08em] text-on-surface-variant hover:text-accent transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/auth/login"
                className="text-[13px] font-bold uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300"
              >
                Register
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-lg p-2 text-on-surface hover:bg-surface-container-low transition-colors"
          aria-label="menu"
        >
          <Icon name={open ? "close" : "menu"} className="text-[28px]" />
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-outline-variant/40 bg-surface-container-lowest px-6 py-4 space-y-3 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              onClick={(e) => {
                setOpen(false);
                if (l.hash && window.location.pathname === l.to) {
                  setTimeout(() => {
                    const el = document.getElementById(l.hash);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 50);
                }
              }}
              className="block font-mono text-[13px] uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-outline-variant/40 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-left font-mono text-[13px] uppercase tracking-[0.08em] text-on-surface-variant"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-semibold text-on-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
