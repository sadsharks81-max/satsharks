import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { api } from "../../services/api";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";

export const Route = createFileRoute("/admin/reports/$id")({
  component: ResolveReportPage,
});

function ResolveReportPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState({
    text: "",
    correctAnswer: "A",
    explanation: "",
    difficulty: "MEDIUM",
    section: "MATH",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
  });

  useEffect(() => {
    api.get(`/api/reports/${id}`).then((res) => {
      if (res.success) {
        setReport(res.report);
        const q = res.report.question;
        if (q) {
          setForm({
            text: q.text || "",
            correctAnswer: q.correctAnswer || "A",
            explanation: q.explanation || "",
            difficulty: q.difficulty || "MEDIUM",
            section: q.section || "MATH",
            optA: q.options?.find((o: any) => o.label === "A")?.text || "",
            optB: q.options?.find((o: any) => o.label === "B")?.text || "",
            optC: q.options?.find((o: any) => o.label === "C")?.text || "",
            optD: q.options?.find((o: any) => o.label === "D")?.text || "",
          });
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!report?.question?._id) return;
    setSaving(true);
    setSaveSuccess(false);
    const res = await api.put(`/api/questions/${report.question._id}`, {
      ...form,
      options: [
        { label: "A", text: form.optA },
        { label: "B", text: form.optB },
        { label: "C", text: form.optC },
        { label: "D", text: form.optD },
      ],
    });
    setSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      if (confirm("Question saved successfully! Would you like to mark this report as RESOLVED and return to the list?")) {
        handleResolve();
      }
    } else {
      alert(res.error || "Failed to save question.");
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    const res = await api.put(`/api/reports/${id}/resolve`);
    setResolving(false);
    if (res.success) {
      navigate({ to: "/admin/reports" });
    } else {
      alert(res.error || "Failed to resolve report.");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!report?.question?._id) return;
    if (!confirm("Are you sure you want to permanently delete this question from the database? This action cannot be undone.")) return;
    
    setDeleting(true);
    try {
      const delRes = await api.delete(`/api/questions/${report.question._id}`);
      if (delRes.success) {
        // Also resolve the report
        const res = await api.put(`/api/reports/${id}/resolve`);
        if (res.success) {
          navigate({ to: "/admin/reports" });
        } else {
          alert("Question deleted, but failed to resolve report: " + res.error);
        }
      } else {
        alert(delRes.error || "Failed to delete question.");
      }
    } catch (err) {
      alert("Error deleting question.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeItem="/admin/reports">
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant animate-pulse">Loading report...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout activeItem="/admin/reports">
        <div className="text-center text-error p-8">Report not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="/admin/reports">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate({ to: "/admin/reports" })}
          className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-on-background mb-1">Resolve Issue</h1>
          <p className="text-on-surface-variant text-sm">
            Review the student's complaint and edit the question directly below.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Report Card */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shark-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-on-surface">Report Details</h2>
              <Badge variant={report.status === "OPEN" ? "warning" : "success"}>
                {report.status}
              </Badge>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Reported By</p>
                <p className="font-semibold text-on-surface">{report.reportedBy?.name || "Unknown"}</p>
                <p className="text-on-surface-variant text-xs">{report.reportedBy?.email}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date</p>
                <p className="text-on-surface">{new Date(report.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Issue Description</p>
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-on-surface leading-relaxed whitespace-pre-wrap">
                  {report.reason}
                </div>
              </div>
            </div>

            {report.status === "OPEN" && (
              <div className="space-y-3 mt-6">
                <button
                  onClick={handleResolve}
                  disabled={resolving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-none"
                >
                  <Icon name="check_circle" />
                  {resolving ? "Resolving..." : "Mark as Resolved"}
                </button>

                <button
                  onClick={handleDeleteQuestion}
                  disabled={deleting || !report.question}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error/15 text-error rounded-xl font-bold text-sm hover:bg-error/25 transition-colors disabled:opacity-50 cursor-pointer border border-error/20"
                >
                  <Icon name="delete" />
                  {deleting ? "Deleting..." : "Delete Question"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Question Editor */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shark-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-on-surface">Edit Question</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Changes save directly to the database.</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !report.question}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Icon name="check" className="text-[16px]" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Icon name="save" className="text-[16px]" />
                    {saving ? "Saving..." : "Save Changes"}
                  </>
                )}
              </button>
            </div>

            {!report.question ? (
              <div className="text-error text-sm text-center py-8">
                The associated question has been deleted from the database.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Section"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    options={[
                      { value: "MATH", label: "Math" },
                      { value: "READING_WRITING", label: "Reading & Writing" },
                    ]}
                  />
                  <Select
                    label="Difficulty"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    options={[
                      { value: "EASY", label: "Easy" },
                      { value: "MEDIUM", label: "Medium" },
                      { value: "HARD", label: "Hard" },
                    ]}
                  />
                </div>

                <Textarea
                  label="Question Text"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  rows={5}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Option A" value={form.optA} onChange={(e) => setForm({ ...form, optA: e.target.value })} required />
                  <Input label="Option B" value={form.optB} onChange={(e) => setForm({ ...form, optB: e.target.value })} required />
                  <Input label="Option C" value={form.optC} onChange={(e) => setForm({ ...form, optC: e.target.value })} required />
                  <Input label="Option D" value={form.optD} onChange={(e) => setForm({ ...form, optD: e.target.value })} required />
                </div>

                <Select
                  label="Correct Answer"
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                  options={[
                    { value: "A", label: "Option A" },
                    { value: "B", label: "Option B" },
                    { value: "C", label: "Option C" },
                    { value: "D", label: "Option D" },
                  ]}
                />

                <Textarea
                  label="Explanation"
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
