import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { H as Header } from "./Header-BhkqVqMe.js";
import { F as Footer } from "./Footer-CN17TUqH.js";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/dashboard/tests", label: "Diagnostic Tests", icon: "quiz" },
  { to: "/dashboard/history", label: "Test History", icon: "history" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "insights" }
];
function StudentLayout({ children, activeItem }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant font-semibold", children: "Loading..." }) });
  }
  if (!user || user.role !== "STUDENT") {
    return /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-error font-semibold", children: "Unauthorized. Students only." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-on-background flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex max-w-[1400px] mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("aside", { className: "w-64 border-r border-outline-variant/30 p-6 hidden md:block", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold mb-6 text-on-surface-variant uppercase tracking-widest text-xs", children: "Student Portal" }),
        /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: navItems.map((item) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            className: `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeItem === item.to ? "bg-primary/10 text-primary font-semibold" : "hover:bg-surface-container-low text-on-surface-variant"}`,
            children: [
              /* @__PURE__ */ jsx(Icon, { name: item.icon, className: "text-[20px]" }),
              item.label
            ]
          },
          item.to
        )) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-6 lg:p-10", children })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  StudentLayout as S
};
