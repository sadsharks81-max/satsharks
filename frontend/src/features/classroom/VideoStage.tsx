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
}

export function VideoStage({ teacherIdentity }: VideoStageProps) {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const screenShareTrack = tracks.find((t) => t.source === Track.Source.ScreenShare);
  const cameraTracks = tracks.filter((t) => t.source === Track.Source.Camera);

  if (screenShareTrack) {
    return (
      <div className="flex h-full w-full flex-col gap-3 p-4 min-h-0">
        <div className="flex-1 min-h-0">
          <ParticipantTile
            trackRef={screenShareTrack}
            isTeacher={screenShareTrack.participant.identity === teacherIdentity}
            spotlight
          />
        </div>
        {cameraTracks.length > 0 && (
          <div className="flex gap-3 h-28 shrink-0 overflow-x-auto pb-1">
            {cameraTracks.map((t) => (
              <div key={t.participant.identity} className="h-full aspect-video shrink-0">
                <ParticipantTile trackRef={t} isTeacher={t.participant.identity === teacherIdentity} />
              </div>
            ))}
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
