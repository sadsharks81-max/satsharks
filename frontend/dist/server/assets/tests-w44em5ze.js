import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { S as StudentLayout } from "./StudentLayout-BRfqHLM0.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { E as EmptyState } from "./EmptyState-CLtSl-5O.js";
import { a as api } from "./router-Be_1-VPB.js";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import "./Header-BhkqVqMe.js";
import "./Footer-CN17TUqH.js";
import "@tanstack/react-query";
function TestList() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  useEffect(() => {
    api.get("/api/tests").then((res) => {
      if (res.success) setTests(res.tests || []);
      setLoading(false);
    });
  }, []);
  const filteredTests = filter === "ALL" ? tests : tests.filter((t) => t.section === filter);
  const handleStart = async (testId, accessLevel) => {
    if (accessLevel === "PAID" && user?.subscription === "FREE") return;
    const res = await api.post(`/api/tests/${testId}/start`, {});
    if (res.success) {
      navigate({
        to: `/dashboard/take-test/${res.attempt._id}`,
        search: {
          testId
        }
      });
    }
  };
  const sectionLabel = (s) => {
    if (s === "READING_WRITING") return "Reading & Writing";
    if (s === "MATH") return "Math";
    return "Full Test";
  };
  return /* @__PURE__ */ jsxs(StudentLayout, { activeItem: "/dashboard/tests", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "Diagnostic Tests" }),
    /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mb-8", children: "Challenge yourself with timed diagnostic tests" }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-8 flex-wrap", children: ["ALL", "READING_WRITING", "MATH", "FULL"].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(s), className: `px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === s ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"}`, children: s === "ALL" ? "All" : sectionLabel(s) }, s)) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading tests..." }) : filteredTests.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: "quiz", title: "No tests available", description: "Check back later for new diagnostic tests" }) : /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredTests.map((test) => {
      const locked = test.accessLevel === "PAID" && user?.subscription === "FREE";
      return /* @__PURE__ */ jsxs("div", { className: `rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow flex flex-col hover-lift ${locked ? "opacity-70" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsx(Badge, { variant: test.section === "MATH" ? "info" : test.section === "READING_WRITING" ? "accent" : "success", children: sectionLabel(test.section) }),
          locked ? /* @__PURE__ */ jsxs(Badge, { variant: "warning", children: [
            /* @__PURE__ */ jsx(Icon, { name: "lock", className: "text-[12px] mr-1" }),
            " PAID"
          ] }) : /* @__PURE__ */ jsx(Badge, { variant: "success", children: "FREE" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: test.title }),
        test.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mb-4 line-clamp-2", children: test.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-on-surface-variant mb-6 mt-auto", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Icon, { name: "help_center", className: "text-[16px]" }),
            test.questionCount ?? test.totalMarks,
            " questions"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Icon, { name: "timer", className: "text-[16px]" }),
            test.timeLimit,
            " min"
          ] }),
          (test.attemptCount ?? 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Icon, { name: "check_circle", className: "text-[16px] text-primary" }),
            "Taken ",
            test.attemptCount,
            "x"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleStart(test._id, test.accessLevel), disabled: locked, className: `w-full py-3 rounded-xl text-sm font-semibold transition-all ${locked ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed" : "btn-shimmer bg-primary text-on-primary shark-shadow hover:bg-accent cursor-pointer"}`, children: locked ? "Upgrade to Access" : "Start Test" })
      ] }, test._id);
    }) })
  ] });
}
export {
  TestList as component
};
