import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { EmptyState } from "../../components/ui/EmptyState";
import { api, getBackendUrl, resolveImageUrl } from "../../services/api";
import { ZoomableImage } from "../../components/ui/ZoomableImage";
import { renderFormattedText } from "../../utils/format";
import { MathEditorModal } from "../../components/ui/MathEditorModal";

export const Route = createFileRoute("/admin/tests")({
  component: AdminTests,
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

function AdminTests() {
  const [satTests, setSatTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [satModalOpen, setSatModalOpen] = useState(false);
  const [editingSatTest, setEditingSatTest] = useState<any | null>(null);
  const [satForm, setSatForm] = useState({
    title: "",
    year: "2025",
    testNumber: "1",
    accessLevel: "FREE",
    pdfUrl: "",
    explanationPdfUrl: "",
  });
  const [satFormError, setSatFormError] = useState("");
  const [satSubmitting, setSatSubmitting] = useState(false);

  // Questions manager modal
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [activeTestForQuestions, setActiveTestForQuestions] = useState<any | null>(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<"MCQ" | "SPR">("MCQ");
  const [questionForm, setQuestionForm] = useState({
    text: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctAnswer: "A",
    explanation: "",
    imageUrl: "",
  });
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionError, setQuestionError] = useState("");
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
      insertLatex(latex, mathActiveField.name, setQuestionForm, mathActiveField.inputId);
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
        setQuestionForm(p => ({ ...p, imageUrl: data.url }));
      } else {
        setImageUploadError(data.error || "Failed to upload image.");
      }
    } catch (err: any) {
      setImageUploadError(err.message || "Network error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Scoring manager modal
  const [scoringModalOpen, setScoringModalOpen] = useState(false);
  const [activeTestForScoring, setActiveTestForScoring] = useState<any | null>(null);
  const [rwMappingInput, setRwMappingInput] = useState("");
  const [mathMappingInput, setMathMappingInput] = useState("");
  const [scoringError, setScoringError] = useState("");
  const [scoringSubmitting, setScoringSubmitting] = useState(false);

  const fetchSatTests = async () => {
    setLoading(true);
    const res = await api.get("/api/sat/admin/all");
    if (res.success) setSatTests(res.tests || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSatTests();
  }, []);

  const toggleSatActive = async (id: string, current: boolean) => {
    await api.put(`/api/sat/admin/${id}`, { isActive: !current });
    fetchSatTests();
  };

  const handleSatDelete = async (id: string) => {
    if (!confirm("Delete this digital SAT practice test?")) return;
    await api.delete(`/api/sat/admin/${id}`);
    fetchSatTests();
  };

  const openQuestionsManager = (test: any) => {
    setActiveTestForQuestions(test);
    setSelectedModuleIndex(0);
    setEditingQuestionId(null);
    setQuestionError("");
    setQuestionsModalOpen(true);
  };

  const startEditQuestion = (q: any) => {
    setEditingQuestionId(q._id);
    const isSpr = !q.options || q.options.length === 0;
    setQuestionType(isSpr ? "SPR" : "MCQ");
    setQuestionForm({
      text: q.text,
      optA: q.options[0]?.text || "",
      optB: q.options[1]?.text || "",
      optC: q.options[2]?.text || "",
      optD: q.options[3]?.text || "",
      correctAnswer: q.correctAnswer || "A",
      explanation: q.explanation || "",
      imageUrl: q.imageUrl || "",
    });
    setQuestionError("");
  };

  const handleSaveQuestion = async (qId: string) => {
    setQuestionError("");
    if (questionType === "MCQ") {
      if (!questionForm.text || !questionForm.optA || !questionForm.optB || !questionForm.optC || !questionForm.optD) {
        setQuestionError("Question text and all four options are required for multiple choice questions.");
        return;
      }
    } else {
      if (!questionForm.text || !questionForm.correctAnswer) {
        setQuestionError("Question text and correct answer are required.");
        return;
      }
    }
    setQuestionSubmitting(true);
    const body = {
      text: questionForm.text,
      options: questionType === "MCQ" ? [
        { label: "A", text: questionForm.optA },
        { label: "B", text: questionForm.optB },
        { label: "C", text: questionForm.optC },
        { label: "D", text: questionForm.optD },
      ] : [],
      correctAnswer: questionForm.correctAnswer,
      explanation: questionForm.explanation,
      imageUrl: questionForm.imageUrl,
    };

    const res = await api.put(`/api/questions/${qId}`, body);
    if (res.success) {
      const updatedTest = { ...activeTestForQuestions };
      const mod = updatedTest.modules[selectedModuleIndex];
      const qIndex = mod.questions.findIndex((x: any) => x._id === qId);
      if (qIndex !== -1) {
        mod.questions[qIndex] = {
          ...mod.questions[qIndex],
          text: body.text,
          options: body.options,
          correctAnswer: body.correctAnswer,
          explanation: body.explanation,
          imageUrl: body.imageUrl,
        };
      }
      setActiveTestForQuestions(updatedTest);
      setEditingQuestionId(null);
      fetchSatTests();
    } else {
      setQuestionError(res.error || "Failed to update question.");
    }
    setQuestionSubmitting(false);
  };

  const openScoringManager = (test: any) => {
    setActiveTestForScoring(test);
    setRwMappingInput((test.rwScoreMapping || []).join(", "));
    setMathMappingInput((test.mathScoreMapping || []).join(", "));
    setScoringError("");
    setScoringModalOpen(true);
  };

  const handleSaveScoring = async (e: React.FormEvent) => {
    e.preventDefault();
    setScoringError("");
    setScoringSubmitting(true);

    const parseMapping = (input: string, requiredLength: number, name: string) => {
      if (!input.trim()) return [];
      const parts = input.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
      if (parts.length !== requiredLength) {
        throw new Error(`${name} scoring table must contain exactly ${requiredLength} values. You provided ${parts.length}.`);
      }
      parts.forEach((val) => {
        if (val < 200 || val > 800) {
          throw new Error(`Scaled score values must be between 200 and 800. Found: ${val}.`);
        }
      });
      return parts;
    };

    try {
      const rwScoreMapping = parseMapping(rwMappingInput, 55, "Reading & Writing");
      const mathScoreMapping = parseMapping(mathMappingInput, 45, "Math");

      const res = await api.put(`/api/sat/admin/${activeTestForScoring._id}`, {
        rwScoreMapping,
        mathScoreMapping,
      });

      if (res.success) {
        setScoringModalOpen(false);
        fetchSatTests();
      } else {
        setScoringError(res.error || "Failed to save scoring tables.");
      }
    } catch (err: any) {
      setScoringError(err.message);
    } finally {
      setScoringSubmitting(false);
    }
  };

  const openSatEdit = (t: any) => {
    setEditingSatTest(t);
    setSatForm({
      title: t.title,
      year: String(t.year),
      testNumber: String(t.testNumber),
      accessLevel: t.accessLevel,
      pdfUrl: t.pdfUrl || "",
      explanationPdfUrl: t.explanationPdfUrl || "",
    });
    setSatFormError("");
    setSatModalOpen(true);
  };

  const handleSatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSatFormError("");
    if (!satForm.title) {
      setSatFormError("Title is required.");
      return;
    }
    setSatSubmitting(true);
    const body = {
      title: satForm.title,
      year: parseInt(satForm.year),
      testNumber: parseInt(satForm.testNumber),
      accessLevel: satForm.accessLevel,
      pdfUrl: satForm.pdfUrl,
      explanationPdfUrl: satForm.explanationPdfUrl,
    };

    const res = await api.put(`/api/sat/admin/${editingSatTest._id}`, body);

    if (res.success) {
      setSatModalOpen(false);
      fetchSatTests();
    } else {
      setSatFormError(res.error || "Failed to save SAT test.");
    }
    setSatSubmitting(false);
  };

  return (
    <AdminLayout activeItem="/admin/tests">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Digital SAT Test Management</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading tests...</div>
      ) : satTests.length === 0 ? (
        <EmptyState icon="school" title="No Digital SAT practice tests created yet" description="Practice tests are loaded automatically via import scripts" />
      ) : (
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold">Test Number</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Modules</th>
                <th className="p-4 font-semibold">Access</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {satTests.map((t) => (
                <tr key={t._id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 font-semibold text-sm">{t.title}</td>
                  <td className="p-4 text-sm">{t.year}</td>
                  <td className="p-4 text-sm">#{t.testNumber}</td>
                  <td className="p-4"><Badge variant="accent">{t.isAdaptive ? "Adaptive" : "Linear"}</Badge></td>
                  <td className="p-4 text-sm">{t.modules?.length || 0} modules</td>
                  <td className="p-4"><Badge variant={t.accessLevel === "PAID" ? "accent" : "success"}>{t.accessLevel}</Badge></td>
                  <td className="p-4">
                    <button onClick={() => toggleSatActive(t._id, t.isActive)} className="cursor-pointer">
                      <Badge variant={t.isActive ? "success" : "error"}>{t.isActive ? "Active" : "Inactive"}</Badge>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => openQuestionsManager(t)} className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded text-sm font-semibold transition-colors cursor-pointer">Questions</button>
                      <button onClick={() => openScoringManager(t)} className="px-3 py-1 bg-accent/15 text-accent hover:bg-accent/25 rounded text-sm font-semibold transition-colors cursor-pointer">Scoring</button>
                      <button onClick={() => openSatEdit(t)} className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-sm transition-colors cursor-pointer">Edit</button>
                      <button onClick={() => handleSatDelete(t._id)} className="px-3 py-1 bg-error/10 text-error hover:bg-error/20 rounded text-sm transition-colors cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={satModalOpen} onClose={() => setSatModalOpen(false)} title="Edit Digital SAT Practice Test" icon="edit" maxWidth="max-w-md">
        {satFormError && (
          <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
            <Icon name="error" className="shrink-0" /><span>{satFormError}</span>
          </div>
        )}
        <form onSubmit={handleSatSubmit} className="space-y-4">
          <Input label="Test Title" value={satForm.title} onChange={(e) => setSatForm((p) => ({ ...p, title: e.target.value }))} required placeholder="e.g. Digital SAT Practice Test 1" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Year" type="number" value={satForm.year} onChange={(e) => setSatForm((p) => ({ ...p, year: e.target.value }))} required />
            <Input label="Test Number" type="number" value={satForm.testNumber} onChange={(e) => setSatForm((p) => ({ ...p, testNumber: e.target.value }))} required />
          </div>
          <Select label="Access Level" value={satForm.accessLevel} onChange={(e) => setSatForm((p) => ({ ...p, accessLevel: e.target.value }))} options={[{ value: "FREE", label: "Free" }, { value: "PAID", label: "Paid" }]} />

          <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
            <button type="button" onClick={() => setSatModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={satSubmitting} className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer">{satSubmitting ? "Saving..." : "Save Test"}</button>
          </div>
        </form>
      </Modal>

      {/* Manage Test Questions Modal */}
      <Modal open={questionsModalOpen} onClose={() => setQuestionsModalOpen(false)} title={`Manage Test Questions , ${activeTestForQuestions?.title}`} icon="list_alt" maxWidth="max-w-5xl">
        {activeTestForQuestions && (
          <div className="flex flex-col md:flex-row gap-6 max-h-[70vh]">
            {/* Left side: Module Selector */}
            <div className="w-full md:w-1/4 border-r border-outline-variant/30 pr-4 space-y-2 overflow-y-auto">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Test Modules</label>
              {activeTestForQuestions.modules.map((mod: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedModuleIndex(idx);
                    setEditingQuestionId(null);
                    setQuestionError("");
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedModuleIndex === idx
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "bg-surface hover:bg-surface-container-low border-outline-variant/40"
                  }`}
                >
                  <div className="line-clamp-1">{mod.name}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedModuleIndex === idx ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                    {mod.questions?.length || 0} Questions
                  </div>
                </button>
              ))}
            </div>

            {/* Right side: Questions List for selected module */}
            <div className="flex-1 overflow-y-auto pl-2 pr-1 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wider">
                  {activeTestForQuestions.modules[selectedModuleIndex]?.name}
                </h3>
              </div>

              {questionError && (
                <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
                  <Icon name="error" className="shrink-0" /><span>{questionError}</span>
                </div>
              )}

              <div className="space-y-4">
                {activeTestForQuestions.modules[selectedModuleIndex]?.questions.map((q: any, qi: number) => {
                  const isEditingThis = editingQuestionId === q._id;
                  return (
                    <div key={q._id} className="p-5 border border-outline-variant/40 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow transition-shadow">
                      {isEditingThis ? (
                        /* Editing form */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                            <span className="text-xs font-bold text-primary font-mono">Editing Question {qi + 1}</span>
                          </div>

                          {/* Question Image Upload (Optional) */}
                          <div>
                            <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Question Image (Optional)</label>
                            <div 
                              className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : 'hover:border-primary border-outline-variant/50 bg-surface-container-low'}`}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={handleImageUpload}
                            >
                              {questionForm.imageUrl ? (
                                <div className="flex flex-col items-center gap-3">
                                  <img src={resolveImageUrl(questionForm.imageUrl)} alt="Uploaded preview" className="max-h-32 rounded-lg border border-outline-variant/30" />
                                  <div className="flex gap-2">
                                    <label className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-[10px] font-bold transition-colors cursor-pointer text-on-surface">
                                      Change Image
                                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                                    </label>
                                    <button type="button" onClick={() => setQuestionForm(p => ({ ...p, imageUrl: "" }))} className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 rounded-lg text-[10px] font-bold transition-colors cursor-pointer">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center cursor-pointer h-full min-h-[80px]">
                                  <Icon name="cloud_upload" className="text-2xl text-on-surface-variant/50 mb-1" />
                                  <span className="text-xs text-on-surface-variant font-semibold">
                                    {isUploadingImage ? "Uploading..." : "Drag & drop image here or click to browse"}
                                  </span>
                                  {imageUploadError && <span className="text-[10px] text-error mt-1">{imageUploadError}</span>}
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
                                onClick={() => openVisualMathEditor("text", `tests-q-text-${q._id}`)}
                                className="px-2 py-0.5 rounded bg-primary text-on-primary hover:bg-accent text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              >
                                <Icon name="functions" className="text-[12px]" />
                                <span>Visual Editor</span>
                              </button>
                              {MATH_SYMBOLS.map((sym) => (
                                <button
                                  key={sym.label}
                                  type="button"
                                  onClick={() => insertLatex(sym.latex, "text", setQuestionForm, `tests-q-text-${q._id}`)}
                                  className="px-1.5 py-0.5 rounded bg-surface hover:bg-surface-container-high text-[10px] font-bold text-primary transition-colors border border-outline-variant/40 cursor-pointer"
                                  title={`Insert ${sym.label}`}
                                >
                                  {sym.latex.replace(/\$/g, "")}
                                </button>
                              ))}
                            </div>
                            <Textarea
                              id={`tests-q-text-${q._id}`}
                              value={questionForm.text}
                              onChange={(e) => setQuestionForm(p => ({ ...p, text: e.target.value }))}
                              rows={3}
                              required
                            />
                            {/* Live preview */}
                            <div className="mt-1.5 p-3 rounded-xl border border-primary/20 bg-primary/5">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary block mb-0.5">Live Math Preview:</span>
                              <div className="text-xs font-medium text-on-surface whitespace-pre-wrap leading-relaxed min-h-[16px]">
                                {renderFormattedText(questionForm.text || "Type math equations wrapped in $...")}
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
                                  if (["A", "B", "C", "D"].includes(questionForm.correctAnswer)) {
                                    setQuestionForm(p => ({ ...p, correctAnswer: "" }));
                                  }
                                } else {
                                  if (!["A", "B", "C", "D"].includes(questionForm.correctAnswer)) {
                                    setQuestionForm(p => ({ ...p, correctAnswer: "A" }));
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
                            <div className="space-y-3 pt-2">
                              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Options *</label>
                              {(["A", "B", "C", "D"] as const).map((label) => (
                                <div key={label} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-3">
                                    <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${questionForm.correctAnswer === label ? "bg-primary text-on-primary" : "bg-surface-container-high"}`}>{label}</span>
                                    <input
                                      id={`tests-q-opt${label}-${q._id}`}
                                      type="text"
                                      value={questionForm[`opt${label}` as keyof typeof questionForm]}
                                      onChange={(e) => setQuestionForm(p => ({ ...p, [`opt${label}`]: e.target.value }))}
                                      placeholder={`Option ${label}`}
                                      className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setQuestionForm(p => ({ ...p, correctAnswer: label }))}
                                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${questionForm.correctAnswer === label ? "bg-primary text-on-primary" : "bg-surface-container-high hover:bg-surface-container-highest"}`}
                                    >
                                      {questionForm.correctAnswer === label ? "Correct" : "Set"}
                                    </button>
                                  </div>
                                  {/* Quick math symbol bar for options */}
                                  <div className="flex flex-wrap gap-1 pl-11 overflow-x-auto items-center">
                                    <button
                                      type="button"
                                      onClick={() => openVisualMathEditor(`opt${label}`, `tests-q-opt${label}-${q._id}`)}
                                      className="px-1.5 py-0.5 rounded bg-primary text-on-primary hover:bg-accent text-[9px] font-bold transition-all cursor-pointer flex items-center gap-0.5 shrink-0"
                                    >
                                      <Icon name="functions" className="text-[10px]" />
                                      <span>Visual Editor</span>
                                    </button>
                                    {MATH_SYMBOLS.map((sym) => (
                                      <button
                                        key={sym.label}
                                        type="button"
                                        onClick={() => insertLatex(sym.latex, `opt${label}`, setQuestionForm, `tests-q-opt${label}-${q._id}`)}
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
                            <div className="space-y-2 pt-2">
                              <Input
                                label="Correct Answer *"
                                value={questionForm.correctAnswer}
                                onChange={(e) => setQuestionForm(p => ({ ...p, correctAnswer: e.target.value }))}
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
                                onClick={() => openVisualMathEditor("explanation", `tests-q-expl-${q._id}`)}
                                className="px-2 py-0.5 rounded bg-primary text-on-primary hover:bg-accent text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              >
                                <Icon name="functions" className="text-[12px]" />
                                <span>Visual Editor</span>
                              </button>
                              {MATH_SYMBOLS.map((sym) => (
                                <button
                                  key={sym.label}
                                  type="button"
                                  onClick={() => insertLatex(sym.latex, "explanation", setQuestionForm, `tests-q-expl-${q._id}`)}
                                  className="px-1.5 py-0.5 rounded bg-surface hover:bg-surface-container-high text-[10px] font-bold text-primary transition-colors border border-outline-variant/40 cursor-pointer"
                                  title={`Insert ${sym.label}`}
                                >
                                  {sym.latex.replace(/\$/g, "")}
                                </button>
                              ))}
                            </div>
                            <Textarea
                              id={`tests-q-expl-${q._id}`}
                              value={questionForm.explanation}
                              onChange={(e) => setQuestionForm(p => ({ ...p, explanation: e.target.value }))}
                              rows={2}
                              placeholder="Provide details about the solution..."
                            />
                            {/* Live preview */}
                            <div className="mt-1.5 p-3 rounded-xl border border-primary/20 bg-primary/5">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary block mb-0.5">Live Math Preview:</span>
                              <div className="text-xs font-medium text-on-surface whitespace-pre-wrap leading-relaxed min-h-[16px]">
                                {renderFormattedText(questionForm.explanation || "Type explanation math equations wrapped in $...")}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button
                              type="button"
                              onClick={() => setEditingQuestionId(null)}
                              className="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveQuestion(q._id)}
                              disabled={questionSubmitting}
                              className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent text-xs font-bold cursor-pointer disabled:opacity-50"
                            >
                              {questionSubmitting ? "Saving..." : "Save Question"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Read-only details card */
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-on-surface-variant font-mono">Question {qi + 1}</span>
                            <button
                              onClick={() => startEditQuestion(q)}
                              className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Edit Details
                            </button>
                          </div>
                          
                          {q.imageUrl && (
                            <div className="mb-3">
                              <ZoomableImage src={resolveImageUrl(q.imageUrl)} className="max-h-48 rounded-lg border border-outline-variant/30" />
                            </div>
                          )}
                          <p className="text-sm font-medium text-on-surface leading-relaxed whitespace-pre-wrap">{renderFormattedText(q.text)}</p>
                          
                          {q.options && q.options.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              {q.options.map((opt: any) => (
                                <div
                                  key={opt.label}
                                  className={`p-2.5 rounded-lg border text-xs flex gap-2 items-center ${
                                    q.correctAnswer === opt.label
                                      ? "border-primary bg-primary/5 text-primary font-bold"
                                      : "border-outline-variant/30 text-on-surface-variant"
                                  }`}
                                >
                                  <span className="font-bold">{opt.label}.</span>
                                  <span>{renderFormattedText(opt.text)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs flex gap-2 items-center mt-2">
                              <span className="font-bold">Correct Answer:</span>
                              <span className="font-mono">{q.correctAnswer}</span>
                            </div>
                          )}

                          <div className="mt-2 p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant border border-outline-variant/20">
                            <strong className="text-on-surface block mb-1">Explanation:</strong>
                            <div className="whitespace-pre-wrap leading-relaxed">{renderFormattedText(q.explanation || "No explanation provided.")}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {(!activeTestForQuestions?.modules[selectedModuleIndex]?.questions || activeTestForQuestions.modules[selectedModuleIndex].questions.length === 0) && (
                  <p className="text-sm text-on-surface-variant text-center py-6">No questions in this module.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Scoring Table Modal */}
      <Modal open={scoringModalOpen} onClose={() => setScoringModalOpen(false)} title={`Scoring Table (Marks Schema) , ${activeTestForScoring?.title}`} icon="score" maxWidth="max-w-2xl">
        {scoringError && (
          <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
            <Icon name="error" className="shrink-0" /><span>{scoringError}</span>
          </div>
        )}
        <form onSubmit={handleSaveScoring} className="space-y-4">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Specify a custom raw-to-scaled conversion table (scaled score mapping) for this test.
            Paste comma-separated scores (between 200 and 800) corresponding to the correct answer count.
          </p>

          <Textarea
            label="Reading & Writing Scaled Scores (exactly 55 values: raw 0 to 54)"
            value={rwMappingInput}
            onChange={(e) => setRwMappingInput(e.target.value)}
            rows={4}
            placeholder="e.g. 200, 200, 200, 210, 220, 230, 240..."
          />

          <Textarea
            label="Math Scaled Scores (exactly 45 values: raw 0 to 44)"
            value={mathMappingInput}
            onChange={(e) => setMathMappingInput(e.target.value)}
            rows={4}
            placeholder="e.g. 200, 200, 210, 220, 230, 240..."
          />

          <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
            <button type="button" onClick={() => setScoringModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={scoringSubmitting} className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer">{scoringSubmitting ? "Saving..." : "Save Scoring Table"}</button>
          </div>
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
