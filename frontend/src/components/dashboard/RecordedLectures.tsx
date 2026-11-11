import { useEffect, useState } from "react";
import { api, getBackendUrl } from "../../services/api";
import { Icon } from "../common/Icon";
import { EmptyState } from "../ui/EmptyState";

interface RecordedLecture {
  _id: string;
  title: string;
  description: string;
  scheduledAt: string;
  recordedAt: string;
  duration: number;
  teacherName: string;
}

export function RecordedLectures() {
  const [recordings, setRecordings] = useState<RecordedLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [activeRecording, setActiveRecording] = useState<RecordedLecture | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/api/live-classes/recordings").then((result) => {
      if (!active) return;
      if (result.success) setRecordings(result.recordings || []);
      else setError(result.error || "Recorded lectures could not be loaded.");
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const watchRecording = async (recording: RecordedLecture) => {
    setOpeningId(recording._id);
    setError("");
    const result = await api.post(
      `/api/live-classes/recordings/${recording._id}/playback-session`,
      {},
    );
    setOpeningId(null);
    if (!result.success || !result.playbackUrl) {
      setError(result.error || "This recording could not be opened.");
      return;
    }
    setActiveRecording(recording);
    setPlaybackUrl(`${getBackendUrl()}${result.playbackUrl}`);
  };

  const closePlayer = () => {
    setActiveRecording(null);
    setPlaybackUrl("");
  };

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          <Icon name="video_library" className="text-[18px]" /> Class library
        </div>
        <h1 className="text-3xl font-bold text-on-surface">Recorded Lectures</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Rewatch completed live classes directly inside your SATSharks dashboard.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm font-medium text-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-24 text-sm font-semibold text-on-surface-variant">
          <Icon name="progress_activity" className="animate-spin text-2xl text-primary" />
          Loading recorded lectures...
        </div>
      ) : recordings.length === 0 ? (
        <EmptyState
          icon="video_library"
          title="No recorded lectures yet"
          description="No live class has been recorded and published yet. Completed recordings will appear here automatically once they are ready."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recordings.map((recording) => (
            <article
              key={recording._id}
              className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 via-surface-container-high to-accent/15">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                  <Icon name="play_arrow" className="text-4xl" />
                </span>
              </div>
              <div className="p-5">
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Icon name="calendar_month" className="text-[14px]" />
                    {new Date(recording.recordedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" className="text-[14px]" /> {recording.duration} min
                  </span>
                </div>
                <h2 className="line-clamp-2 text-lg font-bold leading-snug text-on-surface">
                  {recording.title}
                </h2>
                <p className="mt-1 text-xs font-semibold text-primary">{recording.teacherName}</p>
                <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-relaxed text-on-surface-variant">
                  {recording.description || "Recorded SATSharks live class."}
                </p>
                <button
                  type="button"
                  onClick={() => void watchRecording(recording)}
                  disabled={openingId === recording._id}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-on-primary transition-colors hover:bg-accent disabled:opacity-60"
                >
                  <Icon name="play_circle" className="text-[18px]" />
                  {openingId === recording._id ? "Opening..." : "Watch lecture"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeRecording && playbackUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white sm:px-6">
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold sm:text-lg">{activeRecording.title}</h2>
              <p className="truncate text-xs text-white/55">{activeRecording.teacherName}</p>
            </div>
            <button
              type="button"
              onClick={closePlayer}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close video player"
            >
              <Icon name="close" className="text-2xl" />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
            <video
              src={playbackUrl}
              controls
              autoPlay
              playsInline
              className="max-h-full w-full max-w-6xl rounded-xl bg-black shadow-2xl"
              onError={() => setError("The recording could not be played. Please try again.")}
            >
              Your browser does not support video playback.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
