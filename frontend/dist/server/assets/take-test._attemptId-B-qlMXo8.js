import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { b as Route, a as api } from "./router-Be_1-VPB.js";
import "@tanstack/react-query";
const getTestModules = (section, questionCount) => {
  if (section === "FULL" && questionCount === 98) {
    return [{
      number: 1,
      name: "Reading & Writing - Module 1",
      questionIndices: Array.from({
        length: 27
      }, (_, i) => i),
      duration: 32 * 60
    }, {
      number: 2,
      name: "Reading & Writing - Module 2",
      questionIndices: Array.from({
        length: 27
      }, (_, i) => i + 27),
      duration: 32 * 60
    }, {
      number: 3,
      name: "Math - Module 1",
      questionIndices: Array.from({
        length: 22
      }, (_, i) => i + 54),
      duration: 35 * 60
    }, {
      number: 4,
      name: "Math - Module 2",
      questionIndices: Array.from({
        length: 22
      }, (_, i) => i + 76),
      duration: 35 * 60
    }];
  }
  if (section === "READING_WRITING" && questionCount === 54) {
    return [{
      number: 1,
      name: "Reading & Writing - Module 1",
      questionIndices: Array.from({
        length: 27
      }, (_, i) => i),
      duration: 32 * 60
    }, {
      number: 2,
      name: "Reading & Writing - Module 2",
      questionIndices: Array.from({
        length: 27
      }, (_, i) => i + 27),
      duration: 32 * 60
    }];
  }
  if (section === "MATH" && questionCount === 44) {
    return [{
      number: 1,
      name: "Math - Module 1",
      questionIndices: Array.from({
        length: 22
      }, (_, i) => i),
      duration: 35 * 60
    }, {
      number: 2,
      name: "Math - Module 2",
      questionIndices: Array.from({
        length: 22
      }, (_, i) => i + 22),
      duration: 35 * 60
    }];
  }
  return null;
};
const rwDirections = /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm text-on-surface-variant leading-relaxed", children: [
  /* @__PURE__ */ jsx("p", { className: "font-bold text-on-surface text-base", children: "Reading and Writing Section Directions" }),
  /* @__PURE__ */ jsx("p", { children: "The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s)." }),
  /* @__PURE__ */ jsx("p", { children: "All questions in this section are multiple-choice with four answer choices. Each question has a single best answer." })
] });
const mathDirections = /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm text-on-surface-variant leading-relaxed max-h-[400px] overflow-y-auto pr-2", children: [
  /* @__PURE__ */ jsx("p", { className: "font-bold text-on-surface text-base", children: "Math Section Directions" }),
  /* @__PURE__ */ jsx("p", { children: "The questions in this section address a number of important math skills." }),
  /* @__PURE__ */ jsx("p", { children: "Use of a calculator is permitted for all questions. A reference sheet, calculator, and these directions can be accessed throughout the test." }),
  /* @__PURE__ */ jsx("p", { className: "font-semibold text-on-surface", children: "Unless otherwise indicated:" }),
  /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
    /* @__PURE__ */ jsx("li", { children: "All variables and expressions represent real numbers." }),
    /* @__PURE__ */ jsx("li", { children: "Figures provided are drawn to scale." }),
    /* @__PURE__ */ jsx("li", { children: "All figures lie in a plane." }),
    /* @__PURE__ */ jsx("li", { children: "The domain of a given function f is the set of all real numbers x for which f(x) is a real number." })
  ] }),
  /* @__PURE__ */ jsx("p", { className: "font-semibold text-on-surface", children: "For multiple-choice questions:" }),
  /* @__PURE__ */ jsx("p", { children: "Solve each problem and choose the correct answer from the choices provided. Each multiple-choice question has a single correct answer." }),
  /* @__PURE__ */ jsx("p", { className: "font-semibold text-on-surface", children: "For student-produced response questions:" }),
  /* @__PURE__ */ jsx("p", { children: "Solve each problem and enter your answer as described below:" }),
  /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
    /* @__PURE__ */ jsx("li", { children: "If you find more than one correct answer, enter only one answer." }),
    /* @__PURE__ */ jsx("li", { children: "You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer." }),
    /* @__PURE__ */ jsx("li", { children: "If your answer is a fraction that doesn't fit in the provided space, enter the decimal equivalent." }),
    /* @__PURE__ */ jsx("li", { children: "If your answer is a decimal that doesn't fit in the provided space, enter it by truncating or rounding at the fourth digit." }),
    /* @__PURE__ */ jsx("li", { children: "If your answer is a mixed number (such as 3½), enter it as an improper fraction (7/2) or its decimal equivalent (3.5)." }),
    /* @__PURE__ */ jsx("li", { children: "Don't enter symbols such as a percent sign, comma, or dollar sign." })
  ] })
] });
function TakeTest() {
  const {
    attemptId
  } = Route.useParams();
  const search = useSearch({
    from: "/dashboard/take-test/$attemptId"
  });
  const testId = search.testId;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [testTitle, setTestTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [modules, setModules] = useState(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(10 * 60);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  useEffect(() => {
    if (!testId) return;
    api.get(`/api/tests/${testId}`).then((res) => {
      if (res.success) {
        const testQuestions = res.test.questions || [];
        setQuestions(testQuestions);
        setTestTitle(res.test.title);
        const resolvedModules = getTestModules(res.test.section, testQuestions.length);
        setModules(resolvedModules);
        const stored = localStorage.getItem(`satsharks_attempt_${attemptId}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setActiveModuleIdx(parsed.activeModuleIdx ?? 0);
            setTimeLeft(parsed.timeLeft ?? 0);
            setCurrentIdx(parsed.currentIdx ?? 0);
            setAnswers(parsed.answers ?? {});
            setIsBreakActive(parsed.isBreakActive ?? false);
            setBreakTimeLeft(parsed.breakTimeLeft ?? 10 * 60);
            setLoading(false);
            return;
          } catch (e) {
            console.error("Failed to restore test attempt state", e);
          }
        }
        if (resolvedModules) {
          const firstMod = resolvedModules[0];
          setActiveModuleIdx(0);
          setTimeLeft(firstMod.duration);
          setCurrentIdx(firstMod.questionIndices[0]);
        } else {
          setTimeLimit(res.test.timeLimit);
          setTimeLeft(res.test.timeLimit * 60);
          setCurrentIdx(0);
        }
      }
      setLoading(false);
    });
  }, [testId, attemptId]);
  useEffect(() => {
    if (loading || !testId) return;
    const stateToSave = {
      activeModuleIdx,
      timeLeft,
      currentIdx,
      answers,
      isBreakActive,
      breakTimeLeft
    };
    localStorage.setItem(`satsharks_attempt_${attemptId}`, JSON.stringify(stateToSave));
  }, [activeModuleIdx, timeLeft, currentIdx, answers, isBreakActive, breakTimeLeft, loading, testId, attemptId]);
  useEffect(() => {
    if (!isBreakActive || breakTimeLeft <= 0) return;
    const breakTimer = setInterval(() => {
      setBreakTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(breakTimer);
          setIsBreakActive(false);
          if (modules) {
            const nextModIdx = 2;
            setActiveModuleIdx(nextModIdx);
            setTimeLeft(modules[nextModIdx].duration);
            setCurrentIdx(modules[nextModIdx].questionIndices[0]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(breakTimer);
  }, [isBreakActive, breakTimeLeft, modules]);
  useEffect(() => {
    if (isBreakActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1e3);
    return () => clearInterval(timer);
  }, [isBreakActive, timeLeft > 0]);
  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1e3);
    const body = {
      answers: questions.map((q2) => ({
        question: q2._id,
        selectedAnswer: answers[q2._id] || null,
        timeSpent: 0
      })),
      timeTaken
    };
    const res = await api.put(`/api/tests/attempt/${attemptId}/submit`, body);
    if (res.success) {
      localStorage.removeItem(`satsharks_attempt_${attemptId}`);
      navigate({
        to: `/dashboard/test-result/${attemptId}`
      });
    }
    setSubmitting(false);
  }, [questions, answers, attemptId, submitting, startTime, navigate]);
  useEffect(() => {
    if (timeLeft === 0 && !loading && !isBreakActive) {
      if (modules) {
        const nextIdx = activeModuleIdx + 1;
        if (nextIdx < modules.length) {
          if (activeModuleIdx === 1 && modules.length === 4) {
            setIsBreakActive(true);
            setBreakTimeLeft(10 * 60);
          } else {
            setActiveModuleIdx(nextIdx);
            setTimeLeft(modules[nextIdx].duration);
            setCurrentIdx(modules[nextIdx].questionIndices[0]);
          }
        } else {
          handleSubmit();
        }
      } else {
        handleSubmit();
      }
    }
  }, [timeLeft, isBreakActive, activeModuleIdx, modules, loading, handleSubmit]);
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };
  const confirmNextModule = () => {
    setShowTransitionModal(false);
    if (!modules) return;
    const nextIdx = activeModuleIdx + 1;
    if (nextIdx < modules.length) {
      if (activeModuleIdx === 1 && modules.length === 4) {
        setIsBreakActive(true);
        setBreakTimeLeft(10 * 60);
      } else {
        setActiveModuleIdx(nextIdx);
        setTimeLeft(modules[nextIdx].duration);
        setCurrentIdx(modules[nextIdx].questionIndices[0]);
      }
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant font-semibold", children: "Loading test..." }) });
  }
  if (isBreakActive) {
    const skipBreak = () => {
      setIsBreakActive(false);
      if (modules) {
        const nextModIdx = 2;
        setActiveModuleIdx(nextModIdx);
        setTimeLeft(modules[nextModIdx].duration);
        setCurrentIdx(modules[nextModIdx].questionIndices[0]);
      }
    };
    const breakM = Math.floor(breakTimeLeft / 60);
    const breakS = breakTimeLeft % 60;
    const formattedBreakTime = `${breakM.toString().padStart(2, "0")}:${breakS.toString().padStart(2, "0")}`;
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-on-background flex flex-col justify-center items-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full text-center bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 shark-shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary", children: /* @__PURE__ */ jsx(Icon, { name: "coffee", className: "text-[32px]" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "Scheduled Break" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mb-8 leading-relaxed", children: "Take a 10-minute break to rest. You can stretch, grab a glass of water, or skip the break to continue your test immediately." }),
      /* @__PURE__ */ jsx("div", { className: "text-5xl font-mono font-black text-primary mb-8 tracking-wider", children: formattedBreakTime }),
      /* @__PURE__ */ jsx("button", { onClick: skipBreak, className: "w-full btn-shimmer bg-primary text-on-primary hover:bg-accent hover:text-primary py-3.5 rounded-2xl text-sm font-bold shark-shadow transition-all cursor-pointer border-none animate-bounce", children: "Skip Break & Resume Test" })
    ] }) });
  }
  const q = questions[currentIdx];
  const answered = Object.keys(answers).length;
  const isWarning = timeLeft < 120 && timeLeft > 0;
  const activeModule = modules ? modules[activeModuleIdx] : null;
  const isLastQuestionInModule = activeModule ? currentIdx === activeModule.questionIndices[activeModule.questionIndices.length - 1] : false;
  const isLastModule = modules ? activeModuleIdx === modules.length - 1 : false;
  const isMathModule = modules && activeModule ? activeModule.number === 3 || activeModule.number === 4 : false;
  const isMathSection = !modules && q?.section === "MATH";
  const showMathTools = isMathModule || isMathSection;
  const relativeQuestionNum = modules && activeModule ? currentIdx - activeModule.questionIndices[0] + 1 : currentIdx + 1;
  const totalModuleQuestions = modules && activeModule ? activeModule.questionIndices.length : questions.length;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-on-background flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/40 px-6 py-3", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1000px] mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-semibold text-sm", children: modules ? `${testTitle} - ${activeModule?.name}` : testTitle }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-on-surface-variant", children: [
          "Question ",
          relativeQuestionNum,
          " of ",
          totalModuleQuestions
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setShowDirectionsModal(true), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-xs font-semibold cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "info", className: "text-[16px]" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Directions" })
        ] }),
        showMathTools && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => setShowCalculatorModal(true), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-xs font-semibold cursor-pointer", children: [
            /* @__PURE__ */ jsx(Icon, { name: "calculate", className: "text-[16px]" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Calculator" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setShowReferenceModal(true), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-xs font-semibold cursor-pointer", children: [
            /* @__PURE__ */ jsx(Icon, { name: "functions", className: "text-[16px]" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Reference" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 font-mono text-lg font-bold ${isWarning ? "text-error animate-pulse" : "text-primary"}`, children: [
          /* @__PURE__ */ jsx(Icon, { name: "timer", className: "text-[20px]" }),
          formatTime(timeLeft)
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: modules && activeModule ? (() => {
          const moduleAnswers = activeModule.questionIndices.filter((idx) => answers[questions[idx]?._id]).length;
          return `${moduleAnswers}/${activeModule.questionIndices.length} answered`;
        })() : `${answered}/${questions.length} answered` })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full h-1 bg-surface-container-high", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary transition-all duration-300", style: {
      width: `${relativeQuestionNum / totalModuleQuestions * 100}%`
    } }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex justify-center px-6 py-10", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-[800px]", children: q && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between border-b border-outline-variant/30 pb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-base font-extrabold text-primary tracking-widest uppercase", children: [
          "Question ",
          relativeQuestionNum
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full", children: [
          q.difficulty,
          " • ",
          q.section === "MATH" ? "Math" : "Reading & Writing"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/40 shark-shadow mb-8", children: /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed whitespace-pre-wrap", children: q.text }) }),
      q.options && q.options.length > 0 ? (
        /* Multiple Choice Options */
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: q.options.map((opt) => {
          const selected = answers[q._id] === opt.label;
          return /* @__PURE__ */ jsxs("button", { onClick: () => handleAnswer(q._id, opt.label), className: `w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${selected ? "border-primary bg-primary/5 shadow-md" : "border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low"}`, children: [
            /* @__PURE__ */ jsx("span", { className: `flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${selected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"}`, children: opt.label }),
            /* @__PURE__ */ jsx("span", { className: "text-sm leading-relaxed", children: opt.text })
          ] }, opt.label);
        }) })
      ) : (
        /* Student-Produced Response Input Field */
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-on-surface mb-3 uppercase tracking-wider", children: "Enter Your Answer" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: answers[q._id] || "", onChange: (e) => handleAnswer(q._id, e.target.value), placeholder: "Type your answer here...", className: "w-full max-w-[300px] px-5 py-4 rounded-xl border-2 border-outline-variant/60 focus:border-primary focus:outline-none text-lg font-mono tracking-wide transition-all bg-surface text-on-surface focus:shadow-md" }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 p-4 bg-primary/5 rounded-xl border border-primary/10", children: /* @__PURE__ */ jsxs("span", { className: "flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed", children: [
            /* @__PURE__ */ jsx(Icon, { name: "info", className: "text-primary text-[16px] mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-on-surface", children: "Digital SAT Rules for Student-Produced Responses:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-4 mt-1.5 space-y-1 text-[11px]", children: [
                /* @__PURE__ */ jsx("li", { children: "Positive answers: up to 5 characters max." }),
                /* @__PURE__ */ jsx("li", { children: "Negative answers: up to 6 characters max (including negative sign)." }),
                /* @__PURE__ */ jsx("li", { children: "Fractions: enter as improper fraction (e.g. 7/2) or decimal. Mixed numbers must be entered as fractions/decimals (e.g. enter 3.5 or 7/2, not 3 1/2)." }),
                /* @__PURE__ */ jsx("li", { children: "Do not enter symbols (%, $, commas, etc.)." })
              ] })
            ] })
          ] }) })
        ] })
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-outline-variant/40 bg-surface-container-lowest px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[800px] mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: modules ? activeModule?.questionIndices.map((absIdx) => {
        const questionObj = questions[absIdx];
        const relativeNum = absIdx - activeModule.questionIndices[0] + 1;
        return /* @__PURE__ */ jsx("button", { onClick: () => setCurrentIdx(absIdx), className: `h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${absIdx === currentIdx ? "bg-primary text-on-primary" : answers[questionObj._id] ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"}`, children: relativeNum }, absIdx);
      }) : questions.map((q2, i) => /* @__PURE__ */ jsx("button", { onClick: () => setCurrentIdx(i), className: `h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${i === currentIdx ? "bg-primary text-on-primary" : answers[q2._id] ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"}`, children: i + 1 }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentIdx(Math.max(0, currentIdx - 1)), disabled: modules && activeModule ? currentIdx === activeModule.questionIndices[0] : currentIdx === 0, className: "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold disabled:opacity-30 hover:bg-surface-container-low transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "chevron_left", className: "text-[18px]" }),
          " Previous"
        ] }),
        modules ? isLastQuestionInModule ? isLastModule ? /* @__PURE__ */ jsxs("button", { onClick: handleSubmit, disabled: submitting, className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:bg-accent/80 transition-colors disabled:opacity-50 cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "check_circle", className: "text-[18px]" }),
          submitting ? "Submitting..." : "Submit Test"
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setShowTransitionModal(true), className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:bg-accent/80 transition-colors cursor-pointer", children: [
          "Next Module ",
          /* @__PURE__ */ jsx(Icon, { name: "arrow_forward", className: "text-[18px]" })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentIdx(currentIdx + 1), className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-accent transition-colors cursor-pointer", children: [
          "Next ",
          /* @__PURE__ */ jsx(Icon, { name: "chevron_right", className: "text-[18px]" })
        ] }) : currentIdx < questions.length - 1 ? /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentIdx(currentIdx + 1), className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-accent transition-colors cursor-pointer", children: [
          "Next ",
          /* @__PURE__ */ jsx(Icon, { name: "chevron_right", className: "text-[18px]" })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: handleSubmit, disabled: submitting, className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:bg-accent/80 transition-colors disabled:opacity-50 cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "check_circle", className: "text-[18px]" }),
          submitting ? "Submitting..." : "Submit Test"
        ] })
      ] })
    ] }) }),
    showTransitionModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shark-shadow animate-scale-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-warning mb-4", children: [
        /* @__PURE__ */ jsx(Icon, { name: "warning", className: "text-[28px]" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-on-surface", children: "Confirm Module Submission" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mb-6 leading-relaxed", children: "Are you sure you want to move to the next module? Once you proceed, you will not be able to view or edit questions in the current module." }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowTransitionModal(false), className: "px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors font-semibold text-sm cursor-pointer", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: confirmNextModule, className: "px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary transition-colors font-semibold text-sm cursor-pointer", children: "Yes, Proceed" })
      ] })
    ] }) }),
    showDirectionsModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface border border-outline-variant/40 rounded-2xl p-6 max-w-lg w-full shark-shadow animate-scale-in flex flex-col max-h-[90vh]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-on-surface", children: "Test Directions" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowDirectionsModal(false), className: "p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer", children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-[20px]" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto pr-2", children: showMathTools ? mathDirections : rwDirections }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 border-t border-outline-variant/40 mt-4", children: /* @__PURE__ */ jsx("button", { onClick: () => setShowDirectionsModal(false), className: "px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary transition-colors font-semibold text-sm cursor-pointer", children: "Close" }) })
    ] }) }),
    showCalculatorModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface border border-outline-variant/40 rounded-2xl p-6 max-w-4xl w-full shark-shadow animate-scale-in flex flex-col max-h-[90vh]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Icon, { name: "calculate", className: "text-primary text-[24px]" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-on-surface", children: "Desmos Graphing Calculator" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowCalculatorModal(false), className: "p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer", children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-[20px]" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-xl overflow-hidden bg-surface-container-low min-h-[500px]", children: /* @__PURE__ */ jsx("iframe", { src: "https://www.desmos.com/testing/cb-digital-sat/graphing", className: "w-full h-full min-h-[500px] border-0", title: "Desmos Graphing Calculator" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 border-t border-outline-variant/40 mt-4", children: /* @__PURE__ */ jsx("button", { onClick: () => setShowCalculatorModal(false), className: "px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary transition-colors font-semibold text-sm cursor-pointer", children: "Close Calculator" }) })
    ] }) }),
    showReferenceModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface border border-outline-variant/40 rounded-2xl p-6 max-w-3xl w-full shark-shadow animate-scale-in flex flex-col max-h-[90vh]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Icon, { name: "functions", className: "text-primary text-[24px]" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-on-surface", children: "Math Reference Sheet" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowReferenceModal(false), className: "p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer", children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-[20px]" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto pr-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Circle" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { children: "Area: \\(A = \\pi r^2\\)" }),
                /* @__PURE__ */ jsx("p", { children: "Circumference: \\(C = 2\\pi r\\)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 rounded-full border-2 border-primary/40 flex items-center justify-center relative", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary absolute" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-1 top-4", children: "r" }),
                /* @__PURE__ */ jsx("div", { className: "w-6 h-0.5 bg-primary/40 absolute left-6 top-6" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Rectangle" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Area: \\(A = l w\\)" }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-16 h-10 border-2 border-primary/40 flex items-center justify-center relative", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute bottom-0.5", children: "l" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-1", children: "w" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Triangle" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Area: \\(A = \\frac{1}{2} b h\\)" }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-14 h-12 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("polygon", { points: "50,10 10,90 90,90" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "10", x2: "50", y2: "90", strokeDasharray: "3" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-10 bottom-0.5", children: "b" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[54px] top-6", children: "h" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Right Triangle" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { children: "Pythagorean Theorem:" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold", children: "\\(c^2 = a^2 + b^2\\)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-14 h-12 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("polygon", { points: "10,10 10,90 90,90" }),
                  /* @__PURE__ */ jsx("rect", { x: "10", y: "80", width: "10", height: "10" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[45px] top-[40px]", children: "c" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-2 top-[40px]", children: "a" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[45px] bottom-0.5", children: "b" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Cylinder" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Volume: \\(V = \\pi r^2 h\\)" }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-14 h-12 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "20", rx: "30", ry: "10" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "80", rx: "30", ry: "10" }),
                  /* @__PURE__ */ jsx("line", { x1: "20", y1: "20", x2: "20", y2: "80" }),
                  /* @__PURE__ */ jsx("line", { x1: "80", y1: "20", x2: "80", y2: "80" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "20", x2: "80", y2: "20", strokeDasharray: "2" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-6 top-1", children: "r" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-1 top-[40px]", children: "h" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Sphere" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Volume: \\(V = \\frac{4}{3} \\pi r^3\\)" }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "40" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "50", rx: "40", ry: "12", strokeDasharray: "3" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "50", x2: "90", y2: "50", strokeDasharray: "2" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-4 top-4", children: "r" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Cone" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Volume: \\(V = \\frac{1}{3} \\pi r^2 h\\)" }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-14 h-12 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "80", rx: "30", ry: "10" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "10", x2: "20", y2: "80" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "10", x2: "80", y2: "80" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "10", x2: "50", y2: "80", strokeDasharray: "3" }),
                  /* @__PURE__ */ jsx("line", { x1: "50", y1: "80", x2: "80", y2: "80", strokeDasharray: "2" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-6 bottom-2", children: "r" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-9 top-8", children: "h" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-2", children: "Rectangular Prism" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Volume: \\(V = l w h\\)" }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-16 h-12 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("rect", { x: "10", y: "30", width: "50", height: "40" }),
                  /* @__PURE__ */ jsx("rect", { x: "30", y: "10", width: "50", height: "40", strokeDasharray: "2" }),
                  /* @__PURE__ */ jsx("line", { x1: "10", y1: "30", x2: "30", y2: "10" }),
                  /* @__PURE__ */ jsx("line", { x1: "60", y1: "30", x2: "80", y2: "10" }),
                  /* @__PURE__ */ jsx("line", { x1: "10", y1: "70", x2: "30", y2: "50" }),
                  /* @__PURE__ */ jsx("line", { x1: "60", y1: "70", x2: "80", y2: "50" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-6 bottom-[34px]", children: "l" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute right-2 top-2", children: "w" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-1 top-[46px]", children: "h" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-on-surface mb-3", children: "Special Right Triangles" }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-6 text-xs text-on-surface-variant", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-on-surface mb-1", children: "30°-60°-90°" }),
                /* @__PURE__ */ jsx("p", { children: "Opposite 30°: \\(x\\)" }),
                /* @__PURE__ */ jsx("p", { children: "Opposite 60°: \\(x\\sqrt{3}\\)" }),
                /* @__PURE__ */ jsx("p", { children: "Hypotenuse: \\(2x\\)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-20 h-16 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 80", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("polygon", { points: "10,10 10,70 90,70" }),
                  /* @__PURE__ */ jsx("rect", { x: "10", y: "60", width: "10", height: "10" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-4 top-[35px]", children: "x" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[45px] bottom-0.5", children: "x\\(\\sqrt{3}\\)" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[48px] top-[24px]", children: "2x" }),
                /* @__PURE__ */ jsx("span", { className: "text-[8px] absolute left-[22px] bottom-[12px]", children: "30°" }),
                /* @__PURE__ */ jsx("span", { className: "text-[8px] absolute left-[12px] top-[18px]", children: "60°" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-on-surface mb-1", children: "45°-45°-90°" }),
                /* @__PURE__ */ jsx("p", { children: "Legs: \\(s\\)" }),
                /* @__PURE__ */ jsx("p", { children: "Hypotenuse: \\(s\\sqrt{2}\\)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-20 h-16 relative", children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 80", className: "w-full h-full fill-none stroke-primary/40 stroke-2", children: [
                  /* @__PURE__ */ jsx("polygon", { points: "10,10 10,70 70,70" }),
                  /* @__PURE__ */ jsx("rect", { x: "10", y: "60", width: "10", height: "10" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-4 top-[35px]", children: "s" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[35px] bottom-0.5", children: "s" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-primary absolute left-[40px] top-[30px]", children: "s\\(\\sqrt{2}\\)" }),
                /* @__PURE__ */ jsx("span", { className: "text-[8px] absolute left-[22px] bottom-[12px]", children: "45°" }),
                /* @__PURE__ */ jsx("span", { className: "text-[8px] absolute left-[12px] top-[18px]", children: "45°" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs text-on-surface-variant leading-relaxed", children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "The number of degrees of arc in a circle is 360." }),
          /* @__PURE__ */ jsx("li", { children: "The number of radians of arc in a circle is 2\\pi." }),
          /* @__PURE__ */ jsx("li", { children: "The sum of the measures in degrees of the angles of a triangle is 180." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 border-t border-outline-variant/40 mt-4", children: /* @__PURE__ */ jsx("button", { onClick: () => setShowReferenceModal(false), className: "px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary transition-colors font-semibold text-sm cursor-pointer", children: "Close Reference Sheet" }) })
    ] }) })
  ] });
}
export {
  TakeTest as component
};
