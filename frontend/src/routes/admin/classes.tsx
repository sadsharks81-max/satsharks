import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { isValidHttpsUrl, looksLikeGoogleMeetLink } from "../../utils/meetLink";

export const Route = createFileRoute("/admin/classes")({
  component: () => (
    <AdminLayout activeItem="/admin/classes">
      <AdminClasses />
    </AdminLayout>
  ),
});

function AdminClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    teacherId: "",
    meetLink: "",
  });

  // Meet link edit modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalClassId, setLinkModalClassId] = useState<string | null>(null);
  const [linkModalValue, setLinkModalValue] = useState("");
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  const fetchClassesAndTeachers = async () => {
    setLoading(true);
    try {
      const classRes = await api.get("/api/live-classes");
      const teacherRes = await api.get("/api/users?role=TEACHER");
      
      if (classRes.success) setClasses(classRes.classes || []);
      if (teacherRes.success) setTeachers(teacherRes.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndTeachers();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduledAt || !form.teacherId) {
      alert("Please fill in all required fields (including assigned teacher).");
      return;
    }

    if (form.meetLink && !isValidHttpsUrl(form.meetLink)) {
      alert("Google Meet link must be a valid https:// URL.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/api/live-classes", form);
      if (res.success) {
        fetchClassesAndTeachers();
        setModalOpen(false);
        setForm({ title: "", description: "", scheduledAt: "", duration: 60, teacherId: "", meetLink: "" });
      } else {
        alert(res.error || "Failed to schedule class.");
      }
    } catch (err) {
      alert("Error scheduling class.");
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
        fetchClassesAndTeachers();
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
        fetchClassesAndTeachers();
      }
    } catch (err) {
      alert("Failed to update class status.");
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this class session?")) return;
    try {
      const res = await api.delete(`/api/live-classes/${id}`);
      if (res.success) {
        setClasses((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(res.error || "Failed to delete class.");
      }
    } catch (err) {
      alert("Error deleting class.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-background mb-2">Live Classes Control</h1>
          <p className="text-on-surface-variant text-sm">
            Schedule live calling classes, assign teachers, and monitor active teaching sessions.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-accent transition-all cursor-pointer border-none shadow-sm"
        >
          <Icon name="add" />
          Schedule Session
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant animate-pulse">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="bg-surface border border-outline-variant/35 rounded-2xl p-16 text-center flex flex-col items-center">
          <Icon name="video_camera_front" className="text-5xl text-on-surface-variant/40 mb-4" />
          <p className="text-lg font-bold text-on-surface mb-2">No Classes Scheduled</p>
          <p className="text-sm text-on-surface-variant max-w-sm">
            There are no active or scheduled live classes. Click "Schedule Session" above to set one up.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shark-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="p-4 font-bold">Class Details</th>
                  <th className="p-4 font-bold">Assigned Teacher</th>
                  <th className="p-4 font-bold">Schedule</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {classes.map((c) => (
                  <tr key={c._id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-on-surface text-sm">{c.title}</div>
                      {c.description && (
                        <div className="text-xs text-on-surface-variant mt-1 line-clamp-1 max-w-xs">{c.description}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-on-surface text-sm">{c.teacher?.name || "Unassigned"}</div>
                      <div className="text-xs text-on-surface-variant">{c.teacher?.email}</div>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      <div className="font-semibold">{new Date(c.scheduledAt).toLocaleString()}</div>
                      <div className="mt-0.5">{c.duration} minutes</div>
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {(c.status === "SCHEDULED" || c.status === "LIVE") && (
                          <button
                            onClick={() => openLinkModal(c)}
                            className="px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border-none"
                          >
                            <Icon name="link" className="text-[14px]" /> {c.meetLink ? "Edit Link" : "Set Link"}
                          </button>
                        )}
                        {c.status === "SCHEDULED" && (
                          <button
                            onClick={() => handleUpdateStatus(c._id, "LIVE")}
                            className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border-none"
                          >
                            <Icon name="play_arrow" className="text-[14px]" /> Start
                          </button>
                        )}
                        {c.status === "LIVE" && (
                          <>
                            <button
                              onClick={() => c.meetLink && window.open(c.meetLink, "_blank", "noopener,noreferrer")}
                              disabled={!c.meetLink}
                              className="px-3 py-1.5 bg-success/15 text-success hover:bg-success/25 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Icon name="video_call" className="text-[14px]" /> Open Meet
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(c._id, "COMPLETED")}
                              className="px-3 py-1.5 bg-on-surface-variant/10 text-on-surface-variant hover:bg-on-surface-variant/15 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border-none"
                            >
                              <Icon name="check_circle" className="text-[14px]" /> End
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteClass(c._id)}
                          className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border-none"
                        >
                          <Icon name="delete" className="text-[14px]" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Live Call">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Class Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Master SAT Math Grid-In Questions"
            required
          />

          <Textarea
            label="Class Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What will students learn in this live call session..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Date & Time *"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              required
            />
            <Input
              type="number"
              label="Duration (minutes) *"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 60 })}
              required
            />
          </div>

          {teachers.length === 0 ? (
            <div className="p-3 bg-error/10 border border-error/25 text-error text-xs rounded-xl font-semibold">
              No registered teachers found. Please register/promote a user to TEACHER in the User Management tab first.
            </div>
          ) : (
            <Select
              label="Assign Teacher *"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              required
              options={[
                { value: "", label: "Select a teacher..." },
                ...teachers.map((t) => ({ value: t._id, label: `${t.name} (${t.email})` })),
              ]}
            />
          )}

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

          <div className="flex gap-4 pt-4 border-t border-outline-variant/30 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm text-xs border-none"
            >
              {submitting ? "Scheduling..." : "Schedule Session"}
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
          <div className="flex gap-4 pt-4 border-t border-outline-variant/30 mt-6">
            <button
              type="button"
              onClick={() => setLinkModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={linkSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm text-xs border-none"
            >
              {linkSubmitting ? "Saving..." : "Save Link"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
