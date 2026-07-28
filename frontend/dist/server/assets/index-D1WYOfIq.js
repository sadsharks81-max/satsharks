import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { S as StudentLayout } from "./StudentLayout-BRfqHLM0.js";
import { S as StatCard } from "./StatCard-vGq83LsQ.js";
import { S as ScoreCircle } from "./ScoreCircle-Dj63AhLr.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { a as api } from "./router-Be_1-VPB.js";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "./Footer-CN17TUqH.js";
import "@tanstack/react-query";
function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [predicted, setPredicted] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const [statsRes, predRes] = await Promise.all([api.get("/api/analytics/dashboard"), api.get("/api/analytics/predicted-score")]);
      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentAttempts(statsRes.recentAttempts || []);
      }
      if (predRes.success && predRes.predicted) {
        setPredicted(predRes.predicted);
      }
      setLoading(false);
    };
    load();
  }, []);
  return /* @__PURE__ */ jsxs(StudentLayout, { activeItem: "/dashboard", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8", children: "Student Dashboard" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading your dashboard..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "Tests Taken", value: stats?.totalTests ?? 0, icon: "quiz", color: "primary" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Average Score", value: `${stats?.avgScore ?? 0}%`, icon: "trending_up", color: "secondary" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Best Score", value: `${stats?.bestScore ?? 0}%`, icon: "emoji_events", color: "accent" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Questions Practiced", value: stats?.practiceCount ?? 0, icon: "fitness_center", color: "primary" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-8 mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-6 self-start", children: "Predicted SAT Score" }),
          predicted ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ScoreCircle, { score: predicted.score, label: "Predicted Score", sublabel: `${predicted.range.low} – ${predicted.range.high} range` }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs(Badge, { variant: "info", children: [
                predicted.confidence,
                "% Confidence"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-on-surface-variant", children: [
                "Based on ",
                predicted.basedOn,
                " tests"
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsx(Icon, { name: "psychology", className: "text-4xl text-on-surface-variant/40 mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant", children: "Take a diagnostic test to see your predicted score" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Recent Tests" }),
            /* @__PURE__ */ jsx(Link, { to: "/dashboard/history", className: "text-xs font-bold uppercase tracking-widest text-primary hover:underline", children: "View All" })
          ] }),
          recentAttempts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentAttempts.map((a) => /* @__PURE__ */ jsxs(Link, { to: `/dashboard/test-result/${a._id}`, className: "flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors group", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-semibold text-sm group-hover:text-primary transition-colors", children: [
                "Test #",
                a._id.slice(-6).toUpperCase()
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: new Date(a.createdAt).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs(Badge, { variant: a.percentage >= 70 ? "success" : a.percentage >= 50 ? "warning" : "error", children: [
                a.percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx(Icon, { name: "chevron_right", className: "text-on-surface-variant text-[20px]" })
            ] })
          ] }, a._id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsx(Icon, { name: "assignment", className: "text-4xl text-on-surface-variant/40 mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant", children: "No tests taken yet" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/dashboard/tests", className: "flex items-center gap-4 p-6 rounded-2xl bg-primary text-on-primary shark-shadow hover:-translate-y-1 transition-transform", children: [
          /* @__PURE__ */ jsx(Icon, { name: "quiz", className: "text-[28px]" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Take a Test" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-on-primary/70", children: "Start a diagnostic test" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/dashboard/practice", className: "flex items-center gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shark-shadow hover:-translate-y-1 transition-transform", children: [
          /* @__PURE__ */ jsx(Icon, { name: "fitness_center", className: "text-[28px] text-accent" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Practice Questions" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: "Sharpen your skills" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/dashboard/analytics", className: "flex items-center gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shark-shadow hover:-translate-y-1 transition-transform", children: [
          /* @__PURE__ */ jsx(Icon, { name: "insights", className: "text-[28px] text-secondary" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "View Analytics" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: "Track your progress" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  DashboardHome as component
};
