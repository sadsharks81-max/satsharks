import { useState, useRef, useEffect } from "react";
import {
  useTrackToggle,
  useLocalParticipant,
  useMediaDeviceSelect,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Icon } from "../../components/common/Icon";

type PanelKind = "chat" | "participants" | "notes";

interface ToolbarButtonProps {
  id?: string;
  icon: string;
  label: string;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  onClick?: () => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

function ToolbarButton({
  id,
  icon,
  label,
  active,
  danger,
  badge,
  onClick,
  buttonProps,
}: ToolbarButtonProps) {
  return (
    <button
      id={id}
      title={label}
      onClick={onClick}
      {...buttonProps}
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
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

function DeviceSettingsMenu({ onClose }: { onClose: () => void }) {
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
          onChange={(e) => mic.setActiveMediaDevice(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white outline-none"
        >
          {mic.devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId} className="bg-[#101a2c]">
              {d.label || "Microphone"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
          Camera
        </label>
        <select
          value={cam.activeDeviceId}
          onChange={(e) => cam.setActiveMediaDevice(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white outline-none"
        >
          {cam.devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId} className="bg-[#101a2c]">
              {d.label || "Camera"}
            </option>
          ))}
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
}: BottomToolbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenShareError, setScreenShareError] = useState("");
  const { isScreenShareEnabled } = useLocalParticipant();

  const mic = useTrackToggle({ source: Track.Source.Microphone });
  const cam = useTrackToggle({ source: Track.Source.Camera });
  const screenShare = useTrackToggle({ source: Track.Source.ScreenShare });

  const toggleScreenShare = async () => {
    setScreenShareError("");
    try {
      await screenShare.toggle();
    } catch (error) {
      console.error("Unable to toggle screen sharing:", error);
      setScreenShareError(
        "Screen sharing could not start. Check browser permission and try again.",
      );
    }
  };

  return (
    <div className="relative flex shrink-0 items-center justify-center gap-2 sm:gap-3 border-t border-white/10 bg-[#0B1120] px-4 py-3 flex-wrap">
      {screenShareError && (
        <div className="absolute bottom-full mb-2 rounded-lg bg-error px-3 py-2 text-xs font-semibold text-white shadow-lg">
          {screenShareError}
        </div>
      )}
      <ToolbarButton
        id="cr-toggle-mic"
        icon={mic.enabled ? "mic" : "mic_off"}
        label={mic.enabled ? "Mute microphone (M)" : "Unmute microphone (M)"}
        danger={!mic.enabled}
        onClick={() => mic.toggle()}
      />
      <ToolbarButton
        id="cr-toggle-cam"
        icon={cam.enabled ? "videocam" : "videocam_off"}
        label={cam.enabled ? "Turn off camera (V)" : "Turn on camera (V)"}
        danger={!cam.enabled}
        onClick={() => cam.toggle()}
      />
      <ToolbarButton
        icon={isScreenShareEnabled ? "cancel_presentation" : "screen_share"}
        label={isScreenShareEnabled ? "Stop screen share" : "Share screen"}
        active={isScreenShareEnabled}
        onClick={() => void toggleScreenShare()}
        buttonProps={{ disabled: screenShare.pending }}
      />
      <ToolbarButton
        icon="front_hand"
        label={handRaised ? "Lower hand (H)" : "Raise hand (H)"}
        active={handRaised}
        onClick={onToggleRaiseHand}
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
        />
        {settingsOpen && <DeviceSettingsMenu onClose={() => setSettingsOpen(false)} />}
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
