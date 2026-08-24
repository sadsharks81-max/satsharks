import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Modal } from "../../components/ui/Modal";
import { MathEditorModal } from "../../components/ui/MathEditorModal";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { SearchInput } from "../../components/ui/SearchInput";
import { EmptyState } from "../../components/ui/EmptyState";
import { api, getBackendUrl, resolveImageUrl } from "../../services/api";
import type { Question, QuestionCategory } from "../../types";
import { renderFormattedText } from "../../utils/format";

export const Route = createFileRoute("/admin/questions")({
  component: AdminQuestions,
});

const MATH_SYMBOLS = [
  { label: "Fraction", latex: "$\\frac{a}{b}$", display: "a/b" },
  { label: "Exponent", latex: "$x^2$", display: "x²" },
  { label: "Subscript", latex: "$x_n$", display: "xₙ" },
  { label: "Square Root", latex: "$\\sqrt{x}$", display: "√x" },
  { label: "Radical", latex: "$\\sqrt[n]{x}$", display: "ⁿ√x" },
  { label: "Pi", latex: "$\\pi$", display: "π" },
  { label: "Theta", latex: "$\\theta$", display: "θ" },
  { label: "Plus-Minus", latex: "$\\pm$", display: "±" },
  { label: "Not Equal", latex: "$\\neq$", display: "≠" },
  { label: "Greater/Equal", latex: "$\\ge$", display: "≥" },
  { label: "Less/Equal", latex: "$\\le$", display: "≤" },
  { label: "Times", latex: "$\\times$", display: "×" },
];

