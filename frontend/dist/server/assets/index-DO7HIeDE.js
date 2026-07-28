import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { S as StatCard } from "./StatCard-vGq83LsQ.js";
import { a as api } from "./router-Be_1-VPB.js";
import { Link } from "@tanstack/react-router";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "@tanstack/react-query";
function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/admin/analytics/overview").then((res) => {
      if (res.success) setOverview(res.overview);
      setLoading(false);
    });
  }, []);
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8", children: "Admin Dashboard" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading dashboard..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "Total Users", value: overview?.totalUsers ?? 0, icon: "group", color: "primary" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Paid Users", value: overview?.paidUsers ?? 0, icon: "paid", color: "accent" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Published Questions", value: overview?.publishedQuestions ?? 0, icon: "help_center", color: "secondary" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Active Tests", value: overview?.activeTests ?? 0, icon: "quiz", color: "primary" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "Total Attempts", value: overview?.totalAttempts ?? 0, icon: "assignment_turned_in", color: "primary" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Pending Uploads", value: overview?.pendingUploads ?? 0, icon: "upload_file", color: "accent" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Pending Inquiries", value: overview?.pendingInquiries ?? 0, icon: "mail", color: "error" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Success Stories", value: overview?.totalStories ?? 0, icon: "social_leaderboard", color: "secondary" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx(QuickAction, { to: "/admin/tests", icon: "quiz", title: "Manage Tests", desc: "Create and manage diagnostic tests" }),
        /* @__PURE__ */ jsx(QuickAction, { to: "/admin/questions", icon: "help_center", title: "Question Bank", desc: "Add and organize questions" }),
        /* @__PURE__ */ jsx(QuickAction, { to: "/admin/uploads", icon: "upload_file", title: "Upload Tests", desc: "Upload PDFs and extract questions" })
      ] })
    ] })
  ] });
}
function QuickAction({
  to,
  icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: "flex items-center gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shark-shadow hover-lift group", children: [
    /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:bg-primary transition-colors", children: /* @__PURE__ */ jsx(Icon, { name: icon, className: "text-[24px] text-primary group-hover:text-on-primary transition-colors" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm group-hover:text-primary transition-colors", children: title }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: desc })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
