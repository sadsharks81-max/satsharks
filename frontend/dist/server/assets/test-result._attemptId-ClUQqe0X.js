import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { S as StudentLayout } from "./StudentLayout-BRfqHLM0.js";
import { S as ScoreCircle } from "./ScoreCircle-Dj63AhLr.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { R as Route, a as api } from "./router-Be_1-VPB.js";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "./Footer-CN17TUqH.js";
import "@tanstack/react-query";
function TestResult() {
  const {
    attemptId
  } = Route.useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  useEffect(() => {
    api.get(`/api/tests/attempt/${attemptId}`).then((res) => {
      if (res.success) setAttempt(res.attempt);
      setLoading(false);
    });
  }, [attemptId]);
  if (loading) {
    return /* @__PURE__ */ jsx(StudentLayout, { activeItem: "/dashboard/tests", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading results..." }) });
  }
  if (!attempt) {
    return /* @__PURE__ */ jsx(StudentLayout, { activeItem: "/dashboard/tests", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-error", children: "Result not found" }) });
  }
  const test = attempt.test;
  const correctCount = attempt.correctCount;
  const unattemptedCount = attempt.answers.filter((ans) => !ans.selectedAnswer).length;
  const incorrectCount = attempt.totalQuestions - correctCount - unattemptedCount;
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };
  return /* @__PURE__ */ jsx(StudentLayout, { activeItem: "/dashboard/tests", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[900px] mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "Test Complete!" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: test?.title || "Diagnostic Test" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-surface-container-lowest p-10 shark-shadow border border-outline-variant/40 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center gap-10", children: [
      /* @__PURE__ */ jsx(ScoreCircle, { score: attempt.percentage, maxScore: 100, size: 180, label: "Your Score" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-6 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-low col-span-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary", children: correctCount }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Correct" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-low col-span-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-error", children: incorrectCount }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Incorrect" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-low col-span-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-on-surface-variant", children: unattemptedCount }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Not Attempted" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-low col-span-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-on-surface", children: attempt.totalQuestions }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Total Questions" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-surface-container-low col-span-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-accent", children: formatTime(attempt.timeTaken) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant mt-1", children: "Time Taken" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-8", children: [
      /* @__PURE__ */ jsx(Link, { to: "/dashboard/tests", className: "flex-1 py-3 rounded-xl border border-outline-variant text-center text-sm font-semibold hover:bg-surface-container-low transition-colors", children: "Back to Tests" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setShowReview(!showReview), className: "flex-1 py-3 rounded-xl bg-primary text-on-primary text-center text-sm font-semibold hover:bg-accent transition-colors cursor-pointer", children: showReview ? "Hide Review" : "Review Answers" })
    ] }),
    showReview && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: "Answer Review" }),
      attempt.answers.map((ans, idx) => {
        const q = ans.question;
        if (!q || typeof q === "string") return null;
        const isAttempted = !!ans.selectedAnswer;
        let cardStyle = "border-outline-variant/40 bg-surface-container-low/50";
        let badgeText = "Not Attempted";
        let badgeVariant = "warning";
        if (isAttempted) {
          if (ans.isCorrect) {
            cardStyle = "border-primary/30 bg-primary/5";
            badgeText = "Correct";
            badgeVariant = "success";
          } else {
            cardStyle = "border-error/30 bg-error/5";
            badgeText = "Incorrect";
            badgeVariant = "error";
          }
        }
        return /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-6 border ${cardStyle}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-on-surface-variant", children: [
              "Q",
              idx + 1
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: badgeVariant, children: badgeText })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mb-4 leading-relaxed", children: q.text }),
          q.options && q.options.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: q.options.map((opt) => {
            const isSelected = ans.selectedAnswer === opt.label;
            const isCorrectOption = q.correctAnswer === opt.label;
            return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${isCorrectOption ? "bg-primary/15 text-primary font-semibold" : isSelected && !ans.isCorrect ? "bg-error/15 text-error" : "text-on-surface-variant"}`, children: [
              /* @__PURE__ */ jsxs("span", { className: "font-bold w-6", children: [
                opt.label,
                "."
              ] }),
              /* @__PURE__ */ jsx("span", { children: opt.text }),
              isCorrectOption && /* @__PURE__ */ jsx(Icon, { name: "check_circle", className: "ml-auto text-primary text-[18px]" }),
              isSelected && !isCorrectOption && /* @__PURE__ */ jsx(Icon, { name: "cancel", className: "ml-auto text-error text-[18px]" })
            ] }, opt.label);
          }) }) : (
            /* Display answers for student-produced responses */
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-sm max-w-md", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant font-medium", children: "Your Answer:" }),
                /* @__PURE__ */ jsx("span", { className: `font-mono font-bold ${!isAttempted ? "text-on-surface-variant italic" : ans.isCorrect ? "text-primary" : "text-error"}`, children: ans.selectedAnswer || "Not Attempted" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-t border-outline-variant/30 pt-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant font-medium", children: "Correct Answer:" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-primary", children: q.correctAnswer })
              ] })
            ] })
          ),
          q.explanation && /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant", children: [
            /* @__PURE__ */ jsx("strong", { children: "Explanation:" }),
            " ",
            q.explanation
          ] })
        ] }, idx);
      })
    ] })
  ] }) });
}
export {
  TestResult as component
};
