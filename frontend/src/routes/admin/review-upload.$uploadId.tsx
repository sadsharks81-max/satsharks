import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { api } from "../../services/api";
import type { PracticeTestUpload, ExtractedQuestion } from "../../types";

export const Route = createFileRoute("/admin/review-upload/$uploadId")({
  component: ReviewUpload,
});

function ReviewUpload() {
  const { uploadId } = Route.useParams();
  const navigate = useNavigate();
  const [upload, setUpload] = useState<PracticeTestUpload | null>(null);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
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

  const updateQuestion = (idx: number, field: string, value: any) => {
    setQuestions((prev) => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const toggleApproval = (idx: number) => {
    setQuestions((prev) => prev.map((q, i) => i === idx ? { ...q, approved: !q.approved } : q));
  };

  const handleSaveReview = async () => {
    setSaving(true);
    await api.put(`/api/uploads/${uploadId}/review`, { extractedQuestions: questions, reviewNotes });
    setSaving(false);
  };

  const handlePublish = async () => {
    const approvedCount = questions.filter((q) => q.approved).length;
    if (approvedCount === 0) { alert("No questions approved for publishing."); return; }
    if (!confirm(`Publish ${approvedCount} approved questions to the question bank?`)) return;

    setPublishing(true);
    await handleSaveReview();
    const res = await api.post(`/api/uploads/${uploadId}/publish`, {});
    if (res.success) {
      navigate({ to: "/admin/uploads" });
    }
    setPublishing(false);
  };

  if (loading) {
    return (
      <AdminLayout activeItem="/admin/uploads">
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      </AdminLayout>
    );
  }

  if (!upload) {
    return (
      <AdminLayout activeItem="/admin/uploads">
        <div className="text-center py-12 text-error">Upload not found</div>
      </AdminLayout>
    );
  }

  const approvedCount = questions.filter((q) => q.approved).length;

  return (
    <AdminLayout activeItem="/admin/uploads">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Review Extracted Questions</h1>
          <p className="text-on-surface-variant text-sm mt-1">{upload.title} , {upload.fileName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={upload.status === "PUBLISHED" ? "success" : "info"}>{upload.status}</Badge>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleSaveReview}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-semibold hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Icon name="save" className="text-lg" /> {saving ? "Saving..." : "Save Review"}
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing || approvedCount === 0}
          className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all disabled:opacity-50 cursor-pointer"
        >
          <Icon name="publish" className="text-lg" /> Publish {approvedCount} Questions
        </button>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 border shark-shadow ${
              q.approved ? "border-primary/40 bg-primary/5" : "border-outline-variant/40 bg-surface-container-lowest"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-on-surface-variant">Q{idx + 1}</span>
                {q.confidence > 0 && (
                  <Badge variant={q.confidence >= 0.8 ? "success" : q.confidence >= 0.5 ? "warning" : "error"}>
                    {Math.round(q.confidence * 100)}% confidence
                  </Badge>
                )}
              </div>
              <button
                onClick={() => toggleApproval(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  q.approved
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high hover:bg-surface-container-highest"
                }`}
              >
                <Icon name={q.approved ? "check_circle" : "radio_button_unchecked"} className="text-[18px]" />
                {q.approved ? "Approved" : "Approve"}
              </button>
            </div>

            <Textarea
              label="Question Text"
              value={q.text}
              onChange={(e) => updateQuestion(idx, "text", e.target.value)}
              rows={2}
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    q.correctAnswer === opt.label ? "bg-primary text-on-primary" : "bg-surface-container-high"
                  }`}>{opt.label}</span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...q.options];
                      newOpts[oi] = { ...newOpts[oi], text: e.target.value };
                      updateQuestion(idx, "options", newOpts);
                    }}
                    className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <Select
                label="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(idx, "correctAnswer", e.target.value)}
                options={[{ value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" }, { value: "D", label: "D" }]}
              />
              <Select
                label="Difficulty"
                value={q.difficulty}
                onChange={(e) => updateQuestion(idx, "difficulty", e.target.value)}
                options={[{ value: "EASY", label: "Easy" }, { value: "MEDIUM", label: "Medium" }, { value: "HARD", label: "Hard" }]}
              />
              <Select
                label="Category"
                value={q.category}
                onChange={(e) => updateQuestion(idx, "category", e.target.value)}
                options={[
                  { value: "Algebra", label: "Algebra" },
                  { value: "Geometry", label: "Geometry" },
                  { value: "Reading Comprehension", label: "Reading Comprehension" },
                  { value: "Grammar", label: "Grammar" },
                ]}
              />
            </div>
          </div>
        ))}
      </div>

      <Textarea
        label="Review Notes"
        value={reviewNotes}
        onChange={(e) => setReviewNotes(e.target.value)}
        rows={3}
        placeholder="Add notes about this review..."
      />
    </AdminLayout>
  );
}
