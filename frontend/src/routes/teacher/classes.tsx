import { createFileRoute } from "@tanstack/react-router";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { useAuth } from "../../hooks/useAuth";
import { isValidHttpsUrl, looksLikeGoogleMeetLink } from "../../utils/meetLink";

export const Route = createFileRoute("/teacher/classes")({
  component: TeacherClasses,
});

function TeacherClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  console.log("TeacherClasses Render - User Context:", user);

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    meetLink: "",
  });

  // Meet link edit modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalClassId, setLinkModalClassId] = useState<string | null>(null);
  const [linkModalValue, setLinkModalValue] = useState("");
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  const fetchClasses = () => {
    setLoading(true);
    api.get("/api/live-classes")
      .then((res) => {
        if (res.success) {
          setClasses(res.classes || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduledAt) return;

    if (form.meetLink && !isValidHttpsUrl(form.meetLink)) {
      alert("Google Meet link must be a valid https:// URL.");
      return;
    }

    setSubmitting(true);
    console.log("Create Class Submission - User Context:", user);
    try {
      const teacherId = user?.id || user?._id || user?.userId;
      console.log("Resolved Teacher ID:", teacherId);
      if (!teacherId) {
        alert("Teacher profile not loaded. Please re-login. (Details: " + JSON.stringify(user) + ")");
        return;
      }
      const res = await api.post("/api/live-classes", {
        ...form,
        teacherId,
      });
      if (res.success) {
        fetchClasses();
        setModalOpen(false);
        setForm({ title: "", description: "", scheduledAt: "", duration: 60, meetLink: "" });
      } else {
        alert(res.error || "Failed to create class session.");
      }
    } catch (err) {
      alert("Error creating class session.");
    } finally {
      setSubmitting(false);
    }
  };

  const openLinkModal = (c: any) => {
    setLinkModalClassId(c._id);
    setLinkModalValue(c.meetLink || "");
    setLinkModalOpen(true);
  };

  const handleSaveMeetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkModalValue || !isValidHttpsUrl(linkModalValue)) {
      alert("Please enter a valid https:// Google Meet link.");
      return;
    }

    setLinkSubmitting(true);
    try {
      const res = await api.put(`/api/live-classes/${linkModalClassId}/meet-link`, { meetLink: linkModalValue });
      if (res.success) {
        fetchClasses();
        setLinkModalOpen(false);
      } else {
        alert(res.error || "Failed to save Meet link.");
      }
    } catch (err) {
      alert("Error saving Meet link.");
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/api/live-classes/${id}/status`, { status });
      if (res.success) {
        fetchClasses();
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <TeacherLayout activeItem="/teacher/classes">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-background mb-2">My Live Classes</h1>
          <p className="text-on-surface-variant text-sm">
            Launch live sessions, schedule upcoming ones, and review completed sessions.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-accent transition-colors cursor-pointer border-none shadow-sm"
        >
          <Icon name="add" />
          Schedule Class
        </button>
      </div>

      {loading ? (
        <div className="text-center p-12 text-on-surface-variant animate-pulse">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-16 text-center flex flex-col items-center">
          <Icon name="video_camera_front" className="text-5xl text-on-surface-variant/40 mb-4" />
          <p className="text-lg font-bold text-on-surface mb-2">No live classes found</p>
          <p className="text-sm text-on-surface-variant max-w-sm">
            You don't have any classes scheduled yet. Click "Schedule Class" above to create your first class.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((c) => (
            <div
              key={c._id}
              className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shark-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <Badge
                    variant={
                      c.status === "LIVE"
                        ? "success"
                        : c.status === "COMPLETED"
                        ? "neutral"
                        : c.status === "CANCELLED"
                        ? "error"
                        : "info"
                    }
                  >
                    {c.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-on-surface mb-1.5">{c.title}</h3>
                {c.description && (
                  <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{c.description}</p>
                )}

                <div className="space-y-2 border-t border-outline-variant/20 pt-4 mb-6">
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <Icon name="calendar_today" className="text-[16px] text-primary" />
                    <span className="font-semibold text-on-surface">Scheduled At:</span>{" "}
                    {new Date(c.scheduledAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <Icon name="schedule" className="text-[16px] text-primary" />
                    <span className="font-semibold text-on-surface">Duration:</span> {c.duration} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(c.status === "SCHEDULED" || c.status === "LIVE") && (
                  <button
                    onClick={() => openLinkModal(c)}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-xs font-bold text-on-surface-variant transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Icon name="link" />
                    {c.meetLink ? "Edit Link" : "Set Link"}
                  </button>
                )}

                {c.status === "SCHEDULED" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(c._id, "LIVE")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-accent transition-colors cursor-pointer border-none"
                    >
                      <Icon name="play_arrow" />
                      Start Class
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(c._id, "CANCELLED")}
                      className="px-4 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-xs font-bold text-on-surface-variant transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {c.status === "LIVE" && (
                  <>
                    <button
                      onClick={() => c.meetLink && window.open(c.meetLink, "_blank", "noopener,noreferrer")}
                      disabled={!c.meetLink}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="video_call" />
                      Open Meet
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(c._id, "COMPLETED")}
                      className="px-4 py-2.5 bg-on-surface-variant/10 text-on-surface-variant hover:bg-on-surface-variant/15 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none"
                    >
                      End Class
                    </button>
                  </>
                )}

                {c.status === "COMPLETED" && (
                  <div className="w-full text-center text-xs text-on-surface-variant/70 italic py-2">
                    Class session completed
                  </div>
                )}

                {c.status === "CANCELLED" && (
                  <div className="w-full text-center text-xs text-error/70 italic py-2">
                    Class session cancelled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Class Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule New Class">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Class Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. SAT Reading: Context Clues"
            required
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what will be covered in this class..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Date & Time"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              required
            />
            <Input
              type="number"
              label="Duration (mins)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 60 })}
              required
            />
          </div>

          <div>
            <Input
              type="url"
              label="Google Meet Link (optional)"
              value={form.meetLink}
              onChange={(e) => setForm({ ...form, meetLink: e.target.value })}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
            />
            {form.meetLink && isValidHttpsUrl(form.meetLink) && !looksLikeGoogleMeetLink(form.meetLink) && (
              <p className="mt-1.5 text-xs text-accent">
                This doesn't look like a Google Meet link, double check before saving.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer border-none"
            >
              {submitting ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Meet Link Modal */}
      <Modal open={linkModalOpen} onClose={() => setLinkModalOpen(false)} title="Set Google Meet Link">
        <form onSubmit={handleSaveMeetLink} className="space-y-4">
          <Input
            type="url"
            label="Google Meet Link *"
            value={linkModalValue}
            onChange={(e) => setLinkModalValue(e.target.value)}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            required
          />
          {linkModalValue && isValidHttpsUrl(linkModalValue) && !looksLikeGoogleMeetLink(linkModalValue) && (
            <p className="text-xs text-accent">
              This doesn't look like a Google Meet link, double check before saving.
            </p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setLinkModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={linkSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer border-none"
            >
              {linkSubmitting ? "Saving..." : "Save Link"}
            </button>
          </div>
        </form>
      </Modal>
    </TeacherLayout>
  );
}
