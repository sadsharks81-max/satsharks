import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { S as StudentLayout } from "./StudentLayout-BRfqHLM0.js";
import { S as ScoreCircle } from "./ScoreCircle-Dj63AhLr.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { d as Route, a as api } from "./router-Be_1-VPB.js";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "./Footer-CN17TUqH.js";
import "@tanstack/react-query";
function SATResult() {
  const {
    attemptId
  } = Route.useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  useEffect(() => {
    api.get(`/api/sat/attempt/${attemptId}`).then((res) => {
      if (res.success) setAttempt(res.attempt);
      setLoading(false);
    });
  }, [attemptId]);
  if (loading) {
    return /* @__PURE__ */ jsx(StudentLayout, { activeItem: "/dashboard/sat-tests", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading results..." }) });
  }
  if (!attempt) {
    return /* @__PURE__ */ jsx(StudentLayout, { activeItem: "/dashboard/sat-tests", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-error", children: "Result not found" }) });
  }
  const test = attempt.test;
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };
  const rwModules = attempt.moduleAttempts.filter((_, i) => i < 2);
  const mathModules = attempt.moduleAttempts.filter((_, i) => i >= 2);
  const rwCorrect = rwModules.reduce((s, m) => s + m.correctCount, 0);
  const rwTotal = rwModules.reduce((s, m) => s + m.totalQuestions, 0);
  const mathCorrect = mathModules.reduce((s, m) => s + m.correctCount, 0);
  const mathTotal = mathModules.reduce((s, m) => s + m.totalQuestions, 0);
  const rwScoreScaled = rwTotal > 0 ? Math.round(200 + rwCorrect / rwTotal * 600) : 200;
  const mathScoreScaled = mathTotal > 0 ? Math.round(200 + mathCorrect / mathTotal * 600) : 200;
  const totalScoreScaled = rwScoreScaled + mathScoreScaled;
  return /* @__PURE__ */ jsx(StudentLayout, { activeItem: "/dashboard/sat-tests", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1000px] mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "SAT Test Results" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: test?.title || "SAT Practice Test" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-primary text-on-primary p-10 shark-shadow mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-around gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl font-extrabold font-display", children: totalScoreScaled }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-on-primary/70 mt-1", children: "Total Score (400–1600)" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-16 w-px bg-white/20 hidden md:block" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold font-display", children: rwScoreScaled }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-on-primary/70 mt-1", children: "Reading & Writing (200–800)" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-16 w-px bg-white/20 hidden md:block" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold font-display", children: mathScoreScaled }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-on-primary/70 mt-1", children: "Math (200–800)" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4", children: "Reading & Writing" }),
        /* @__PURE__ */ jsx(ScoreCircle, { score: rwTotal > 0 ? Math.round(rwCorrect / rwTotal * 100) : 0, maxScore: 100, size: 140, label: `${rwCorrect} / ${rwTotal}`, sublabel: "correct answers" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4", children: "Math" }),
        /* @__PURE__ */ jsx(ScoreCircle, { score: mathTotal > 0 ? Math.round(mathCorrect / mathTotal * 100) : 0, maxScore: 100, size: 140, label: `${mathCorrect} / ${mathTotal}`, sublabel: "correct answers" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary", children: attempt.totalCorrect }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Correct" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-error", children: attempt.totalQuestions - attempt.totalCorrect }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Incorrect" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-on-surface", children: attempt.totalQuestions }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Total" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-accent", children: formatTime(attempt.totalTimeTaken) }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Time Taken" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: "Module Breakdown" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8", children: attempt.moduleAttempts.map((mod, idx) => {
      const moduleName = test?.modules?.[idx]?.name || `Module ${idx + 1}`;
      const isExpanded = expandedModule === idx;
      const pct = mod.totalQuestions > 0 ? Math.round(mod.correctCount / mod.totalQuestions * 100) : 0;
      return /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setExpandedModule(isExpanded ? null : idx), className: "w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: moduleName }),
            /* @__PURE__ */ jsxs(Badge, { variant: pct >= 70 ? "success" : pct >= 50 ? "warning" : "error", children: [
              mod.correctCount,
              "/",
              mod.totalQuestions,
              " (",
              pct,
              "%)"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Icon, { name: isExpanded ? "expand_less" : "expand_more", className: "text-[24px] text-on-surface-variant" })
        ] }),
        isExpanded && /* @__PURE__ */ jsx("div", { className: "border-t border-outline-variant/30 p-5 space-y-3", children: mod.answers.map((ans, ai) => {
          const q = ans.question;
          if (!q || typeof q === "string") return null;
          return /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${ans.isCorrect ? "border-primary/20 bg-primary/5" : "border-error/20 bg-error/5"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-on-surface-variant", children: [
                "Q",
                ai + 1
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: ans.isCorrect ? "success" : "error", children: ans.isCorrect ? "Correct" : "Incorrect" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm mb-3 leading-relaxed line-clamp-3", children: q.text }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Your answer: ",
                /* @__PURE__ */ jsx("strong", { className: ans.isCorrect ? "text-primary" : "text-error", children: ans.selectedAnswer || "—" })
              ] }),
              !ans.isCorrect && /* @__PURE__ */ jsxs("span", { children: [
                "Correct: ",
                /* @__PURE__ */ jsx("strong", { className: "text-primary", children: q.correctAnswer })
              ] })
            ] }),
            q.explanation && /* @__PURE__ */ jsx("div", { className: "mt-2 p-2 rounded bg-surface-container-low text-xs text-on-surface-variant", children: q.explanation })
          ] }, ai);
        }) })
      ] }, idx);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsx(Link, { to: "/dashboard/sat-tests", className: "flex-1 py-3 rounded-xl border border-outline-variant text-center text-sm font-semibold hover:bg-surface-container-low transition-colors", children: "Back to SAT Tests" }) })
  ] }) });
}
export {
  SATResult as component
};