const insertLatex = (
  latex: string, 
  fieldName: string, 
  setForm: React.Dispatch<React.SetStateAction<any>>,
  inputId: string
) => {
  const input = document.getElementById(inputId) as HTMLTextAreaElement | HTMLInputElement;
  if (input) {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const val = input.value || "";
    const newVal = val.substring(0, start) + latex + val.substring(end);
    setForm((p: any) => ({ ...p, [fieldName]: newVal }));
    // refocus and set cursor inside the math signs
    setTimeout(() => {
      input.focus();
      const cursorOffset = latex.endsWith("$") ? latex.length - 1 : latex.length;
      input.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 50);
  } else {
    setForm((p: any) => ({ ...p, [fieldName]: (p[fieldName] || "") + latex }));
  }
};

function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Create/Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);
  const [questionType, setQuestionType] = useState<"MCQ" | "SPR">("MCQ");
  const [form, setForm] = useState({
    text: "", correctAnswer: "A", explanation: "", category: "", difficulty: "MEDIUM", section: "MATH",
    tags: "", imageUrl: "",
    optA: "", optB: "", optC: "", optD: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  const [mathEditorOpen, setMathEditorOpen] = useState(false);
  const [mathActiveField, setMathActiveField] = useState<{ name: string; inputId: string } | null>(null);

  const openVisualMathEditor = (fieldName: string, inputId: string) => {
    setMathActiveField({ name: fieldName, inputId });
    setMathEditorOpen(true);
  };

  const handleInsertVisualMath = (latex: string) => {
    if (mathActiveField) {
      insertLatex(latex, mathActiveField.name, setForm, mathActiveField.inputId);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    let file: File | null = null;
    
    if ('dataTransfer' in e) {
      file = (e as React.DragEvent).dataTransfer.files[0];
    } else if (e.target && 'files' in e.target && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files![0];
    }
    
    if (!file) return;
    
    setIsUploadingImage(true);
    setImageUploadError("");
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const token = localStorage.getItem("accessToken");
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = `${getBackendUrl()}/api/uploads/image`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm(p => ({ ...p, imageUrl: data.url }));
      } else {
        setImageUploadError(data.error || "Failed to upload image.");
      }
    } catch (err: any) {
      setImageUploadError(err.message || "Network error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSection, setCatSection] = useState("MATH");

  const fetchQuestions = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (sectionFilter) params.set("section", sectionFilter);
    if (difficultyFilter) params.set("difficulty", difficultyFilter);
    if (statusFilter) params.set("status", statusFilter);

    const res = await api.get(`/api/questions/admin?${params}`);
    if (res.success) {
      setQuestions(res.questions || []);
      setTotalPages(res.pagination?.pages || 1);
      setSelectedQuestionIds(new Set());
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await api.get("/api/categories");
    if (res.success) setCategories(res.categories || []);
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchQuestions(); }, [page, search, sectionFilter, difficultyFilter, statusFilter]);

  const openCreate = () => {
    setEditingQ(null);
    setQuestionType("MCQ");
    setForm({ text: "", correctAnswer: "A", explanation: "", category: categories[0]?._id || "", difficulty: "MEDIUM", section: "MATH", tags: "", imageUrl: "", optA: "", optB: "", optC: "", optD: "" });
    setFormError("");
    setImageUploadError("");
    setModalOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditingQ(q);
    const cat = typeof q.category === "object" && q.category !== null ? q.category._id : (typeof q.category === "string" ? q.category : "");
    const isSpr = !q.options || q.options.length === 0;
    setQuestionType(isSpr ? "SPR" : "MCQ");
    setForm({
      text: q.text, correctAnswer: q.correctAnswer, explanation: q.explanation,
      category: cat, difficulty: q.difficulty, section: q.section,
      tags: q.tags.join(", "), imageUrl: q.imageUrl || "",
      optA: q.options[0]?.text || "", optB: q.options[1]?.text || "",
      optC: q.options[2]?.text || "", optD: q.options[3]?.text || "",
    });
    setFormError("");
    setImageUploadError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (questionType === "MCQ") {
      if (!form.text || !form.optA || !form.optB || !form.optC || !form.optD) {
        setFormError("Question text and all four options are required for multiple choice questions.");
        return;
      }
    } else {
      if (!form.text || !form.correctAnswer) {
        setFormError("Question text and correct answer are required.");
        return;
      }
    }
    setSubmitting(true);
    const body: any = {
      text: form.text,
      options: questionType === "MCQ" ? [
        { label: "A", text: form.optA }, { label: "B", text: form.optB },
        { label: "C", text: form.optC }, { label: "D", text: form.optD },
      ] : [],
      correctAnswer: form.correctAnswer,
      explanation: form.explanation,
      category: form.category,
      difficulty: form.difficulty,
      section: form.section,
      imageUrl: form.imageUrl,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editingQ) {
      if (form.imageUrl !== (editingQ.imageUrl || "")) {
        body.status = "UPDATED";
      } else {
        body.status = editingQ.status;
      }
    } else {
      body.status = form.imageUrl ? "UPDATED" : "PUBLISHED";
    }

    const res = editingQ
      ? await api.put(`/api/questions/${editingQ._id}`, body)
      : await api.post("/api/questions", body);

    if (res.success) { setModalOpen(false); fetchQuestions(); }
    else setFormError(res.error || "Failed to save question.");
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    const res = await api.delete(`/api/questions/${id}`);
    if (res.success) fetchQuestions();
    else alert(res.error || "Failed to delete question.");
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCurrentPageSelection = () => {
    const currentPageIds = questions.map((question) => question._id);
    const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedQuestionIds.has(id));
    setSelectedQuestionIds(allSelected ? new Set() : new Set(currentPageIds));
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedQuestionIds];
    if (ids.length === 0) return;
    if (!confirm(`Permanently delete ${ids.length} selected question(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const res = await api.post("/api/questions/bulk-delete", { questionIds: ids });
    setBulkDeleting(false);
    if (res.success) {
      if (ids.length === questions.length && page > 1) setPage((current) => current - 1);
      else fetchQuestions();
    } else {
      alert(res.error || "Failed to delete selected questions.");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    const res = await api.post("/api/categories", { name: catName, section: catSection });
    if (res.success) {
      fetchCategories();
      setCatModalOpen(false);
      setCatName("");
    }
  };

  // Category Edit / Delete States & Handlers
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatSection, setEditingCatSection] = useState("MATH");

  const startEditCategory = (c: QuestionCategory) => {
    setEditingCatId(c._id);
    setEditingCatName(c.name);
    setEditingCatSection(c.section);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCatName) return;
    const res = await api.put(`/api/categories/${id}`, {
      name: editingCatName,
      section: editingCatSection
    });
    if (res.success) {
      fetchCategories();
      setEditingCatId(null);
    }
  };

  const handleDeleteCategory = async (category: QuestionCategory) => {
    const questionCount = category.questionCount || 0;
    if (!confirm(`Permanently delete "${category.name}" and all ${questionCount} question(s) inside it? This cannot be undone.`)) {
      return;
    }
    const res = await api.delete(`/api/categories/${category._id}`);
    if (res.success) {
      fetchCategories();
      fetchQuestions();
    } else {
      alert(res.error || "Failed to delete category.");
    }
  };

  return (
    <AdminLayout activeItem="/admin/questions">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Question Bank</h1>
        <div className="flex gap-3">
          <button onClick={() => setCatModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">
            <Icon name="category" className="text-lg" /> Categories
          </button>
          <button onClick={openCreate} className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all cursor-pointer">
            <Icon name="add" className="text-lg" /> Add Question
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search questions..." />
        </div>
        <Select value={sectionFilter} onChange={(e) => { setSectionFilter(e.target.value); setPage(1); }} options={[{ value: "", label: "All Sections" }, { value: "MATH", label: "Math" }, { value: "READING_WRITING", label: "Reading & Writing" }]} className="!w-auto !py-2" />
        <Select value={difficultyFilter} onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1); }} options={[{ value: "", label: "All Difficulties" }, { value: "EASY", label: "Easy" }, { value: "MEDIUM", label: "Medium" }, { value: "HARD", label: "Hard" }]} className="!w-auto !py-2" />
        <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} options={[{ value: "", label: "All Statuses" }, { value: "PUBLISHED", label: "Published" }, { value: "UPLOADED", label: "Uploaded" }, { value: "UPDATED", label: "Updated" }, { value: "REVIEW", label: "Review" }]} className="!w-auto !py-2" />
        {selectedQuestionIds.size > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-error px-4 py-2.5 text-sm font-semibold text-white hover:bg-error/90 disabled:opacity-50"
          >
            <Icon name="delete_sweep" className="text-lg" />
            {bulkDeleting ? "Deleting..." : `Delete Selected (${selectedQuestionIds.size})`}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : questions.length === 0 ? (
        <EmptyState icon="help_center" title="No questions found" description="Create questions or adjust your filters" />
      ) : (
        <>
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="p-4 font-semibold">
                    <input
                      type="checkbox"
                      aria-label="Select all questions on this page"
                      checked={questions.length > 0 && questions.every((question) => selectedQuestionIds.has(question._id))}
                      onChange={toggleCurrentPageSelection}
                      className="h-4 w-4 accent-primary"
                    />
                  </th>
                  <th className="p-4 font-semibold">Question</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Difficulty</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        aria-label={`Select question ${q._id}`}
                        checked={selectedQuestionIds.has(q._id)}
                        onChange={() => toggleQuestionSelection(q._id)}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="p-4 text-sm max-w-md">
                      <p className="line-clamp-2">{renderFormattedText(q.text)}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="info">{q.section === "MATH" ? "Math" : "R&W"}</Badge>
                        {q.source === "AI_EXTRACTED" && <Badge variant="accent">AI</Badge>}
                        {q.tags && q.tags.find(t => t.startsWith("sat-test-")) && (
                          <Badge variant="accent">
                            SAT {q.tags.find(t => t.startsWith("sat-test-"))?.split("-")[2]}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{typeof q.category === "object" && q.category !== null ? q.category.name : (typeof q.category === "string" ? q.category : "Uncategorized")}</td>
                    <td className="p-4">
                      <Badge variant={q.difficulty === "EASY" ? "success" : q.difficulty === "HARD" ? "error" : "warning"}>{q.difficulty}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={q.status === "PUBLISHED" ? "success" : q.status === "UPLOADED" ? "default" : q.status === "UPDATED" ? "accent" : "warning"}>
                        {q.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(q)} className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-sm transition-colors cursor-pointer">Edit</button>
                        <button onClick={() => handleDelete(q._id)} className="px-3 py-1 bg-error/10 text-error hover:bg-error/20 rounded text-sm transition-colors cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-outline-variant text-sm disabled:opacity-30 hover:bg-surface-container-low transition-colors">Previous</button>
              <span className="text-sm text-on-surface-variant px-4">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border border-outline-variant text-sm disabled:opacity-30 hover:bg-surface-container-low transition-colors">Next</button>
            </div>
          )}
        </>
      )}

      {/* Question Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingQ ? "Edit Question" : "Add Question"} icon={editingQ ? "edit" : "add_box"} maxWidth="max-w-2xl">
        {formError && (
          <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
            <Icon name="error" className="shrink-0" /><span>{formError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">Question Image (Optional)</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : 'hover:border-primary border-outline-variant/50 bg-surface-container-low'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageUpload}
            >
              {form.imageUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={form.imageUrl} alt="Uploaded preview" className="max-h-32 rounded-lg border border-outline-variant/30" />
                  <div className="flex gap-2">
                    <label className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-xs font-semibold transition-colors cursor-pointer text-on-surface">
                      Change Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                    </label>
                    <button type="button" onClick={() => setForm(p => ({ ...p, imageUrl: "" }))} className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer h-full min-h-[100px]">
                  <Icon name="cloud_upload" className="text-3xl text-on-surface-variant/50 mb-2" />
                  <span className="text-sm text-on-surface-variant font-medium">
                    {isUploadingImage ? "Uploading..." : "Drag and drop an image here or click to browse"}
                  </span>
                  {imageUploadError && <span className="text-xs text-error mt-2">{imageUploadError}</span>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Question Text *</label>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2.5 py-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-low mb-1 overflow-x-auto max-w-full items-center">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-on-surface-variant mr-1">Math Symbols:</span>
              <button
                type="button"
                onClick={() => openVisualMathEditor("text", "q-bank-text")}
                className="px-2 py-0.5 rounded bg-primary text-on-primary hover:bg-accent text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Icon name="functions" className="text-[12px]" />
                <span>Visual Editor</span>
              </button>
              {MATH_SYMBOLS.map((sym) => (
                <button
                  key={sym.label}
                  type="button"
                  onClick={() => insertLatex(sym.latex, "text", setForm, "q-bank-text")}
                  className="px-1.5 py-0.5 rounded bg-surface hover:bg-surface-container-high text-[10px] font-bold text-primary transition-colors border border-outline-variant/40 cursor-pointer"
                  title={`Insert ${sym.label}`}
                >
                  {sym.latex.replace(/\$/g, "")}
                </button>
              ))}
            </div>
            <Textarea
              id="q-bank-text"
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              rows={3}
              required
              placeholder="Enter the question..."
            />
            {/* Live preview */}
            <div className="mt-1.5 p-3 rounded-xl border border-primary/20 bg-primary/5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary block mb-0.5">Live Math Preview:</span>
              <div className="text-xs font-medium text-on-surface whitespace-pre-wrap leading-relaxed min-h-[16px]">
                {renderFormattedText(form.text || "Type math equations wrapped in $...")}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Question Type"
              value={questionType}
              onChange={(e) => {
                const newType = e.target.value as "MCQ" | "SPR";
                setQuestionType(newType);
                if (newType === "SPR") {
                  if (["A", "B", "C", "D"].includes(form.correctAnswer)) {
                    setForm(p => ({ ...p, correctAnswer: "" }));
                  }
                } else {
                  if (!["A", "B", "C", "D"].includes(form.correctAnswer)) {
                    setForm(p => ({ ...p, correctAnswer: "A" }));
                  }
                }
              }}
              options={[
                { value: "MCQ", label: "Multiple Choice (MCQ)" },
                { value: "SPR", label: "Fill-in-the-blank (SPR)" }
              ]}
            />
          </div>

          {questionType === "MCQ" ? (
            <div className="space-y-3">
              <label className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">Answer Options *</label>
              {(["A", "B", "C", "D"] as const).map((label) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${form.correctAnswer === label ? "bg-primary text-on-primary" : "bg-surface-container-high"}`}>{label}</span>
                    <input
                      id={`q-bank-opt${label}`}
                      type="text"
                      value={form[`opt${label}` as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [`opt${label}`]: e.target.value }))}
                      placeholder={`Option ${label}`}
                      className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, correctAnswer: label }))} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${form.correctAnswer === label ? "bg-primary text-on-primary" : "bg-surface-container-high hover:bg-surface-container-highest"}`}>
                      {form.correctAnswer === label ? "Correct" : "Set"}
                    </button>
                  </div>
                  {/* Quick math symbol bar for options */}
                  <div className="flex flex-wrap gap-1 pl-11 overflow-x-auto items-center">
                    <button
                      type="button"
                      onClick={() => openVisualMathEditor(`opt${label}`, `q-bank-opt${label}`)}
                      className="px-1.5 py-0.5 rounded bg-primary text-on-primary hover:bg-accent text-[9px] font-bold transition-all cursor-pointer flex items-center gap-0.5 shrink-0"
                    >
                      <Icon name="functions" className="text-[10px]" />
                      <span>Visual Editor</span>
                    </button>
                    {MATH_SYMBOLS.map((sym) => (
                      <button
                        key={sym.label}
                        type="button"
                        onClick={() => insertLatex(sym.latex, `opt${label}`, setForm, `q-bank-opt${label}`)}
                        className="px-1 py-0.5 rounded bg-surface hover:bg-surface-container-high text-[9px] font-semibold text-primary transition-colors border border-outline-variant/30 cursor-pointer"
                      >
                        {sym.latex.replace(/\$/g, "")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                label="Correct Answer *"
                value={form.correctAnswer}
                onChange={(e) => setForm(p => ({ ...p, correctAnswer: e.target.value }))}
                required
                placeholder="e.g. 5, -1/2, or 4.25 (support multiple options using 'or')"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Explanation</label>
            <div className="flex flex-wrap gap-1.5 px-2.5 py-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-low mb-1 overflow-x-auto max-w-full items-center">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-on-surface-variant mr-1">Math Symbols:</span>
              <button
                type="button"
                onClick={() => openVisualMathEditor("explanation", "q-bank-expl")}
                className="px-2 py-0.5 rounded bg-primary text-on-primary hover:bg-accent text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Icon name="functions" className="text-[12px]" />
                <span>Visual Editor</span>
              </button>
              {MATH_SYMBOLS.map((sym) => (
                <button
                  key={sym.label}
                  type="button"
                  onClick={() => insertLatex(sym.latex, "explanation", setForm, "q-bank-expl")}
                  className="px-1.5 py-0.5 rounded bg-surface hover:bg-surface-container-high text-[10px] font-bold text-primary transition-colors border border-outline-variant/40 cursor-pointer"
                  title={`Insert ${sym.label}`}
                >
                  {sym.latex.replace(/\$/g, "")}
                </button>
              ))}
            </div>
            <Textarea
              id="q-bank-expl"
              value={form.explanation}
              onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
              rows={2}
              placeholder="Why is this the correct answer?"
            />
            {/* Live preview */}
            <div className="mt-1.5 p-3 rounded-xl border border-primary/20 bg-primary/5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary block mb-0.5">Live Math Preview:</span>
              <div className="text-xs font-medium text-on-surface whitespace-pre-wrap leading-relaxed min-h-[16px]">
                {renderFormattedText(form.explanation || "Type explanation math equations wrapped in $...")}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              options={[{ value: "", label: "Select category" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
            />
            <Select label="Difficulty" value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))} options={[{ value: "EASY", label: "Easy" }, { value: "MEDIUM", label: "Medium" }, { value: "HARD", label: "Hard" }]} />
            <Select label="Section" value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} options={[{ value: "MATH", label: "Math" }, { value: "READING_WRITING", label: "Reading & Writing" }]} />
          </div>
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="algebra, equations" />
          <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer">{submitting ? "Saving..." : "Save Question"}</button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal open={catModalOpen} onClose={() => setCatModalOpen(false)} title="Manage Categories" icon="category">
        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-outline-variant/30 gap-2 bg-surface-container-lowest">
              {editingCatId === c._id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editingCatName}
                    onChange={(e) => setEditingCatName(e.target.value)}
                    className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                    required
                  />
                  <select
                    value={editingCatSection}
                    onChange={(e) => setEditingCatSection(e.target.value)}
                    className="rounded-xl border border-outline-variant bg-surface-container-low px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                  >
                    <option value="MATH">Math</option>
                    <option value="READING_WRITING">R&W</option>
                  </select>
                  <button
                    onClick={() => handleUpdateCategory(c._id)}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-accent transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCatId(null)}
                    className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-sm truncate">{c.name}</span>
                    <Badge variant="info" className="shrink-0">{c.section === "MATH" ? "Math" : "R&W"}</Badge>
                    <span className="shrink-0 text-xs text-on-surface-variant">{c.questionCount || 0} questions</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEditCategory(c)}
                      className="p-1 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant hover:text-primary cursor-pointer"
                      title="Edit Category"
                    >
                      <Icon name="edit" className="text-base" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c)}
                      className="p-1 hover:bg-error/10 rounded transition-colors text-error cursor-pointer"
                      title="Delete Category"
                    >
                      <Icon name="delete" className="text-base" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-on-surface-variant text-center py-4">No categories yet</p>}
        </div>
        <form onSubmit={handleCreateCategory} className="flex gap-3 items-end">
          <Input label="New Category" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Algebra" className="flex-1" />
          <Select value={catSection} onChange={(e) => setCatSection(e.target.value)} options={[{ value: "MATH", label: "Math" }, { value: "READING_WRITING", label: "R&W" }]} className="!w-auto" />
          <button type="submit" className="px-4 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-accent transition-colors cursor-pointer">Add</button>
        </form>
      </Modal>

      <MathEditorModal
        isOpen={mathEditorOpen}
        onClose={() => setMathEditorOpen(false)}
        onInsert={handleInsertVisualMath}
      />
    </AdminLayout>
  );
}
