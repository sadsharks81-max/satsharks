import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "../../components/common/Icon";
import { api } from "../../services/api";
import { useClassStatusPoll } from "./useClassStatusPoll";
import { useLiveClassRoom } from "./useLiveClassRoom";
import { WaitingRoom } from "./WaitingRoom";
import { ClassroomExperience } from "./ClassroomExperience";
import type { User } from "../../types";

const resolveUserId = (user: User | null): string | undefined =>
  user?.id || user?._id || user?.userId;

const LIVEKIT_ROOM_OPTIONS = {
  adaptiveStream: { pauseVideoInBackground: true },
  dynacast: true,
  stopLocalTrackOnUnpublish: true,
  singlePeerConnection: false,
};

const LIVEKIT_CONNECT_OPTIONS = {
  autoSubscribe: true,
  maxRetries: 10,
  peerConnectionTimeout: 30000,
  websocketTimeout: 30000,
};

const DISCONNECT_REASON_NAMES: Record<number, string> = {
  0: "UNKNOWN_REASON",
  1: "CLIENT_INITIATED",
  2: "DUPLICATE_IDENTITY",
  3: "SERVER_SHUTDOWN",
  4: "PARTICIPANT_REMOVED",
  5: "ROOM_DELETED",
  6: "STATE_MISMATCH",
  7: "JOIN_FAILURE",
  8: "MIGRATION",
  9: "SIGNAL_CLOSE",
  10: "ROOM_CLOSED",
  11: "USER_UNAVAILABLE",
  12: "USER_REJECTED",
  13: "SIP_TRUNK_FAILURE",
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ClassroomErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ClassroomErrorBoundary] Caught stage error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-6 bg-[#0B1120] text-white">
          <div className="max-w-md text-center space-y-4">
            <Icon name="warning" className="text-4xl text-accent mx-auto" />
            <h3 className="text-lg font-bold">Classroom Display Warning</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              A visual element encountered an issue, but your classroom audio and connection remain active.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-accent cursor-pointer border-none transition-colors"
            >
              Reload Display
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  primaryDisabled,
}: {
  icon: string;
  title: string;
  message?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  primaryDisabled?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120] p-6">
      <div className="w-full max-w-md rounded-3xl bg-surface p-10 text-center shark-shadow border border-outline-variant/40">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
          <Icon name={icon} className="text-3xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-on-surface mb-2">{title}</h2>
        {message && (
          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">{message}</p>
        )}
        <div className="space-y-2.5">
          <button
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-accent transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [isRejoining, setIsRejoining] = useState(false);
  const [connectionGeneration, setConnectionGeneration] = useState(0);
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    isUnmountingRef.current = false;
    return () => {
      isUnmountingRef.current = true;
    };
  }, []);

  const role = user?.role;
  const currentUserId = resolveUserId(user);
  const backTo = backRouteForRole(role);
  const handleLeave = () => {
    isUnmountingRef.current = true;
    navigate({ to: backTo });
  };

  const { liveClass, loading: classLoading, error: classError, refetch: refetchClass } = useClassStatusPoll(roomId);

  const isStudent = role === "STUDENT";
  const canAttemptConnect =
    Boolean(liveClass) &&
    liveClass!.status !== "CANCELLED" &&
    (!isStudent || liveClass!.status === "LIVE") &&
    !disconnected;

  const {
    token,
    serverUrl,
    error: tokenError,
    upgradeRequired,
    loading: tokenLoading,
    refetch: refetchToken,
  } = useLiveClassRoom(roomId, canAttemptConnect);

  const canModerate =
    role === "ADMIN" || (role === "TEACHER" && String(liveClass?.teacher?._id) === String(currentUserId));

  // Automatically mark scheduled class as LIVE when teacher or admin joins so students are admitted immediately
  useEffect(() => {
    if (canModerate && liveClass && liveClass.status === "SCHEDULED") {
      api.put(`/api/live-classes/${roomId}/status`, { status: "LIVE" })
        .then((res) => {
          if (res.success) {
            void refetchClass();
          }
        })
        .catch((err) => console.error("Auto-start class error:", err));
    }
  }, [canModerate, liveClass?.status, roomId, refetchClass]);

  const handleStartClass = useCallback(async () => {
    try {
      const res = await api.put(`/api/live-classes/${roomId}/status`, { status: "LIVE" });
      if (res.success) {
        await refetchClass();
      } else {
        alert(res.error || "Failed to start class session.");
      }
    } catch {
      alert("Error starting class session.");
    }
  }, [roomId, refetchClass]);

  const handleEndClass = useCallback(async () => {
    try {
      const res = await api.put(`/api/live-classes/${roomId}/status`, { status: "COMPLETED" });
      if (res.success) {
        await refetchClass();
        isUnmountingRef.current = true;
        navigate({ to: backTo });
      } else {
        alert(res.error || "Failed to end class session.");
      }
    } catch {
      alert("Error ending class session.");
    }
  }, [roomId, refetchClass, navigate, backTo]);

  const autoRejoinAttemptsRef = useRef(0);
  const autoRejoinTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (autoRejoinTimerRef.current) window.clearTimeout(autoRejoinTimerRef.current);
    };
  }, []);

  // Clean rejoin: fetch fresh token FIRST before resetting disconnected state
  // to avoid mounting with stale tokens and avoid unmounting race conditions
  const handleRejoin = useCallback(async () => {
    setIsRejoining(true);
    try {
      const res = await refetchToken();
      if (res && res.success && res.token) {
        setDisconnected(false);
        setConnectionGeneration((generation) => generation + 1);
      }
    } finally {
      setIsRejoining(false);
    }
  }, [refetchToken]);

  const handleLiveKitConnected = useCallback(() => {
    console.log("[Classroom] LiveKit room connected successfully");
    autoRejoinAttemptsRef.current = 0;
    if (autoRejoinTimerRef.current) window.clearTimeout(autoRejoinTimerRef.current);
  }, []);

  const handleLiveKitDisconnected = useCallback((reason?: any) => {
    if (isUnmountingRef.current) return;
    // DisconnectReason.CLIENT_INITIATED is 1 — do not treat intentional leaves as errors
    if (reason === 1 || reason === "CLIENT_INITIATED") {
      console.log("[Classroom] LiveKit disconnected gracefully (client initiated)");
      return;
    }
    const reasonName = typeof reason === "number" ? DISCONNECT_REASON_NAMES[reason] || `REASON_${reason}` : String(reason);
    console.warn(`[Classroom] LiveKit room disconnected: ${reasonName} (code: ${reason})`);

    // Transient disconnect (such as state mismatch, temporary network drop, signal close):
    // Attempt automatic silent recovery up to 3 times before presenting a blocking error modal
    if (autoRejoinAttemptsRef.current < 3 && (reason === 6 || reason === 9 || reason === 0 || reason === undefined)) {
      autoRejoinAttemptsRef.current += 1;
      console.info(`[Classroom] Attempting automatic reconnect (attempt ${autoRejoinAttemptsRef.current}/3)...`);
      if (autoRejoinTimerRef.current) window.clearTimeout(autoRejoinTimerRef.current);
      autoRejoinTimerRef.current = window.setTimeout(() => {
        if (!isUnmountingRef.current) {
          void handleRejoin().then(() => {
            console.info("[Classroom] Automatic reconnect completed.");
          }).catch((err) => {
            console.error("[Classroom] Automatic reconnect failed:", err);
            setDisconnected(true);
          });
        }
      }, 800);
      return;
    }

    setDisconnected(true);
  }, [handleRejoin]);

  const handleLiveKitError = useCallback((err: Error) => {
    console.error("[Classroom] LiveKit room error:", err);
  }, []);

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
        message="Your connection to the classroom dropped. Click below to reconnect to the session."
        primaryLabel={isRejoining ? "Reconnecting..." : "Rejoin Class"}
        onPrimary={() => void handleRejoin()}
        primaryDisabled={isRejoining}
        secondaryLabel="Leave"
        onSecondary={handleLeave}
      />
    );
  }

  if (isStudent && liveClass.status === "COMPLETED") {
    return (
      <FullScreenMessage
        icon="check_circle"
        title="Class has ended"
        message="This class session has been completed. Thank you for attending!"
        primaryLabel="Go Back"
        onPrimary={handleLeave}
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
        onPrimary={() => (upgradeRequired ? navigate({ to: "/sat" }) : refetchToken())}
        secondaryLabel="Go Back"
        onSecondary={handleLeave}
      />
    );
  }

  if (tokenLoading || !token || !serverUrl) {
    return <FullScreenLoading label="Connecting to classroom..." />;
  }

  return (
    <LiveKitRoom
      key={`${token}:${connectionGeneration}`}
      token={token}
      serverUrl={serverUrl}
      connect
      audio={false}
      video={false}
      options={LIVEKIT_ROOM_OPTIONS}
      connectOptions={LIVEKIT_CONNECT_OPTIONS}
      className="fixed inset-0 z-50"
      onConnected={handleLiveKitConnected}
      onDisconnected={handleLiveKitDisconnected}
      onError={handleLiveKitError}
    >
      <RoomAudioRenderer />
      <ClassroomErrorBoundary>
        <ClassroomExperience
          liveClass={liveClass}
          classId={roomId}
          currentUserId={currentUserId}
          canModerate={canModerate}
          onStartClass={handleStartClass}
          onEndClass={handleEndClass}
          onLeave={handleLeave}
        />
      </ClassroomErrorBoundary>
    </LiveKitRoom>
  );
}
