import { useState, useRef, useEffect } from "react";
import {
  useTrackToggle,
  useLocalParticipant,
  useMediaDeviceSelect,
  useTracks,
} from "@livekit/components-react";
import { ScreenSharePresets, Track } from "livekit-client";
import { Icon } from "../../components/common/Icon";

type PanelKind = "chat" | "participants" | "notes";

const SCREEN_SHARE_CAPTURE_OPTIONS = {
  audio: false,
  contentHint: "text" as const,
  // Preserve document/slide readability without capturing wasteful 30 fps motion.
  resolution: ScreenSharePresets.h1080fps15.resolution,
};

const mediaErrorMessage = (kind: "microphone" | "camera" | "screen", error: unknown) => {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return kind === "screen"
      ? "Screen sharing was cancelled or blocked by the browser."
      : `Please allow ${kind} access in your browser settings.`;
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return `No ${kind === "screen" ? "screen capture source" : kind} is available.`;
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return `The ${kind} is unavailable or already in use by another application.`;
  }
  if (name === "NotSupportedError" || name === "SecurityError") {
    return `${kind === "screen" ? "Screen sharing" : `${kind[0].toUpperCase()}${kind.slice(1)} access`} requires a supported browser over HTTPS.`;
  }
  return `${kind === "screen" ? "Screen sharing" : `${kind[0].toUpperCase()}${kind.slice(1)} access`} could not be started. Please try again.`;
};

interface ToolbarButtonProps {
  id?: string;
  icon: string;
  label: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  badge?: number;
  onClick?: () => void;
}

