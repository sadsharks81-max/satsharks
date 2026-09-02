import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { liveClassApi } from "../../services/liveClassApi";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { useAuth } from "../../hooks/useAuth";

interface LiveClassSummary {
  _id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  roomName?: string;
  maxStudents?: number;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
}

export const Route = createFileRoute("/teacher/classes")({
  component: TeacherClasses,
});

function TeacherClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<LiveClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    maxStudents: 100,
  });

  const fetchClasses = () => {
    setLoading(true);
    api
      .get("/api/live-classes")
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

  // Poll "Students Joined" for every currently-live class card.
  useEffect(() => {
    const liveClassIds = classes.filter((c) => c.status === "LIVE").map((c) => c._id);
    if (liveClassIds.length === 0) return;

    const poll = () => {
      liveClassIds.forEach((id) => {
        liveClassApi
          .getParticipantCount(id)
          .then((res) => {
            if (res.success) setParticipantCounts((prev) => ({ ...prev, [id]: res.count }));
          })
          .catch(() => {});
      });
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [classes]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduledAt) return;

    setSubmitting(true);
    try {
      const teacherId = user?.id || user?._id || user?.userId;
      if (!teacherId) {
        alert("Teacher profile not loaded. Please re-login.");
        return;
      }
      const res = await api.post("/api/live-classes", {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        teacherId,
      });
      if (res.success) {
        fetchClasses();
        setModalOpen(false);
        setForm({ title: "", description: "", scheduledAt: "", duration: 60, maxStudents: 100 });
      } else {
        alert(res.error || "Failed to create class session.");
      }
    } catch (err) {
      alert("Error creating class session.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/api/live-classes/${id}/status`, { status });
      if (res.success) {
        fetchClasses();
        return true;
      }
      alert(res.error || "Failed to update status.");
      return false;
    } catch (err) {
      alert("Failed to update status.");
      return false;
    }
  };

  const handleStartClass = async (c: LiveClassSummary) => {
    setStartingId(c._id);
    const ok = await handleUpdateStatus(c._id, "LIVE");
    setStartingId(null);
    if (ok) navigate({ to: `/classroom/${c.roomName || c._id}` });
  };

  // Joinable classes (LIVE / SCHEDULED) first, completed/cancelled sessions at the end
  const statusOrder: Record<string, number> = { LIVE: 0, SCHEDULED: 1, CANCELLED: 2, COMPLETED: 3 };
  const sortedClasses = [...classes].sort(
    (a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4),
  );

  return (
    <TeacherLayout activeItem="/teacher/classes">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-background mb-2">
            My Live Classes
          </h1>
          <p className="text-on-surface-variant text-sm">
            Launch live classroom sessions, schedule upcoming ones, and review completed sessions.
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
        <div className="text-center p-12 text-on-surface-variant animate-pulse">
          Loading classes...
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-16 text-center flex flex-col items-center">
          <Icon name="video_camera_front" className="text-5xl text-on-surface-variant/40 mb-4" />
          <p className="text-lg font-bold text-on-surface mb-2">No live classes found</p>
          <p className="text-sm text-on-surface-variant max-w-sm">
            You don't have any classes scheduled yet. Click "Schedule Class" above to create your
            first class.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedClasses.map((c) => (
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
                          ? "default"
                          : c.status === "CANCELLED"
                            ? "error"
                            : "info"
                    }
                  >
                    {c.status}
                  </Badge>
                  {c.status === "LIVE" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant">
                      <Icon name="groups" className="text-[14px] text-primary" />
                      {participantCounts[c._id] ?? 0} / {c.maxStudents ?? 100} joined
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-on-surface mb-1.5">{c.title}</h3>
                {c.description && (
                  <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                    {c.description}
                  </p>
                )}

                <div className="space-y-2 border-t border-outline-variant/20 pt-4 mb-6">
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <Icon name="calendar_today" className="text-[16px] text-primary" />
                    <span className="font-semibold text-on-surface">Scheduled At:</span>{" "}
                    {new Date(c.scheduledAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <Icon name="schedule" className="text-[16px] text-primary" />
                    <span className="font-semibold text-on-surface">Duration:</span> {c.duration}{" "}
                    minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {c.status === "SCHEDULED" && (
                  <>
                    <button
                      onClick={() => handleStartClass(c)}
                      disabled={startingId === c._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-accent transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="play_arrow" />
                      {startingId === c._id ? "Starting..." : "Start Class"}
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
                      onClick={() => navigate({ to: `/classroom/${c.roomName || c._id}` })}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer border-none"
                    >
                      <Icon name="video_call" />
                      Join Classroom
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

          <Input
            type="number"
            label="Maximum Students"
            value={form.maxStudents}
            onChange={(e) => setForm({ ...form, maxStudents: parseInt(e.target.value) || 50 })}
            min={1}
            max={500}
            required
          />

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
    </TeacherLayout>
  );
}
