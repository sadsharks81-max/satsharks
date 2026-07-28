import { useState } from "react";
import { Modal } from "../ui/Modal";
import { api } from "../../services/api";
import { Icon } from "../common/Icon";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  testContext?: string;
}

export function ReportIssueModal({ isOpen, onClose, questionId, testContext }: ReportIssueModalProps) {
  const [reason, setReason] = useState("");
  const [issueTypes, setIssueTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const options = [
    { id: "question", label: "Question Statement" },
    { id: "answers", label: "Answer Choices / Key" },
    { id: "explanation", label: "Explanation" },
    { id: "other", label: "Other / Formatting" },
  ];

  const toggleIssueType = (label: string) => {
    if (issueTypes.includes(label)) {
      setIssueTypes(issueTypes.filter((t) => t !== label));
    } else {
      setIssueTypes([...issueTypes, label]);
    }
  };

  const handleSubmit = async () => {
    if (issueTypes.length === 0 && !reason.trim()) return;
    setIsSubmitting(true);

    const formattedReason = `[Issue Type: ${
      issueTypes.length > 0 ? issueTypes.join(", ") : "General"
    }] ${reason.trim()}`;

    try {
      const res = await api.post("/api/reports", {
        questionId,
        testContext: testContext || "PRACTICE",
        reason: formattedReason,
      });
      if (res.success) {
        setSuccess(true);
        setReason("");
        setIssueTypes([]);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 3000);
      } else {
        alert(res.error || "Failed to submit report");
      }
    } catch (err) {
      alert("An error occurred while submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={success ? "" : "Report an Issue"}>
      {success ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Icon name="check_circle" className="text-6xl text-success animate-scale-in" />
          <h3 className="text-xl font-bold text-on-surface">Report Submitted</h3>
          <p className="text-sm text-on-surface-variant">Your report has been sent to the admin for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            What part of the question has an issue? Select all that apply:
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {options.map((opt) => {
              const checked = issueTypes.includes(opt.label);
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer select-none text-sm font-medium ${
                    checked
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-outline-variant/40 hover:border-primary/45 hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleIssueType(opt.label)}
                    className="accent-primary h-4 w-4"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>

          <p className="text-sm text-on-surface-variant">
            Please provide additional details to help us fix the issue:
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Specify details here..."
            className="w-full h-28 px-4 py-3 rounded-xl border-2 border-outline-variant/60 focus:border-primary text-sm transition-colors resize-none"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={(issueTypes.length === 0 && !reason.trim()) || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-accent transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
