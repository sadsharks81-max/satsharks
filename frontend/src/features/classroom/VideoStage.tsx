import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";
import { Icon } from "../../components/common/Icon";

const gridColumnsFor = (count: number) => {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  return 5;
};

interface VideoStageProps {
  teacherIdentity?: string;
  controlsVisible?: boolean;
}

export function VideoStage({ teacherIdentity, controlsVisible = true }: VideoStageProps) {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const screenShareTrack = tracks.find((t) => t.source === Track.Source.ScreenShare);
  const cameraTracks = tracks.filter((t) => t.source === Track.Source.Camera);

  if (screenShareTrack) {
    const teacherCameraTrack = cameraTracks.find((t) => t.participant.identity === teacherIdentity);
    return (
      <div className="relative h-full w-full p-0 min-h-0 bg-[#0B1120]">
        {/* Full-bleed Screen Share */}
        <div className="h-full w-full">
          <ParticipantTile
            trackRef={screenShareTrack}
            isTeacher={screenShareTrack.participant.identity === teacherIdentity}
            spotlight
          />
        </div>
        
        {/* Floating Teacher Picture-in-Picture Tile (Top-Right) */}
        {teacherCameraTrack && (
          <div className={`absolute right-8 z-20 w-48 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#0B1120]/90 transition-all duration-300 ${controlsVisible ? "top-20" : "top-8"}`}>
            <ParticipantTile trackRef={teacherCameraTrack} isTeacher={true} />
          </div>
        )}
      </div>
    );
  }

  if (cameraTracks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <Icon name="hourglass_top" className="text-4xl animate-pulse" />
          <p className="text-sm font-semibold text-white/80">Waiting for participants to join...</p>
        </div>
      </div>
    );
  }

  if (cameraTracks.length === 1) {
    return (
      <div className="h-full w-full p-4">
        <ParticipantTile
          trackRef={cameraTracks[0]}
          isTeacher={cameraTracks[0].participant.identity === teacherIdentity}
          spotlight
        />
      </div>
    );
  }

  const cols = gridColumnsFor(cameraTracks.length);
  return (
    <div
      className="grid h-full w-full gap-3 p-4 min-h-0"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: "1fr" }}
    >
      {cameraTracks.map((t) => (
        <ParticipantTile key={t.participant.identity} trackRef={t} isTeacher={t.participant.identity === teacherIdentity} />
      ))}
    </div>
  );
}
