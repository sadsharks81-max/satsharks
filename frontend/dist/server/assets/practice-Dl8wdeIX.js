import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as StudentLayout } from "./StudentLayout-BRfqHLM0.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { S as Select } from "./Select-DQBG2uP0.js";
import { E as EmptyState } from "./EmptyState-CLtSl-5O.js";
import { a as api } from "./router-Be_1-VPB.js";
import "@tanstack/react-router";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "./Footer-CN17TUqH.js";
import "@tanstack/react-query";
function Practice() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0
  });
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    api.get("/api/categories").then((res) => {
      if (res.success) setCategories(res.categories || []);
    });
  }, []);
  const fetchQuestions = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (section) params.set("section", section);
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);
    params.set("limit", "50");
    const res = await api.get(`/api/questions?${params}`);
    if (res.success) {
      setQuestions(res.questions || []);
      setCurrentIdx(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchQuestions();
  }, [section, difficulty, category]);
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !questions[currentIdx]) return;
    const res = await api.post("/api/practice/answer", {
      questionId: questions[currentIdx]._id,
      selectedAnswer,
      timeSpent: 0
    });
    if (res.success) {
      setResult(res.result);
      setShowResult(true);
      setStats((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (res.result.isCorrect ? 1 : 0)
      }));
    }
  };
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    }
  };
  const q = questions[currentIdx];
  return /* @__PURE__ */ jsxs(StudentLayout, { activeItem: "/dashboard/practice", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-1", children: "Practice Questions" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm", children: "Answer one question at a time with instant feedback" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "success", children: [
          stats.correct,
          " correct"
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "default", children: [
          stats.total,
          " answered"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 mb-8", children: [
      /* @__PURE__ */ jsx(Select, { label: "", value: section, onChange: (e) => setSection(e.target.value), options: [{
        value: "",
        label: "All Sections"
      }, {
        value: "READING_WRITING",
        label: "Reading & Writing"
      }, {
        value: "MATH",
        label: "Math"
      }], className: "!w-auto !py-2" }),
      /* @__PURE__ */ jsx(Select, { label: "", value: difficulty, onChange: (e) => setDifficulty(e.target.value), options: [{
        value: "",
        label: "All Difficulties"
      }, {
        value: "EASY",
        label: "Easy"
      }, {
        value: "MEDIUM",
        label: "Medium"
      }, {
        value: "HARD",
        label: "Hard"
      }], className: "!w-auto !py-2" }),
      /* @__PURE__ */ jsx(Select, { label: "", value: category, onChange: (e) => setCategory(e.target.value), options: [{
        value: "",
        label: "All Categories"
      }, ...categories.map((c) => ({
        value: c._id,
        label: c.name
      }))], className: "!w-auto !py-2" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading questions..." }) : !q ? /* @__PURE__ */ jsx(EmptyState, { icon: "help_center", title: "No questions found", description: "Try adjusting your filters" }) : /* @__PURE__ */ jsxs("div", { className: "max-w-[800px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-on-surface-variant", children: [
          "Question ",
          currentIdx + 1,
          " of ",
          questions.length
        ] }),
        /* @__PURE__ */ jsx(Badge, { variant: q.difficulty === "EASY" ? "success" : q.difficulty === "MEDIUM" ? "warning" : "error", children: q.difficulty })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/40 shark-shadow mb-6", children: /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed whitespace-pre-wrap", children: q.text }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-6", children: q.options.map((opt) => {
        const isSelected = selectedAnswer === opt.label;
        let optStyle = "";
        if (showResult && result) {
          if (opt.label === result.correctAnswer) {
            optStyle = "border-primary bg-primary/10";
          } else if (isSelected && !result.isCorrect) {
            optStyle = "border-error bg-error/10";
          }
        } else if (isSelected) {
          optStyle = "border-primary bg-primary/5";
        }
        return /* @__PURE__ */ jsxs("button", { onClick: () => !showResult && setSelectedAnswer(opt.label), disabled: showResult, className: `w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all cursor-pointer disabled:cursor-default ${optStyle || "border-outline-variant/40 hover:border-primary/40"}`, children: [
          /* @__PURE__ */ jsx("span", { className: `flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold ${isSelected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"}`, children: opt.label }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: opt.text }),
          showResult && opt.label === result?.correctAnswer && /* @__PURE__ */ jsx(Icon, { name: "check_circle", className: "ml-auto text-primary text-[20px]" }),
          showResult && isSelected && !result?.isCorrect && opt.label !== result?.correctAnswer && /* @__PURE__ */ jsx(Icon, { name: "cancel", className: "ml-auto text-error text-[20px]" })
        ] }, opt.label);
      }) }),
      showResult && result && /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-5 mb-6 ${result.isCorrect ? "bg-primary/10 border border-primary/20" : "bg-error/10 border border-error/20"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Icon, { name: result.isCorrect ? "check_circle" : "cancel", className: `text-[22px] ${result.isCorrect ? "text-primary" : "text-error"}` }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: result.isCorrect ? "Correct!" : "Incorrect" })
        ] }),
        result.explanation && /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant", children: result.explanation })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: !showResult ? /* @__PURE__ */ jsx("button", { onClick: handleSubmitAnswer, disabled: !selectedAnswer, className: "flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm disabled:opacity-40 hover:bg-accent transition-colors cursor-pointer", children: "Check Answer" }) : /* @__PURE__ */ jsxs("button", { onClick: handleNext, disabled: currentIdx >= questions.length - 1, className: "flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm disabled:opacity-40 hover:bg-accent transition-colors cursor-pointer", children: [
        "Next Question ",
        /* @__PURE__ */ jsx(Icon, { name: "arrow_forward", className: "text-[16px] inline ml-1" })
      ] }) })
    ] })
  ] });
}
export {
  Practice as component
};
