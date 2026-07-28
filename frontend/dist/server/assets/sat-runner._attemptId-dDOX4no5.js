import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { c as Route, a as api } from "./router-Be_1-VPB.js";
import "@tanstack/react-query";
function SATRunner() {
  const {
    attemptId
  } = Route.useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("LOADING");
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const autoSaveTimer = useRef(null);
  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/api/sat/attempt/${attemptId}`);
      if (!res.success) return;
      const attempt = res.attempt;
      const testData = attempt.test;
      setTest(testData);
      setCurrentModuleIndex(attempt.currentModuleIndex);
      const restored = {};
      for (const ma of attempt.moduleAttempts) {
        restored[ma.moduleIndex] = ma.answers.map((a) => ({
          question: typeof a.question === "object" ? a.question._id : a.question,
          selectedAnswer: a.selectedAnswer,
          markedForReview: a.markedForReview || false,
          timeSpent: a.timeSpent || 0
        }));
      }
      setAnswers(restored);
      if (attempt.status === "ON_BREAK") {
        setPhase("BREAK");
        const breakElapsed = attempt.breakStartedAt ? Math.floor((Date.now() - new Date(attempt.breakStartedAt).getTime()) / 1e3) : 0;
        setBreakTimeLeft(Math.max(0, testData.breakDurationMinutes * 60 - breakElapsed));
      } else if (attempt.status === "IN_PROGRESS") {
        setPhase("MODULE");
        const mod = testData.modules[attempt.currentModuleIndex];
        const modAttempt = attempt.moduleAttempts[attempt.currentModuleIndex];
        if (mod && modAttempt?.startedAt) {
          const elapsed = Math.floor((Date.now() - new Date(modAttempt.startedAt).getTime()) / 1e3);
          setTimeLeft(Math.max(0, mod.timeLimitMinutes * 60 - elapsed));
        }
      } else if (attempt.status === "COMPLETED") {
        setPhase("FINISHED");
      }
    };
    load();
  }, [attemptId]);
  useEffect(() => {
    if (phase !== "MODULE" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleModuleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [phase, timeLeft > 0]);
  useEffect(() => {
    if (phase !== "BREAK" || breakTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setBreakTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [phase, breakTimeLeft > 0]);
  useEffect(() => {
    if (phase !== "MODULE") return;
    autoSaveTimer.current = setInterval(() => {
      saveProgress();
    }, 3e4);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [phase, currentModuleIndex, answers]);
  const saveProgress = useCallback(async () => {
    const modAnswers = answers[currentModuleIndex] || [];
    await api.post(`/api/sat/attempt/${attemptId}/save`, {
      moduleIndex: currentModuleIndex,
      answers: modAnswers
    });
  }, [answers, currentModuleIndex, attemptId]);
  const handleModuleTimeUp = useCallback(async () => {
    await completeCurrentModule();
  }, [currentModuleIndex, answers, attemptId]);
  const completeCurrentModule = async () => {
    if (submitting) return;
    setSubmitting(true);
    const modAnswers = answers[currentModuleIndex] || [];
    const res = await api.post(`/api/sat/attempt/${attemptId}/complete-module`, {
      moduleIndex: currentModuleIndex,
      answers: modAnswers
    });
    if (res.success) {
      const attempt = res.attempt;
      if (attempt.status === "ON_BREAK") {
        setPhase("BREAK");
        setBreakTimeLeft((test?.breakDurationMinutes || 10) * 60);
        setCurrentModuleIndex(attempt.currentModuleIndex);
        setCurrentQuestionIndex(0);
      } else if (attempt.status === "COMPLETED") {
        setPhase("FINISHED");
      } else {
        setCurrentModuleIndex(attempt.currentModuleIndex);
        setCurrentQuestionIndex(0);
        const nextMod = test?.modules[attempt.currentModuleIndex];
        if (nextMod) setTimeLeft(nextMod.timeLimitMinutes * 60);
        setPhase("MODULE");
      }
    }
    setSubmitting(false);
  };
  const handleEndBreak = async () => {
    const res = await api.post(`/api/sat/attempt/${attemptId}/end-break`, {});
    if (res.success) {
      setPhase("MODULE");
      const nextMod = test?.modules[currentModuleIndex];
      if (nextMod) setTimeLeft(nextMod.timeLimitMinutes * 60);
      setCurrentQuestionIndex(0);
    }
  };
  const selectAnswer = (questionId, answer) => {
    setAnswers((prev) => {
      const modAnswers = [...prev[currentModuleIndex] || []];
      const idx = modAnswers.findIndex((a) => a.question === questionId);
      if (idx >= 0) {
        modAnswers[idx] = {
          ...modAnswers[idx],
          selectedAnswer: answer
        };
      } else {
        modAnswers.push({
          question: questionId,
          selectedAnswer: answer,
          markedForReview: false,
          timeSpent: 0
        });
      }
      return {
        ...prev,
        [currentModuleIndex]: modAnswers
      };
    });
  };
  const toggleReview = (questionId) => {
    setAnswers((prev) => {
      const modAnswers = [...prev[currentModuleIndex] || []];
      const idx = modAnswers.findIndex((a) => a.question === questionId);
      if (idx >= 0) {
        modAnswers[idx] = {
          ...modAnswers[idx],
          markedForReview: !modAnswers[idx].markedForReview
        };
      } else {
        modAnswers.push({
          question: questionId,
          selectedAnswer: null,
          markedForReview: true,
          timeSpent: 0
        });
      }
      return {
        ...prev,
        [currentModuleIndex]: modAnswers
      };
    });
  };
  const getAnswer = (questionId) => {
    return (answers[currentModuleIndex] || []).find((a) => a.question === questionId);
  };
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  if (phase === "LOADING" || !test) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Icon, { name: "hourglass_top", className: "text-5xl text-primary mb-4 animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant font-semibold", children: "Loading your SAT test..." })
    ] }) });
  }
  if (phase === "FINISHED") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsx(Icon, { name: "check_circle", className: "text-6xl text-primary mb-4" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-2", children: "Test Submitted" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mb-6", children: "Your SAT practice test has been submitted and scored." }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate({
        to: `/dashboard/sat-result/${attemptId}`
      }), className: "btn-shimmer bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent transition-colors cursor-pointer", children: "View Results" })
    ] }) });
  }
  if (phase === "BREAK") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-lg p-10 rounded-2xl bg-surface-container-lowest shark-shadow border border-outline-variant/40", children: [
      /* @__PURE__ */ jsx(Icon, { name: "coffee", className: "text-6xl text-accent mb-4" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "Break Time" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mb-6", children: "You've completed the Reading & Writing section. Take a 10-minute break before starting Math." }),
      /* @__PURE__ */ jsx("div", { className: "text-5xl font-mono font-bold text-primary mb-8", children: formatTime(breakTimeLeft) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: handleEndBreak, className: "w-full btn-shimmer bg-primary text-on-primary py-3.5 rounded-xl font-semibold hover:bg-accent transition-colors cursor-pointer", children: "Resume Test — Start Math Section" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: "You can resume early or wait for the timer" })
      ] })
    ] }) });
  }
  const currentModule = test.modules[currentModuleIndex];
  const questions = currentModule?.questions || [];
  const q = questions[currentQuestionIndex];
  const currentAnswer = q ? getAnswer(q._id) : void 0;
  const answeredCount = (answers[currentModuleIndex] || []).filter((a) => a.selectedAnswer).length;
  const reviewCount = (answers[currentModuleIndex] || []).filter((a) => a.markedForReview).length;
  const isWarning = timeLeft < 120 && timeLeft > 0;
  const isLastModule = currentModuleIndex === test.modules.length - 1;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-on-background flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-40 bg-primary text-on-primary px-4 py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1200px] mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold text-sm", children: currentModule.name }),
        /* @__PURE__ */ jsx(Badge, { variant: currentModule.section === "MATH" ? "info" : "accent", className: "!text-[10px]", children: currentModule.section === "MATH" ? "Math" : "R&W" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 font-mono text-lg font-bold ${isWarning ? "text-accent animate-pulse" : ""}`, children: [
          /* @__PURE__ */ jsx(Icon, { name: "timer", className: "text-[20px]" }),
          formatTime(timeLeft)
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setShowNav(!showNav), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-xs font-bold hover:bg-white/25 transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "grid_view", className: "text-[16px]" }),
          answeredCount,
          "/",
          questions.length,
          reviewCount > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-accent", children: [
            "(",
            reviewCount,
            "⚑)"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full h-1 bg-surface-container-high", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-accent transition-all duration-300", style: {
      width: `${(currentQuestionIndex + 1) / questions.length * 100}%`
    } }) }),
    showNav && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", onClick: () => setShowNav(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full shark-shadow", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Question Navigator" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowNav(false), className: "p-1 hover:bg-surface-container-low rounded-full cursor-pointer", children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-xl" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: questions.map((q2, i) => {
        const ans = getAnswer(q2._id);
        const isAnswered = !!ans?.selectedAnswer;
        const isReview = !!ans?.markedForReview;
        const isCurrent = i === currentQuestionIndex;
        return /* @__PURE__ */ jsxs("button", { onClick: () => {
          setCurrentQuestionIndex(i);
          setShowNav(false);
        }, className: `relative h-10 w-10 rounded-lg text-xs font-bold transition-all cursor-pointer ${isCurrent ? "bg-primary text-on-primary ring-2 ring-accent" : isAnswered ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"}`, children: [
          i + 1,
          isReview && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border border-white" })
        ] }, i);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs text-on-surface-variant", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded bg-primary/20" }),
          " Answered"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded bg-surface-container-high" }),
          " Unanswered"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-accent" }),
          " Flagged"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex justify-center px-4 py-8", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-[800px]", children: q && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-on-surface-variant", children: [
          "Question ",
          currentQuestionIndex + 1,
          " of ",
          questions.length
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => toggleReview(q._id), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${currentAnswer?.markedForReview ? "bg-accent text-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"}`, children: [
          /* @__PURE__ */ jsx(Icon, { name: currentAnswer?.markedForReview ? "flag" : "outlined_flag", className: "text-[16px]" }),
          currentAnswer?.markedForReview ? "Flagged" : "Mark for Review"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/40 shark-shadow mb-6", children: /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed whitespace-pre-wrap", children: q.text }) }),
      q.options && q.options.length >= 2 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: q.options.map((opt) => {
        const selected = currentAnswer?.selectedAnswer === opt.label;
        return /* @__PURE__ */ jsxs("button", { onClick: () => selectAnswer(q._id, opt.label), className: `w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${selected ? "border-primary bg-primary/5 shadow-md" : "border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low"}`, children: [
          /* @__PURE__ */ jsx("span", { className: `flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${selected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"}`, children: opt.label }),
          /* @__PURE__ */ jsx("span", { className: "text-sm leading-relaxed", children: opt.text })
        ] }, opt.label);
      }) }) : (
        /* Free-response input */
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant mb-2", children: "Your Answer" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: currentAnswer?.selectedAnswer || "", onChange: (e) => selectAnswer(q._id, e.target.value), placeholder: "Type your answer...", className: "w-full rounded-xl border-2 border-outline-variant bg-surface-container-low px-5 py-4 text-lg font-mono outline-none focus:border-primary transition-colors" })
        ] })
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-outline-variant/40 bg-surface-container-lowest px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[800px] mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1)), disabled: currentQuestionIndex === 0, className: "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold disabled:opacity-30 hover:bg-surface-container-low transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsx(Icon, { name: "chevron_left", className: "text-[18px]" }),
        " Previous"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: currentQuestionIndex < questions.length - 1 ? /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentQuestionIndex(currentQuestionIndex + 1), className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-accent transition-colors cursor-pointer", children: [
        "Next ",
        /* @__PURE__ */ jsx(Icon, { name: "chevron_right", className: "text-[18px]" })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: completeCurrentModule, disabled: submitting, className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:bg-accent/80 transition-colors disabled:opacity-50 cursor-pointer", children: [
        /* @__PURE__ */ jsx(Icon, { name: isLastModule ? "check_circle" : "skip_next", className: "text-[18px]" }),
        submitting ? "Submitting..." : isLastModule ? "Submit Test" : "Finish Module"
      ] }) })
    ] }) })
  ] });
}
export {
  SATRunner as component
};
