import { createFileRoute, Link } from "@tanstack/react-router";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/live-classes")
      .then((res) => {
        if (res.success) {
          setClasses(res.classes || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scheduled = classes.filter((c) => c.status === "SCHEDULED");
  const live = classes.filter((c) => c.status === "LIVE");
  const completed = classes.filter((c) => c.status === "COMPLETED");

  return (
    <TeacherLayout activeItem="/teacher">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-on-background mb-2">Teacher Dashboard</h1>
        <p className="text-on-surface-variant text-sm">
          Welcome! Manage your scheduled classes, launch live teaching sessions, and upload study materials.
        </p>
      </div>

      {loading ? (
        <div className="text-center p-8 animate-pulse text-on-surface-variant">Loading dashboard stats...</div>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shark-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon name="event" className="text-2xl" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Scheduled Classes</p>
                <p className="text-2xl font-bold text-on-surface mt-1">{scheduled.length}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shark-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <Icon name="live_tv" className="text-2xl animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Active Classes</p>
                <p className="text-2xl font-bold text-success mt-1">{live.length}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shark-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-on-surface-variant/10 text-on-surface-variant flex items-center justify-center">
                <Icon name="check_circle" className="text-2xl" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Completed Classes</p>
                <p className="text-2xl font-bold text-on-surface mt-1">{completed.length}</p>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Upcoming Classes */}
            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shark-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-on-surface">Upcoming Classes</h2>
                <Link to="/teacher/classes" className="text-primary text-sm font-semibold hover:underline">
                  View All
                </Link>
              </div>

              {scheduled.length === 0 && live.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant text-sm">
                  <Icon name="calendar_today" className="text-3xl opacity-35 mb-2 block mx-auto" />
                  No upcoming classes scheduled.
                </div>
              ) : (
                <div className="space-y-4">
                  {[...live, ...scheduled].slice(0, 4).map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-surface-container-low transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-on-surface text-sm">{c.title}</h3>
                          <Badge variant={c.status === "LIVE" ? "success" : "info"}>
                            {c.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                          <Icon name="schedule" className="text-[14px]" />
                          {new Date(c.scheduledAt).toLocaleString()} ({c.duration} mins)
                        </p>
                      </div>

                      <Link
                        to="/teacher/classes"
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          c.status === "LIVE"
                            ? "bg-success text-white hover:opacity-90"
                            : "bg-primary text-on-primary hover:bg-accent"
                        }`}
                      >
                        <Icon name="video_call" />
                        {c.status === "LIVE" ? "Manage Call" : "Start Call"}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Quick Actions */}
            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shark-shadow space-y-6">
              <h2 className="text-lg font-bold text-on-surface">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/teacher/classes"
                  className="p-5 border border-outline-variant/30 rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low transition-all text-left flex flex-col justify-between h-36"
                >
                  <Icon name="video_camera_front" className="text-3xl text-primary" />
                  <div>
                    <h3 className="font-bold text-on-surface text-sm mb-1">Start Teaching</h3>
                    <p className="text-xs text-on-surface-variant">View your scheduled teaching sessions.</p>
                  </div>
                </Link>

                <Link
                  to="/teacher/study-materials"
                  className="p-5 border border-outline-variant/30 rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low transition-all text-left flex flex-col justify-between h-36"
                >
                  <Icon name="upload_file" className="text-3xl text-success" />
                  <div>
                    <h3 className="font-bold text-on-surface text-sm mb-1">Upload Notes</h3>
                    <p className="text-xs text-on-surface-variant">Upload PDF study guides or class notes.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}
