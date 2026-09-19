import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { DisconnectReason } from "livekit-client";
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
  // A unified peer connection reduces ICE/transport overhead and is the
  // current LiveKit default for reliable publisher/subscriber recovery.
  singlePeerConnection: true,
};

const LIVEKIT_CONNECT_OPTIONS = {
  autoSubscribe: true,
  maxRetries: 3,
  peerConnectionTimeout: 20_000,
  websocketTimeout: 15_000,
};

const CLASSROOM_CONNECTION_TIMEOUT_MS = 45_000;

const TRANSIENT_DISCONNECT_REASONS = new Set<DisconnectReason | undefined>([
  undefined,
  DisconnectReason.UNKNOWN_REASON,
  DisconnectReason.SERVER_SHUTDOWN,
  DisconnectReason.STATE_MISMATCH,
  DisconnectReason.MIGRATION,
  DisconnectReason.SIGNAL_CLOSE,
]);

const disconnectMessageFor = (reason?: DisconnectReason) => {
  switch (reason) {
    case DisconnectReason.DUPLICATE_IDENTITY:
      return "This account joined the classroom from another tab or device. Close the other session before rejoining.";
    case DisconnectReason.PARTICIPANT_REMOVED:
      return "A teacher or administrator removed you from this classroom.";
    case DisconnectReason.ROOM_DELETED:
    case DisconnectReason.ROOM_CLOSED:
      return "This classroom session has ended or is no longer available.";
    case DisconnectReason.JOIN_FAILURE:
      return "The classroom connection could not be established. Please try again.";
    default:
      return "The classroom connection ended after LiveKit could not recover it. You can safely try joining again.";
  }
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
              A visual element encountered an issue, but your classroom audio and connection remain
              active.
            </p>
            <button
              type="button"
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
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-accent transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              type="button"
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
  const [disconnectReason, setDisconnectReason] = useState<DisconnectReason | undefined>();
  const [connectionFailure, setConnectionFailure] = useState<string | null>(null);
  const [hasConnected, setHasConnected] = useState(false);
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

  const {
    liveClass,
    loading: classLoading,
    error: classError,
    refetch: refetchClass,
  } = useClassStatusPoll(roomId);

  const isStudent = role === "STUDENT";
  const canAttemptConnect =
    Boolean(liveClass) &&
    liveClass!.status !== "CANCELLED" &&
    (!isStudent || liveClass!.status === "LIVE") &&
    !disconnected &&
    !connectionFailure;

  const {
    token,
    serverUrl,
    error: tokenError,
    upgradeRequired,
    loading: tokenLoading,
    refetch: refetchToken,
  } = useLiveClassRoom(roomId, canAttemptConnect);

  const canModerate =
    role === "ADMIN" ||
    (role === "TEACHER" && String(liveClass?.teacher?._id) === String(currentUserId));

  // Automatically mark scheduled class as LIVE when teacher or admin joins so students are admitted immediately
  useEffect(() => {
    if (canModerate && liveClass?.status === "SCHEDULED") {
      api
        .put(`/api/live-classes/${roomId}/status`, { status: "LIVE" })
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
  const handleRejoin = useCallback(async (): Promise<boolean> => {
    setIsRejoining(true);
    try {
      const res = await refetchToken();
      if (res && res.success && res.token) {
        setHasConnected(false);
        setConnectionFailure(null);
        setDisconnected(false);
        setDisconnectReason(undefined);
        setConnectionGeneration((generation) => generation + 1);
        return true;
      }
      setDisconnected(false);
      setConnectionFailure(res?.error || "Unable to reconnect to the classroom. Please try again.");
      return false;
    } finally {
      setIsRejoining(false);
    }
  }, [refetchToken]);

  const handleLiveKitConnected = useCallback(() => {
    console.info("[Classroom] LiveKit room connected", {
      classId: roomId,
      roomName: liveClass?.roomName,
      identity: currentUserId,
    });
    setHasConnected(true);
    setConnectionFailure(null);
    setDisconnected(false);
    setDisconnectReason(undefined);
    autoRejoinAttemptsRef.current = 0;
    if (autoRejoinTimerRef.current) window.clearTimeout(autoRejoinTimerRef.current);
  }, [currentUserId, liveClass?.roomName, roomId]);

  const handleLiveKitDisconnected = useCallback(
    (reason?: DisconnectReason) => {
      if (isUnmountingRef.current) return;
      // DisconnectReason.CLIENT_INITIATED is 1 — do not treat intentional leaves as errors
      if (reason === DisconnectReason.CLIENT_INITIATED) {
        console.info("[Classroom] LiveKit disconnected gracefully (client initiated)");
        return;
      }
      setHasConnected(false);
      setDisconnectReason(reason);
      setDisconnected(true);
      console.warn("[Classroom] LiveKit room disconnected", {
        classId: roomId,
        roomName: liveClass?.roomName,
        identity: currentUserId,
        reason: reason === undefined ? "UNKNOWN" : DisconnectReason[reason],
        reasonCode: reason,
      });

      // Transient disconnect (such as state mismatch, temporary network drop, signal close):
      // After LiveKit's internal recovery has ended, try two bounded fresh-token rejoins.
      if (autoRejoinAttemptsRef.current < 2 && TRANSIENT_DISCONNECT_REASONS.has(reason)) {
        autoRejoinAttemptsRef.current += 1;
        console.info(
          `[Classroom] Attempting fresh-token rejoin (${autoRejoinAttemptsRef.current}/2)`,
        );
        if (autoRejoinTimerRef.current) window.clearTimeout(autoRejoinTimerRef.current);
        autoRejoinTimerRef.current = window.setTimeout(() => {
          if (!isUnmountingRef.current) {
            void handleRejoin().then((success) => {
              console.info(
                `[Classroom] Automatic fresh-token rejoin ${success ? "started" : "failed"}`,
              );
            });
          }
        }, 1_000);
      }
    },
    [currentUserId, handleRejoin, liveClass?.roomName, roomId],
  );

  const handleLiveKitError = useCallback(
    (err: Error) => {
      console.error("[Classroom] LiveKit connection failed", {
        classId: roomId,
        roomName: liveClass?.roomName,
        name: err.name,
        message: err.message,
      });
      setHasConnected(false);
      setConnectionFailure("Unable to connect to the classroom. Please try again.");
    },
    [liveClass?.roomName, roomId],
  );

  useEffect(() => {
    if (!token || !serverUrl || disconnected || connectionFailure || hasConnected) return;

    const timeout = window.setTimeout(() => {
      console.error("[Classroom] LiveKit connection timed out", {
        classId: roomId,
        roomName: liveClass?.roomName,
      });
      setConnectionFailure("The classroom connection timed out. Please try again.");
    }, CLASSROOM_CONNECTION_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [
    connectionFailure,
    disconnected,
    hasConnected,
    liveClass?.roomName,
    roomId,
    serverUrl,
    token,
  ]);

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
        title={
          disconnectReason === DisconnectReason.PARTICIPANT_REMOVED
            ? "Removed from classroom"
            : "Classroom disconnected"
        }
        message={disconnectMessageFor(disconnectReason)}
        primaryLabel={isRejoining ? "Reconnecting..." : "Rejoin Class"}
        onPrimary={() => void handleRejoin()}
        primaryDisabled={isRejoining}
        secondaryLabel="Leave"
        onSecondary={handleLeave}
      />
    );
  }

  if (connectionFailure) {
    return (
      <FullScreenMessage
        icon="error"
        title="Unable to connect"
        message={connectionFailure}
        primaryLabel={isRejoining ? "Connecting..." : "Try Again"}
        onPrimary={() => void handleRejoin()}
        primaryDisabled={isRejoining}
        secondaryLabel="Go Back"
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
