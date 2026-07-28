import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { S as Select } from "./Select-DQBG2uP0.js";
import { T as Textarea } from "./Textarea-BWaDv9iL.js";
import { e as Route, a as api } from "./router-Be_1-VPB.js";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "@tanstack/react-query";
function ReviewUpload() {
  const {
    uploadId
  } = Route.useParams();
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  useEffect(() => {
    api.get(`/api/uploads/${uploadId}`).then((res) => {
      if (res.success && res.upload) {
        setUpload(res.upload);
        setQuestions(res.upload.extractedQuestions || []);
        setReviewNotes(res.upload.reviewNotes || "");
      }
      setLoading(false);
    });
  }, [uploadId]);
  const updateQuestion = (idx, field, value) => {
    setQuestions((prev) => prev.map((q, i) => i === idx ? {
      ...q,
      [field]: value
    } : q));
  };
  const toggleApproval = (idx) => {
    setQuestions((prev) => prev.map((q, i) => i === idx ? {
      ...q,
      approved: !q.approved
    } : q));
  };
  const handleSaveReview = async () => {
    setSaving(true);
    await api.put(`/api/uploads/${uploadId}/review`, {
      extractedQuestions: questions,
      reviewNotes
    });
    setSaving(false);
  };
  const handlePublish = async () => {
    const approvedCount2 = questions.filter((q) => q.approved).length;
    if (approvedCount2 === 0) {
      alert("No questions approved for publishing.");
      return;
    }
    if (!confirm(`Publish ${approvedCount2} approved questions to the question bank?`)) return;
    setPublishing(true);
    await handleSaveReview();
    const res = await api.post(`/api/uploads/${uploadId}/publish`, {});
    if (res.success) {
      navigate({
        to: "/admin/uploads"
      });
    }
    setPublishing(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsx(AdminLayout, { activeItem: "/admin/uploads", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading..." }) });
  }
  if (!upload) {
    return /* @__PURE__ */ jsx(AdminLayout, { activeItem: "/admin/uploads", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-error", children: "Upload not found" }) });
  }
  const approvedCount = questions.filter((q) => q.approved).length;
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin/uploads", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Review Extracted Questions" }),
        /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant text-sm mt-1", children: [
          upload.title,
          " — ",
          upload.fileName
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(Badge, { variant: upload.status === "PUBLISHED" ? "success" : "info", children: upload.status }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("button", { onClick: handleSaveReview, disabled: saving, className: "inline-flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-semibold hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer", children: [
        /* @__PURE__ */ jsx(Icon, { name: "save", className: "text-lg" }),
        " ",
        saving ? "Saving..." : "Save Review"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: handlePublish, disabled: publishing || approvedCount === 0, className: "btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all disabled:opacity-50 cursor-pointer", children: [
        /* @__PURE__ */ jsx(Icon, { name: "publish", className: "text-lg" }),
        " Publish ",
        approvedCount,
        " Questions"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6 mb-8", children: questions.map((q, idx) => /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-6 border shark-shadow ${q.approved ? "border-primary/40 bg-primary/5" : "border-outline-variant/40 bg-surface-container-lowest"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-on-surface-variant", children: [
            "Q",
            idx + 1
          ] }),
          q.confidence > 0 && /* @__PURE__ */ jsxs(Badge, { variant: q.confidence >= 0.8 ? "success" : q.confidence >= 0.5 ? "warning" : "error", children: [
            Math.round(q.confidence * 100),
            "% confidence"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => toggleApproval(idx), className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${q.approved ? "bg-primary text-on-primary" : "bg-surface-container-high hover:bg-surface-container-highest"}`, children: [
          /* @__PURE__ */ jsx(Icon, { name: q.approved ? "check_circle" : "radio_button_unchecked", className: "text-[18px]" }),
          q.approved ? "Approved" : "Approve"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Textarea, { label: "Question Text", value: q.text, onChange: (e) => updateQuestion(idx, "text", e.target.value), rows: 2 }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 mt-3", children: q.options.map((opt, oi) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: `h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${q.correctAnswer === opt.label ? "bg-primary text-on-primary" : "bg-surface-container-high"}`, children: opt.label }),
        /* @__PURE__ */ jsx("input", { type: "text", value: opt.text, onChange: (e) => {
          const newOpts = [...q.options];
          newOpts[oi] = {
            ...newOpts[oi],
            text: e.target.value
          };
          updateQuestion(idx, "options", newOpts);
        }, className: "flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary transition-colors" })
      ] }, oi)) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 mt-3", children: [
        /* @__PURE__ */ jsx(Select, { label: "Correct Answer", value: q.correctAnswer, onChange: (e) => updateQuestion(idx, "correctAnswer", e.target.value), options: [{
          value: "A",
          label: "A"
        }, {
          value: "B",
          label: "B"
        }, {
          value: "C",
          label: "C"
        }, {
          value: "D",
          label: "D"
        }] }),
        /* @__PURE__ */ jsx(Select, { label: "Difficulty", value: q.difficulty, onChange: (e) => updateQuestion(idx, "difficulty", e.target.value), options: [{
          value: "EASY",
          label: "Easy"
        }, {
          value: "MEDIUM",
          label: "Medium"
        }, {
          value: "HARD",
          label: "Hard"
        }] }),
        /* @__PURE__ */ jsx(Select, { label: "Category", value: q.category, onChange: (e) => updateQuestion(idx, "category", e.target.value), options: [{
          value: "Algebra",
          label: "Algebra"
        }, {
          value: "Geometry",
          label: "Geometry"
        }, {
          value: "Reading Comprehension",
          label: "Reading Comprehension"
        }, {
          value: "Grammar",
          label: "Grammar"
        }] })
      ] })
    ] }, idx)) }),
    /* @__PURE__ */ jsx(Textarea, { label: "Review Notes", value: reviewNotes, onChange: (e) => setReviewNotes(e.target.value), rows: 3, placeholder: "Add notes about this review..." })
  ] });
}
export {
  ReviewUpload as component
};
