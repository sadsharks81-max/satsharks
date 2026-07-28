import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { M as Modal } from "./Modal-IFcukRHK.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { I as Input } from "./Input-3QnCriAW.js";
import { S as Select } from "./Select-DQBG2uP0.js";
import { T as Textarea } from "./Textarea-BWaDv9iL.js";
import { E as EmptyState } from "./EmptyState-CLtSl-5O.js";
import { a as api } from "./router-Be_1-VPB.js";
import "@tanstack/react-router";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "@tanstack/react-query";
function SearchInput({ value, onChange, placeholder = "Search...", debounceMs = 300 }) {
  const [local, setLocal] = useState(value);
  useEffect(() => {
    setLocal(value);
  }, [value]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [local, debounceMs]);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(Icon, { name: "search", className: "absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: local,
        onChange: (e) => setLocal(e.target.value),
        placeholder,
        className: "w-full rounded-xl border border-outline-variant bg-surface-container-low pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      }
    ),
    local && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          setLocal("");
          onChange("");
        },
        className: "absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface",
        children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-[18px]" })
      }
    )
  ] });
}
function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [form, setForm] = useState({
    text: "",
    correctAnswer: "A",
    explanation: "",
    category: "",
    difficulty: "MEDIUM",
    section: "MATH",
    tags: "",
    optA: "",
    optB: "",
    optC: "",
    optD: ""
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSection, setCatSection] = useState("MATH");
  const fetchQuestions = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20"
    });
    if (search) params.set("search", search);
    if (sectionFilter) params.set("section", sectionFilter);
    if (difficultyFilter) params.set("difficulty", difficultyFilter);
    if (statusFilter) params.set("status", statusFilter);
    const res = await api.get(`/api/questions/admin?${params}`);
    if (res.success) {
      setQuestions(res.questions || []);
      setTotalPages(res.pagination?.pages || 1);
    }
    setLoading(false);
  };
  const fetchCategories = async () => {
    const res = await api.get("/api/categories");
    if (res.success) setCategories(res.categories || []);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchQuestions();
  }, [page, search, sectionFilter, difficultyFilter, statusFilter]);
  const openCreate = () => {
    setEditingQ(null);
    setForm({
      text: "",
      correctAnswer: "A",
      explanation: "",
      category: categories[0]?._id || "",
      difficulty: "MEDIUM",
      section: "MATH",
      tags: "",
      optA: "",
      optB: "",
      optC: "",
      optD: ""
    });
    setFormError("");
    setModalOpen(true);
  };
  const openEdit = (q) => {
    setEditingQ(q);
    const cat = typeof q.category === "object" ? q.category._id : q.category;
    setForm({
      text: q.text,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      category: cat,
      difficulty: q.difficulty,
      section: q.section,
      tags: q.tags.join(", "),
      optA: q.options[0]?.text || "",
      optB: q.options[1]?.text || "",
      optC: q.options[2]?.text || "",
      optD: q.options[3]?.text || ""
    });
    setFormError("");
    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.text || !form.optA || !form.optB || !form.optC || !form.optD) {
      setFormError("Question text and all four options are required.");
      return;
    }
    setSubmitting(true);
    const body = {
      text: form.text,
      options: [{
        label: "A",
        text: form.optA
      }, {
        label: "B",
        text: form.optB
      }, {
        label: "C",
        text: form.optC
      }, {
        label: "D",
        text: form.optD
      }],
      correctAnswer: form.correctAnswer,
      explanation: form.explanation,
      category: form.category,
      difficulty: form.difficulty,
      section: form.section,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    };
    const res = editingQ ? await api.put(`/api/questions/${editingQ._id}`, body) : await api.post("/api/questions", body);
    if (res.success) {
      setModalOpen(false);
      fetchQuestions();
    } else setFormError(res.error || "Failed to save question.");
    setSubmitting(false);
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    await api.delete(`/api/questions/${id}`);
    fetchQuestions();
  };
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName) return;
    const res = await api.post("/api/categories", {
      name: catName,
      section: catSection
    });
    if (res.success) {
      fetchCategories();
      setCatModalOpen(false);
      setCatName("");
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin/questions", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Question Bank" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setCatModalOpen(true), className: "inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-semibold hover:bg-surface-container-low transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "category", className: "text-lg" }),
          " Categories"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: openCreate, className: "btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "add", className: "text-lg" }),
          " Add Question"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[200px]", children: /* @__PURE__ */ jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Search questions..." }) }),
      /* @__PURE__ */ jsx(Select, { value: sectionFilter, onChange: (e) => {
        setSectionFilter(e.target.value);
        setPage(1);
      }, options: [{
        value: "",
        label: "All Sections"
      }, {
        value: "MATH",
        label: "Math"
      }, {
        value: "READING_WRITING",
        label: "Reading & Writing"
      }], className: "!w-auto !py-2" }),
      /* @__PURE__ */ jsx(Select, { value: difficultyFilter, onChange: (e) => {
        setDifficultyFilter(e.target.value);
        setPage(1);
      }, options: [{
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
      /* @__PURE__ */ jsx(Select, { value: statusFilter, onChange: (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
      }, options: [{
        value: "",
        label: "All Statuses"
      }, {
        value: "PUBLISHED",
        label: "Published"
      }, {
        value: "DRAFT",
        label: "Draft"
      }, {
        value: "REVIEW",
        label: "Review"
      }], className: "!w-auto !py-2" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading..." }) : questions.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: "help_center", title: "No questions found", description: "Create questions or adjust your filters" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant", children: [
          /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Question" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Difficulty" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-outline-variant/20", children: questions.map((q) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-surface-container-low/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "p-4 text-sm max-w-md", children: [
            /* @__PURE__ */ jsx("p", { className: "line-clamp-2", children: q.text }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-1", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "info", children: q.section === "MATH" ? "Math" : "R&W" }),
              q.source === "AI_EXTRACTED" && /* @__PURE__ */ jsx(Badge, { variant: "accent", children: "AI" }),
              q.tags && q.tags.find((t) => t.startsWith("sat-test-")) && /* @__PURE__ */ jsxs(Badge, { variant: "accent", children: [
                "SAT ",
                q.tags.find((t) => t.startsWith("sat-test-"))?.split("-")[2]
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-sm", children: typeof q.category === "object" ? q.category.name : "—" }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: q.difficulty === "EASY" ? "success" : q.difficulty === "HARD" ? "error" : "warning", children: q.difficulty }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: q.status === "PUBLISHED" ? "success" : q.status === "DRAFT" ? "default" : "warning", children: q.status }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => openEdit(q), className: "px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-sm transition-colors cursor-pointer", children: "Edit" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(q._id), className: "px-3 py-1 bg-error/10 text-error hover:bg-error/20 rounded text-sm transition-colors cursor-pointer", children: "Delete" })
          ] }) })
        ] }, q._id)) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mt-6", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-4 py-2 rounded-lg border border-outline-variant text-sm disabled:opacity-30 hover:bg-surface-container-low transition-colors", children: "Previous" }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-on-surface-variant px-4", children: [
          "Page ",
          page,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setPage(Math.min(totalPages, page + 1)), disabled: page === totalPages, className: "px-4 py-2 rounded-lg border border-outline-variant text-sm disabled:opacity-30 hover:bg-surface-container-low transition-colors", children: "Next" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: editingQ ? "Edit Question" : "Add Question", icon: editingQ ? "edit" : "add_box", maxWidth: "max-w-2xl", children: [
      formError && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Icon, { name: "error", className: "shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: formError })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 max-h-[70vh] overflow-y-auto pr-1", children: [
        /* @__PURE__ */ jsx(Textarea, { label: "Question Text *", value: form.text, onChange: (e) => setForm((p) => ({
          ...p,
          text: e.target.value
        })), rows: 3, required: true, placeholder: "Enter the question..." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant", children: "Answer Options *" }),
          ["A", "B", "C", "D"].map((label) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: `flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${form.correctAnswer === label ? "bg-primary text-on-primary" : "bg-surface-container-high"}`, children: label }),
            /* @__PURE__ */ jsx("input", { type: "text", value: form[`opt${label}`], onChange: (e) => setForm((p) => ({
              ...p,
              [`opt${label}`]: e.target.value
            })), placeholder: `Option ${label}`, className: "flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors", required: true }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setForm((p) => ({
              ...p,
              correctAnswer: label
            })), className: `text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${form.correctAnswer === label ? "bg-primary text-on-primary" : "bg-surface-container-high hover:bg-surface-container-highest"}`, children: form.correctAnswer === label ? "Correct" : "Set" })
          ] }, label))
        ] }),
        /* @__PURE__ */ jsx(Textarea, { label: "Explanation", value: form.explanation, onChange: (e) => setForm((p) => ({
          ...p,
          explanation: e.target.value
        })), rows: 2, placeholder: "Why is this the correct answer?" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx(Select, { label: "Category", value: form.category, onChange: (e) => setForm((p) => ({
            ...p,
            category: e.target.value
          })), options: [{
            value: "",
            label: "Select category"
          }, ...categories.map((c) => ({
            value: c._id,
            label: c.name
          }))] }),
          /* @__PURE__ */ jsx(Select, { label: "Difficulty", value: form.difficulty, onChange: (e) => setForm((p) => ({
            ...p,
            difficulty: e.target.value
          })), options: [{
            value: "EASY",
            label: "Easy"
          }, {
            value: "MEDIUM",
            label: "Medium"
          }, {
            value: "HARD",
            label: "Hard"
          }] }),
          /* @__PURE__ */ jsx(Select, { label: "Section", value: form.section, onChange: (e) => setForm((p) => ({
            ...p,
            section: e.target.value
          })), options: [{
            value: "MATH",
            label: "Math"
          }, {
            value: "READING_WRITING",
            label: "Reading & Writing"
          }] })
        ] }),
        /* @__PURE__ */ jsx(Input, { label: "Tags (comma separated)", value: form.tags, onChange: (e) => setForm((p) => ({
          ...p,
          tags: e.target.value
        })), placeholder: "algebra, equations" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-4 border-t border-outline-variant/30", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setModalOpen(false), className: "flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: submitting, className: "flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer", children: submitting ? "Saving..." : "Save Question" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Modal, { open: catModalOpen, onClose: () => setCatModalOpen(false), title: "Manage Categories", icon: "category", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-6", children: [
        categories.map((c) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between px-4 py-2.5 rounded-lg border border-outline-variant/30", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: c.name }),
          /* @__PURE__ */ jsx(Badge, { variant: "info", className: "ml-2", children: c.section === "MATH" ? "Math" : "R&W" })
        ] }) }, c._id)),
        categories.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant text-center py-4", children: "No categories yet" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateCategory, className: "flex gap-3 items-end", children: [
        /* @__PURE__ */ jsx(Input, { label: "New Category", value: catName, onChange: (e) => setCatName(e.target.value), placeholder: "e.g. Algebra", className: "flex-1" }),
        /* @__PURE__ */ jsx(Select, { value: catSection, onChange: (e) => setCatSection(e.target.value), options: [{
          value: "MATH",
          label: "Math"
        }, {
          value: "READING_WRITING",
          label: "R&W"
        }], className: "!w-auto" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-accent transition-colors cursor-pointer", children: "Add" })
      ] })
    ] })
  ] });
}
export {
  AdminQuestions as component
};
