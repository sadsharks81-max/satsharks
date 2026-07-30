import { VideoTrack, useIsSpeaking, useConnectionQualityIndicator, useParticipantAttributes } from "@livekit/components-react";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import { Icon } from "../../components/common/Icon";
import { QUALITY_DOT_COLOR } from "./connectionQuality";

interface ParticipantTileProps {
  trackRef: TrackReferenceOrPlaceholder;
  isTeacher: boolean;
  spotlight?: boolean;
}

export function ParticipantTile({ trackRef, isTeacher, spotlight = false }: ParticipantTileProps) {
  const { participant } = trackRef;
  const isSpeaking = useIsSpeaking(participant);
  const { quality } = useConnectionQualityIndicator({ participant });
  const { attributes } = useParticipantAttributes({ participant });
  const handRaised = attributes?.handRaised === "true";
  const hasVideo = Boolean(trackRef.publication) && !trackRef.publication?.isMuted;

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-2xl bg-[#101a2c] border transition-all ${
        isSpeaking ? "border-primary shadow-[0_0_0_2px_rgba(11,25,41,0.4)]" : "border-white/10"
      }`}
    >
      {hasVideo ? (
        <VideoTrack trackRef={trackRef as any} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={`flex items-center justify-center rounded-full bg-primary/20 text-primary font-display font-bold ${
              spotlight ? "h-24 w-24 text-4xl" : "h-14 w-14 text-xl"
            }`}
          >
            {participant.name?.charAt(0).toUpperCase() || "?"}
          </div>
        </div>
      )}

      {/* Hand raised */}
      {handRaised && (
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary shadow-md animate-bounce">
          <Icon name="front_hand" className="text-[16px]" />
        </div>
      )}

      {/* Name + status bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${QUALITY_DOT_COLOR[quality]}`} />
          <span className="truncate text-xs font-semibold text-white">{participant.name || "Guest"}</span>
          {isTeacher && (
            <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
              Teacher
            </span>
          )}
        </div>
        <Icon
          name={participant.isMicrophoneEnabled ? "mic" : "mic_off"}
          className={`text-[16px] shrink-0 ${participant.isMicrophoneEnabled ? "text-white" : "text-error"}`}
        />
      </div>
    </div>
  );
}
