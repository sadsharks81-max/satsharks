import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "../../components/common/Icon";
import { useClassStatusPoll } from "./useClassStatusPoll";
import { useLiveClassRoom } from "./useLiveClassRoom";
import { WaitingRoom } from "./WaitingRoom";
import { ClassroomExperience } from "./ClassroomExperience";

const resolveUserId = (user: any): string | undefined => user?.id || user?._id || user?.userId;

const backRouteForRole = (role?: string) => {
  if (role === "TEACHER") return "/teacher/classes";
  if (role === "ADMIN") return "/admin/classes";
  return "/dashboard/live-classes";
};

function FullScreenLoading({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]">
      <div className="flex flex-col items-center gap-3 text-white/70">
        <Icon name="hourglass_top" className="text-4xl animate-spin" />
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </div>
  );
}

function FullScreenMessage({
  icon,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  icon: string;
  title: string;
  message?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120] p-6">
      <div className="w-full max-w-md rounded-3xl bg-surface p-10 text-center shark-shadow border border-outline-variant/40">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
          <Icon name={icon} className="text-3xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-on-surface mb-2">{title}</h2>
        {message && <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">{message}</p>}
        <div className="space-y-2.5">
          <button
            onClick={onPrimary}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-accent transition-colors cursor-pointer border-none"
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              onClick={onSecondary}
              className="w-full py-3 rounded-xl border border-outline-variant/40 hover:bg-surface-container-low text-sm font-bold text-on-surface-variant transition-colors cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClassroomPage({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [disconnected, setDisconnected] = useState(false);

  const role = user?.role;
  const currentUserId = resolveUserId(user);
  const backTo = backRouteForRole(role);
  const handleLeave = () => navigate({ to: backTo as any });

  const { liveClass, loading: classLoading, error: classError } = useClassStatusPoll(roomId);

  const isStudent = role === "STUDENT";
  const canAttemptConnect =
    Boolean(liveClass) && liveClass!.status !== "CANCELLED" && (!isStudent || liveClass!.status === "LIVE") && !disconnected;

  const { token, serverUrl, error: tokenError, upgradeRequired, loading: tokenLoading, refetch } = useLiveClassRoom(
    roomId,
    canAttemptConnect
  );

  if (classLoading) return <FullScreenLoading label="Loading classroom..." />;

  if (classError || !liveClass) {
    return (
      <FullScreenMessage
        icon="error"
        title="Class not found"
        message={classError || "This class session no longer exists."}
        primaryLabel="Go Back"
        onPrimary={handleLeave}
      />
    );
  }

  if (liveClass.status === "CANCELLED") {
    return (
      <FullScreenMessage
        icon="event_busy"
        title="Class cancelled"
        message="This class session was cancelled by your teacher."
        primaryLabel="Go Back"
        onPrimary={handleLeave}
      />
    );
  }

  if (disconnected) {
    return (
      <FullScreenMessage
        icon="wifi_off"
        title="You were disconnected"
        message="Your connection to the classroom dropped. You can try rejoining, or head back to your dashboard."
        primaryLabel="Rejoin Class"
        onPrimary={() => setDisconnected(false)}
        secondaryLabel="Leave"
        onSecondary={handleLeave}
      />
    );
  }

  if (isStudent && liveClass.status !== "LIVE") {
    return <WaitingRoom liveClass={liveClass} onLeave={handleLeave} />;
  }

  if (tokenError) {
    return (
      <FullScreenMessage
        icon={upgradeRequired ? "workspace_premium" : "error"}
        title={upgradeRequired ? "Premium required" : "Unable to join"}
        message={tokenError}
        primaryLabel={upgradeRequired ? "View Plans" : "Try Again"}
        onPrimary={() => (upgradeRequired ? navigate({ to: "/sat" }) : refetch())}
        secondaryLabel="Go Back"
        onSecondary={handleLeave}
      />
    );
  }

  if (tokenLoading || !token || !serverUrl) {
    return <FullScreenLoading label="Connecting to classroom..." />;
  }

  const canModerate = role === "ADMIN" || (role === "TEACHER" && liveClass.teacher?._id === currentUserId);

  return (
    <LiveKitRoom
      key={token}
      token={token}
      serverUrl={serverUrl}
      connect
      audio={false}
      video={false}
      className="fixed inset-0 z-50"
      onDisconnected={() => setDisconnected(true)}
      onError={(err) => console.error("LiveKit room error:", err)}
    >
      <RoomAudioRenderer />
      <ClassroomExperience
        liveClass={liveClass}
        classId={roomId}
        currentUserId={currentUserId}
        canModerate={canModerate}
        onLeave={handleLeave}
      />
    </LiveKitRoom>
  );
}