function ToolbarButton({
  id,
  icon,
  label,
  active,
  danger,
  disabled,
  badge,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      id={id}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 ${
        danger
          ? "bg-error border-error text-white hover:bg-error/90"
          : active
            ? "bg-white text-[#0B1120] border-white"
            : "bg-white/10 border-white/10 text-white hover:bg-white/20"
      }`}
    >
      <Icon name={icon} className="text-[20px]" />
      {Boolean(badge) && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-primary">
          {badge}
        </span>
      )}
    </button>
  );
}

function DeviceSettingsMenu({
  onClose,
  onError,
}: {
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const mic = useMediaDeviceSelect({ kind: "audioinput" });
  const cam = useMediaDeviceSelect({ kind: "videoinput" });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const selectDevice = async (kind: "microphone" | "camera", deviceId: string) => {
    try {
      if (kind === "microphone") await mic.setActiveMediaDevice(deviceId);
      else await cam.setActiveMediaDevice(deviceId);
    } catch (error) {
      console.warn(`[Classroom] Unable to select ${kind} device`, {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : "Unknown device error",
      });
      onError(mediaErrorMessage(kind, error));
    }
  };

  return (
    <div
      ref={ref}
      className="absolute bottom-16 right-0 w-72 rounded-2xl border border-white/10 bg-[#101a2c] p-4 shadow-2xl space-y-4 animate-fade-in"
    >
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
          Microphone
        </label>
        <select
          value={mic.activeDeviceId}
          disabled={mic.devices.length === 0}
          onChange={(e) => void selectDevice("microphone", e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white outline-none"
        >
          {mic.devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId} className="bg-[#101a2c]">
              {d.label || "Microphone"}
            </option>
          ))}
          {mic.devices.length === 0 && <option value="">No microphone detected</option>}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
          Camera
        </label>
        <select
          value={cam.activeDeviceId}
          disabled={cam.devices.length === 0}
          onChange={(e) => void selectDevice("camera", e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white outline-none"
        >
          {cam.devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId} className="bg-[#101a2c]">
              {d.label || "Camera"}
            </option>
          ))}
          {cam.devices.length === 0 && <option value="">No camera detected</option>}
        </select>
      </div>
    </div>
  );
}

interface BottomToolbarProps {
  activePanel: PanelKind | null;
  onTogglePanel: (panel: PanelKind) => void;
  unreadChatCount: number;
  handRaised: boolean;
  onToggleRaiseHand: () => void;
  onOpenWhiteboard: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onLeave: () => void;
  canModerate: boolean;
  mediaControlsDisabled: boolean;
}

export function BottomToolbar({
  activePanel,
  onTogglePanel,
  unreadChatCount,
  handRaised,
  onToggleRaiseHand,
  onOpenWhiteboard,
  isFullscreen,
  onToggleFullscreen,
  onLeave,
  canModerate,
  mediaControlsDisabled,
}: BottomToolbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const { localParticipant, isScreenShareEnabled } = useLocalParticipant();
  const screenShareTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const anotherParticipantIsSharing = screenShareTracks.some(
    (track) =>
      track.participant.identity !== localParticipant.identity &&
      Boolean(track.publication.track) &&
      !track.publication.isMuted,
  );

  const mic = useTrackToggle({
    source: Track.Source.Microphone,
    onDeviceError: (error) => setMediaError(mediaErrorMessage("microphone", error)),
  });
  const cam = useTrackToggle({
    source: Track.Source.Camera,
    onDeviceError: (error) => setMediaError(mediaErrorMessage("camera", error)),
  });
  const screenShare = useTrackToggle({
    source: Track.Source.ScreenShare,
    captureOptions: SCREEN_SHARE_CAPTURE_OPTIONS,
    onDeviceError: (error) => setMediaError(mediaErrorMessage("screen", error)),
  });

  const toggleMic = async () => {
    if (mic.pending) return;
    setMediaError("");
    try {
      await mic.toggle();
    } catch (error) {
      console.warn("Unable to toggle microphone:", error);
      setMediaError(mediaErrorMessage("microphone", error));
    }
  };

  const toggleCam = async () => {
    if (cam.pending) return;
    setMediaError("");
    try {
      await cam.toggle();
    } catch (error) {
      console.warn("Unable to toggle camera:", error);
      setMediaError(mediaErrorMessage("camera", error));
    }
  };

  const toggleScreenShare = async () => {
    if (screenShare.pending) return;
    setMediaError("");
    if (!isScreenShareEnabled && anotherParticipantIsSharing) {
      setMediaError("Another participant is already sharing their screen.");
      return;
    }
    try {
      await screenShare.toggle();
    } catch (error) {
      console.error("Unable to toggle screen sharing:", error);
      setMediaError(mediaErrorMessage("screen", error));
    }
  };

  return (
    <div className="relative flex shrink-0 items-center justify-center gap-2 sm:gap-3 border-t border-white/10 bg-[#0B1120] px-4 py-3 flex-wrap">
      {mediaError && (
        <div
          role="alert"
          className="absolute bottom-full mb-2 rounded-lg bg-error px-3 py-2 text-xs font-semibold text-white shadow-lg flex items-center gap-2"
        >
          <span>{mediaError}</span>
          <button
            type="button"
            aria-label="Dismiss media error"
            onClick={() => setMediaError("")}
            className="text-white/80 hover:text-white font-bold ml-1"
          >
            &times;
          </button>
        </div>
      )}
      <ToolbarButton
        id="cr-toggle-mic"
        icon={mic.enabled ? "mic" : "mic_off"}
        label={mic.enabled ? "Mute microphone (M)" : "Unmute microphone (M)"}
        danger={!mic.enabled}
        onClick={() => void toggleMic()}
        disabled={mediaControlsDisabled || mic.pending}
      />
      <ToolbarButton
        id="cr-toggle-cam"
        icon={cam.enabled ? "videocam" : "videocam_off"}
        label={cam.enabled ? "Turn off camera (V)" : "Turn on camera (V)"}
        danger={!cam.enabled}
        onClick={() => void toggleCam()}
        disabled={mediaControlsDisabled || cam.pending}
      />
      {canModerate && (
        <ToolbarButton
          icon={isScreenShareEnabled ? "cancel_presentation" : "screen_share"}
          label={
            isScreenShareEnabled
              ? "Stop screen share"
              : anotherParticipantIsSharing
                ? "Another participant is sharing"
                : "Share screen"
          }
          active={isScreenShareEnabled}
          onClick={() => void toggleScreenShare()}
          disabled={
            mediaControlsDisabled ||
            screenShare.pending ||
            (!isScreenShareEnabled && anotherParticipantIsSharing)
          }
        />
      )}
      <ToolbarButton
        icon="front_hand"
        label={handRaised ? "Lower hand (H)" : "Raise hand (H)"}
        active={handRaised}
        onClick={onToggleRaiseHand}
        disabled={mediaControlsDisabled}
      />

      <div className="mx-1 h-8 w-[1px] bg-white/10 hidden sm:block" />

      <ToolbarButton
        icon="chat"
        label="Chat"
        active={activePanel === "chat"}
        badge={activePanel === "chat" ? 0 : unreadChatCount}
        onClick={() => onTogglePanel("chat")}
      />
      <ToolbarButton
        icon="group"
        label="Participants"
        active={activePanel === "participants"}
        onClick={() => onTogglePanel("participants")}
      />
      <ToolbarButton icon="draw" label="Whiteboard" onClick={onOpenWhiteboard} />

      <div className="relative">
        <ToolbarButton
          icon="settings"
          label="Settings"
          active={settingsOpen}
          onClick={() => setSettingsOpen((v) => !v)}
          disabled={mediaControlsDisabled}
        />
        {settingsOpen && (
          <DeviceSettingsMenu onClose={() => setSettingsOpen(false)} onError={setMediaError} />
        )}
      </div>

      <ToolbarButton
        icon={isFullscreen ? "fullscreen_exit" : "fullscreen"}
        label={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
        onClick={onToggleFullscreen}
      />

      <div className="mx-1 h-8 w-[1px] bg-white/10 hidden sm:block" />

      <ToolbarButton icon="call_end" label="Leave class" danger onClick={onLeave} />
    </div>
  );
}
