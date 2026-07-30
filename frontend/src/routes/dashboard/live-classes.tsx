import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/dashboard/live-classes")({
  component: () => (
    <StudentLayout activeItem="/dashboard/live-classes">
      <StudentLiveClasses />
    </StudentLayout>
  ),
});

const JOIN_BUFFER_MINUTES = 10;

type JoinState =
  | { kind: "ready" }
  | { kind: "not-paid" }
  | { kind: "waiting-for-window"; opensAt: Date }
  | { kind: "waiting-for-teacher" }
  | { kind: "ended" }
  | { kind: "cancelled" };

function getJoinState(c: any, now: Date, isPaid: boolean): JoinState {
  if (c.status === "CANCELLED") return { kind: "cancelled" };
  if (c.status === "COMPLETED") return { kind: "ended" };

  const scheduledAt = new Date(c.scheduledAt);
  const opensAt = new Date(scheduledAt.getTime() - JOIN_BUFFER_MINUTES * 60000);
  const closesAt = new Date(scheduledAt.getTime() + (c.duration || 60) * 60000);

  if (now > closesAt) return { kind: "ended" };
  if (now < opensAt && c.status !== "LIVE") return { kind: "waiting-for-window", opensAt };
  if (!isPaid) return { kind: "not-paid" };
  if (c.status !== "LIVE") return { kind: "waiting-for-teacher" };
  return { kind: "ready" };
}

function JoinClassButton({ classSession, now, isPaid, onJoin }: { classSession: any; now: Date; isPaid: boolean; onJoin: (c: any) => void }) {
  const state = getJoinState(classSession, now, isPaid);

  if (state.kind === "ready") {
    return (
      <button
        onClick={() => onJoin(classSession)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-success text-white rounded-xl font-bold text-sm hover:opacity-95 transition-opacity cursor-pointer border-none"
      >
        <Icon name="video_call" /> Join Class
      </button>
    );
  }

  if (state.kind === "not-paid") {
    return (
      <Link
        to="/sat"
        hash="pricing"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent/15 text-accent border border-accent/30 rounded-xl font-bold text-xs hover:bg-accent/25 transition-colors"
      >
        <Icon name="workspace_premium" className="text-[16px]" /> Upgrade to Join
      </Link>
    );
  }

  const label =
    state.kind === "waiting-for-teacher"
      ? "Waiting for Instructor"
      : state.kind === "waiting-for-window"
      ? `Class starts at ${state.opensAt.toLocaleString()}`
      : state.kind === "cancelled"
      ? "Class Cancelled"
      : "Class Ended";

  return (
    <button
      disabled
      className="w-full sm:w-auto px-5 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-xs cursor-not-allowed border-none"
    >
      {label}
    </button>
  );
}

function ClassCard({ c, now, isPaid, onJoin, tone }: { c: any; now: Date; isPaid: boolean; onJoin: (c: any) => void; tone: "live" | "default" }) {
  return (
    <div
      className={`rounded-2xl p-6 shark-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        tone === "live"
          ? "bg-success-container/10 border border-success/30"
          : "bg-surface-container-lowest border border-outline-variant/35 hover:border-outline-variant transition-colors"
      }`}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          {tone === "live" && <Badge variant="success">LIVE NOW</Badge>}
          <span className="text-xs text-on-surface-variant font-medium">Duration: {c.duration} mins</span>
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-1">{c.title}</h3>
        {c.description && <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{c.description}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Icon name="calendar_today" className="text-[14px] text-primary" />
            {new Date(c.scheduledAt).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="person" className="text-[14px] text-primary" />
            Teacher: {c.teacher?.name}
          </span>
        </div>
      </div>
      <JoinClassButton classSession={c} now={now} isPaid={isPaid} onJoin={onJoin} />
    </div>
  );
}

function StudentLiveClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const isPaid = user?.subscription === "PAID";

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

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = (c: any) => {
    navigate({ to: `/classroom/${c.roomName || c._id}` });
  };

  const live = classes.filter((c) => c.status === "LIVE");
  const upcoming = classes.filter((c) => c.status === "SCHEDULED");
  const completed = classes.filter((c) => c.status === "COMPLETED" || c.status === "CANCELLED");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-on-background mb-2">Live Classes</h1>
        <p className="text-on-surface-variant text-sm">
          Join scheduled class sessions and participate in interactive video classes with your teacher - right here on SAT Sharks.
        </p>
      </div>

      {!loading && !isPaid && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Icon name="workspace_premium" className="text-accent text-[20px]" />
            <span className="text-sm font-semibold text-on-surface">
              Live classes are a Premium feature. Upgrade to join sessions with your teacher.
            </span>
          </div>
          <Link to="/sat" hash="pricing" className="text-xs font-bold text-accent hover:underline shrink-0">
            View Plans
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 animate-pulse text-on-surface-variant">Loading class schedule...</div>
      ) : (
        <div className="space-y-8">
          {/* Live Now */}
          {live.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-success flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                Live Now
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {live.map((c) => (
                  <ClassCard key={c._id} c={c} now={now} isPaid={isPaid} onJoin={handleJoin} tone="live" />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-on-surface">Upcoming</h2>
            {upcoming.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-12 text-center">
                <Icon name="calendar_today" className="text-4xl text-on-surface-variant/40 mb-3 block mx-auto" />
                <p className="font-bold text-on-surface text-sm mb-1">No Upcoming Classes</p>
                <p className="text-xs text-on-surface-variant">There are no classes scheduled for the coming days.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {upcoming.map((c) => (
                  <ClassCard key={c._id} c={c} now={now} isPaid={isPaid} onJoin={handleJoin} tone="default" />
                ))}
              </div>
            )}
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-on-surface-variant">Completed</h2>
              <div className="grid grid-cols-1 gap-4">
                {completed.map((c) => (
                  <ClassCard key={c._id} c={c} now={now} isPaid={isPaid} onJoin={handleJoin} tone="default" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
