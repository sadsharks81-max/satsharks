import { useState } from "react";
import { useParticipants, useConnectionQualityIndicator, useParticipantAttributes } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { Icon } from "../../components/common/Icon";
import { liveClassApi } from "../../services/liveClassApi";
import { QUALITY_DOT_COLOR } from "./connectionQuality";

interface ParticipantRowProps {
  participant: Participant;
  isTeacher: boolean;
  canModerate: boolean;
  classId: string;
}

function ParticipantRow({ participant, isTeacher, canModerate, classId }: ParticipantRowProps) {
  const { quality } = useConnectionQualityIndicator({ participant });
  const { attributes } = useParticipantAttributes({ participant });
  const handRaised = attributes?.handRaised === "true";
  const [busy, setBusy] = useState(false);

  const handleMute = async () => {
    setBusy(true);
    try {
      await liveClassApi.muteParticipant(classId, participant.identity, participant.isMicrophoneEnabled);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${participant.name || "this participant"} from the class?`)) return;
    setBusy(true);
    try {
      await liveClassApi.removeParticipant(classId, participant.identity);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="relative h-9 w-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {participant.name?.charAt(0).toUpperCase() || "?"}
          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#101a2c] ${QUALITY_DOT_COLOR[quality]}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-white">{participant.name || "Guest"}</span>
            {isTeacher && (
              <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                Teacher
              </span>
            )}
          </div>
          {handRaised && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-accent">
              <Icon name="front_hand" className="text-[12px]" /> Hand raised
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Icon
          name={participant.isMicrophoneEnabled ? "mic" : "mic_off"}
          className={`text-[16px] ${participant.isMicrophoneEnabled ? "text-white/70" : "text-error"}`}
        />
        <Icon
          name={participant.isCameraEnabled ? "videocam" : "videocam_off"}
          className={`text-[16px] ${participant.isCameraEnabled ? "text-white/70" : "text-white/30"}`}
        />
        {canModerate && !isTeacher && (
          <>
            <button
              disabled={busy}
              onClick={handleMute}
              title="Mute microphone"
              className="cursor-pointer rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Icon name="mic_off" className="text-[15px]" />
            </button>
            <button
              disabled={busy}
              onClick={handleRemove}
              title="Remove from class"
              className="cursor-pointer rounded-lg p-1.5 text-error transition-colors hover:bg-error/20 disabled:opacity-40"
            >
              <Icon name="person_remove" className="text-[15px]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface ParticipantsPanelProps {
  classId: string;
  teacherIdentity?: string;
  canModerate: boolean;
}

export function ParticipantsPanel({ classId, teacherIdentity, canModerate }: ParticipantsPanelProps) {
  const participants = useParticipants();

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-3">
      {participants.map((p) => (
        <ParticipantRow
          key={p.identity}
          participant={p}
          isTeacher={p.identity === teacherIdentity}
          canModerate={canModerate}
          classId={classId}
        />
      ))}
    </div>
  );
}
