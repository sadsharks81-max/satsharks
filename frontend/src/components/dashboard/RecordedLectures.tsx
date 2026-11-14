import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
  recordingDurationSeconds: number | null;
  teacherName: string;
  visibleToStudents: boolean;
  publicationStatus: "UPLOADING" | "PUBLISHING" | "PUBLISHED" | "FAILED";
  uploadedBytes?: number;
  lastProgressAt?: string | null;
  recordingError?: string | null;
}

const PUBLICATION_DETAILS = {
  UPLOADING: {
    label: "Uploading",
    icon: "cloud_upload",
    badge: "bg-blue-100 text-blue-800",
    panel: "border-blue-200 bg-blue-50 text-blue-900",
    message: "Keep the classroom open and the laptop awake while recording data uploads.",
  },
  PUBLISHING: {
    label: "Publishing",
    icon: "progress_activity",
    badge: "bg-amber-100 text-amber-800",
    panel: "border-amber-200 bg-amber-50 text-amber-900",
    message: "The final part is being saved to Drive. Keep the laptop open until Published.",
  },
  PUBLISHED: {
    label: "Published",
    icon: "check_circle",
    badge: "bg-green-100 text-green-800",
    panel: "border-green-200 bg-green-50 text-green-900",
    message: "Upload complete. The laptop no longer needs to remain open.",
  },
  FAILED: {
    label: "Upload interrupted",
    icon: "error",
    badge: "bg-red-100 text-red-800",
    panel: "border-red-200 bg-red-50 text-red-900",
    message: "This lecture was not published. Check the connection and record again.",
  },
} as const;

const formatUploadedSize = (bytes = 0) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB uploaded`
    : bytes > 0
      ? `${Math.ceil(bytes / 1024)} KB uploaded`
      : "Preparing the first upload chunk";

const formatPlaybackTime = (seconds: number | null | undefined) => {
  const safeSeconds =
    typeof seconds === "number" && Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainder = safeSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export function RecordedLectures() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const [recordings, setRecordings] = useState<RecordedLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [activeRecording, setActiveRecording] = useState<RecordedLecture | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [durationIsVerified, setDurationIsVerified] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [actionId, setActionId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const loadRecordings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const result = await api.get("/api/live-classes/recordings");
    if (result.success) {
      setRecordings(result.recordings || []);
      setError("");
    } else {
      setError(result.error || "Recorded lectures could not be loaded.");
    }
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    void loadRecordings();
    if (!isAdmin && !isTeacher) return;
    const interval = window.setInterval(() => void loadRecordings(true), 10_000);
    return () => window.clearInterval(interval);
  }, [isAdmin, isTeacher, loadRecordings]);

  const selectableRecordings = useMemo(
    () => recordings.filter((recording) => recording.publicationStatus === "PUBLISHED"),
    [recordings],
  );

  const allSelected = useMemo(
    () =>
      selectableRecordings.length > 0 &&
      selectableRecordings.every((recording) => selectedIds.has(recording._id)),
    [selectableRecordings, selectedIds],
  );

  const toggleSelected = (recordingId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(recordingId)) next.delete(recordingId);
      else next.add(recordingId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      allSelected ? new Set() : new Set(selectableRecordings.map((recording) => recording._id)),
    );
  };

  const deleteRecordings = async (recordingIds: string[]) => {
    if (!recordingIds.length) return;
    const label =
      recordingIds.length === 1
        ? "this recorded lecture"
        : `${recordingIds.length} recorded lectures`;
    if (!window.confirm(`Permanently delete ${label} from SATSharks and Google Drive?`)) return;

    setError("");
    if (recordingIds.length > 1) setBulkDeleting(true);
    else setActionId(recordingIds[0]);
    const result = await api.post("/api/live-classes/recordings/bulk-delete", {
      recordingIds,
    });
    const deletedIds: string[] = result.deletedIds || [];
    if (deletedIds.length) {
      const deleted = new Set(deletedIds);
      setRecordings((current) => current.filter((recording) => !deleted.has(recording._id)));
      setSelectedIds((current) => {
        const next = new Set(current);
        deletedIds.forEach((id) => next.delete(id));
        return next;
      });
      if (activeRecording && deleted.has(activeRecording._id)) closePlayer();
    }
    if (!result.success || result.failed?.length) {
      const failedCount = result.failed?.length || recordingIds.length;
      setError(
        result.error ||
          `${failedCount} ${failedCount === 1 ? "recording" : "recordings"} could not be deleted.`,
      );
    }
    setActionId(null);
    setBulkDeleting(false);
  };

  const setStudentVisibility = async (recording: RecordedLecture, visible: boolean) => {
    setActionId(recording._id);
    setError("");
    const result = await api.put(`/api/live-classes/recordings/${recording._id}/visibility`, {
      visibleToStudents: visible,
    });
    if (result.success) {
      setRecordings((current) =>
        current.map((item) =>
          item._id === recording._id ? { ...item, visibleToStudents: visible } : item,
        ),
      );
    } else {
      setError(result.error || "The recording visibility could not be updated.");
    }
    setActionId(null);
  };

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
    const playbackDuration = Number(result.durationSeconds);
    const resolvedDuration =
      Number.isFinite(playbackDuration) && playbackDuration > 0
        ? playbackDuration
        : recording.recordingDurationSeconds;
    const resolvedRecording = {
      ...recording,
      recordingDurationSeconds: resolvedDuration,
    };
    setRecordings((current) =>
      current.map((item) => (item._id === recording._id ? resolvedRecording : item)),
    );
    setActiveRecording(resolvedRecording);
    setCurrentTime(0);
    setPlayerDuration(resolvedDuration || 0);
    setDurationIsVerified(result.durationVerified === true);
    setIsPlaying(false);
    setIsMuted(false);
    setPlaybackUrl(`${getBackendUrl()}${result.playbackUrl}`);
  };

  const closePlayer = () => {
    videoRef.current?.pause();
    setActiveRecording(null);
    setPlaybackUrl("");
    setCurrentTime(0);
    setPlayerDuration(0);
    setDurationIsVerified(false);
    setIsPlaying(false);
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play().catch(() => {});
    else video.pause();
  };

  const seekPlayback = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Math.min(Math.max(0, seconds), playerDuration);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const openFullscreen = () => {
    void playerRef.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          <Icon name="video_library" className="text-[18px]" /> Class library
        </div>
        <h1 className="text-3xl font-bold text-on-surface">Recorded Lectures</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          {isAdmin
            ? "Publish recordings to students, keep them private, or remove videos from the library and Google Drive."
            : isTeacher
              ? "Track each lecture until it is fully uploaded and published. Keep your laptop open until the status says Published."
              : "Rewatch completed live classes directly inside your SATSharks dashboard."}
        </p>
      </div>

      {isAdmin && !loading && recordings.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-on-surface">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-outline accent-primary"
            />
            {allSelected ? "Deselect all" : "Select all"}
            <span className="font-medium text-on-surface-variant">
              {selectedIds.size
                ? `${selectedIds.size} selected`
                : `${selectableRecordings.length} published recordings`}
            </span>
          </label>
          <button
            type="button"
            onClick={() => void deleteRecordings([...selectedIds])}
            disabled={!selectedIds.size || bulkDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-error px-4 py-2.5 text-xs font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon
              name={bulkDeleting ? "progress_activity" : "delete_sweep"}
              className={bulkDeleting ? "animate-spin text-lg" : "text-lg"}
            />
            {bulkDeleting ? "Deleting..." : "Delete selected"}
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm font-medium text-error"
        >
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {recordings.map((recording) => {
            const status = PUBLICATION_DETAILS[recording.publicationStatus];
            const isPublished = recording.publicationStatus === "PUBLISHED";
            return (
              <article
                key={recording._id}
                className={`rounded-xl border bg-surface p-4 shadow-sm ${
                  selectedIds.has(recording._id)
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-outline-variant/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isAdmin && isPublished && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(recording._id)}
                      onChange={() => toggleSelected(recording._id)}
                      aria-label={`Select ${recording.title}`}
                      className="mt-3 h-4 w-4 shrink-0 rounded border-outline accent-primary"
                    />
                  )}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={isPublished ? "play_circle" : status.icon} className="text-2xl" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-on-surface">
                          {recording.title}
                        </h2>
                        <p className="truncate text-xs font-semibold text-primary">
                          {recording.teacherName}
                        </p>
                      </div>
                      {(isAdmin || isTeacher) && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.badge}`}
                        >
                          {status.label}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Icon name="calendar_month" className="text-[14px]" />
                        {new Date(recording.recordedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="schedule" className="text-[14px]" />
                        {recording.recordingDurationSeconds
                          ? formatPlaybackTime(recording.recordingDurationSeconds)
                          : "Duration pending"}
                      </span>
                      {isPublished && (isAdmin || isTeacher) && (
                        <span>{recording.visibleToStudents ? "Students can view" : "Private"}</span>
                      )}
                    </div>
                  </div>
                </div>
                {(isAdmin || isTeacher) && !isPublished && (
                  <div className={`mt-3 rounded-lg border px-3 py-2 text-[11px] ${status.panel}`}>
                    <span className="font-bold">{status.label}: </span>
                    {recording.publicationStatus === "FAILED" && recording.recordingError
                      ? recording.recordingError
                      : recording.publicationStatus === "UPLOADING"
                        ? `${formatUploadedSize(recording.uploadedBytes)}. Keep the classroom and laptop open.`
                        : status.message}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void watchRecording(recording)}
                    disabled={!isPublished || openingId === recording._id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant"
                  >
                    <Icon name={isPublished ? "play_circle" : status.icon} className="text-base" />
                    {openingId === recording._id
                      ? "Opening..."
                      : isPublished
                        ? "Watch lecture"
                        : status.label}
                  </button>
                  {isAdmin && isPublished && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          void setStudentVisibility(recording, !recording.visibleToStudents)
                        }
                        disabled={actionId === recording._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/50 px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
                      >
                        <Icon
                          name={recording.visibleToStudents ? "visibility_off" : "visibility"}
                          className="text-base"
                        />
                        {recording.visibleToStudents ? "Make private" : "Show students"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteRecordings([recording._id])}
                        disabled={actionId === recording._id}
                        aria-label={`Delete ${recording.title}`}
                        title="Delete recording"
                        className="inline-flex h-8 w-9 items-center justify-center rounded-lg border border-error/30 text-error hover:bg-error/10 disabled:opacity-50"
                      >
                        <Icon
                          name={actionId === recording._id ? "progress_activity" : "delete"}
                          className={actionId === recording._id ? "animate-spin" : ""}
                        />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeRecording && playbackUrl && (
        <div
          ref={playerRef}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
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
            <div className="w-full max-w-6xl overflow-hidden rounded-xl bg-black shadow-2xl">
              <video
                ref={videoRef}
                src={playbackUrl}
                autoPlay
                playsInline
                className="max-h-[calc(100vh-10rem)] w-full bg-black"
                onClick={() => void togglePlayback()}
                onLoadedMetadata={(event) => {
                  const nativeDuration = event.currentTarget.duration;
                  if (
                    !durationIsVerified &&
                    Number.isFinite(nativeDuration) &&
                    nativeDuration > 0
                  ) {
                    setPlayerDuration(nativeDuration);
                  } else if (activeRecording.recordingDurationSeconds) {
                    setPlayerDuration(activeRecording.recordingDurationSeconds);
                  }
                }}
                onDurationChange={(event) => {
                  const nativeDuration = event.currentTarget.duration;
                  if (
                    !durationIsVerified &&
                    Number.isFinite(nativeDuration) &&
                    nativeDuration > 0
                  ) {
                    setPlayerDuration(nativeDuration);
                  }
                }}
                onTimeUpdate={(event) => {
                  const time = event.currentTarget.currentTime;
                  setCurrentTime(time);
                  if (time > playerDuration) setPlayerDuration(time);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={(event) => {
                  setIsPlaying(false);
                  const endedAt = event.currentTarget.currentTime;
                  if (endedAt > 0) {
                    setCurrentTime(endedAt);
                    setPlayerDuration((duration) =>
                      Math.abs(duration - endedAt) > 1 ? endedAt : duration,
                    );
                  }
                }}
                onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
                onError={() => setError("The recording could not be played. Please try again.")}
              >
                Your browser does not support video playback.
              </video>
              <div className="border-t border-white/10 bg-[#080b12] px-3 py-3 text-white sm:px-4">
                <input
                  type="range"
                  min="0"
                  max={Math.max(1, playerDuration)}
                  step="0.1"
                  value={Math.min(currentTime, Math.max(1, playerDuration))}
                  onChange={(event) => seekPlayback(Number(event.target.value))}
                  aria-label="Video timeline"
                  className="h-1.5 w-full cursor-pointer accent-primary"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void togglePlayback()}
                    aria-label={isPlaying ? "Pause lecture" : "Play lecture"}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Icon name={isPlaying ? "pause" : "play_arrow"} className="text-xl" />
                  </button>
                  <span className="min-w-[110px] text-xs font-bold tabular-nums sm:text-sm">
                    {formatPlaybackTime(currentTime)} / {formatPlaybackTime(playerDuration)}
                  </span>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute lecture" : "Mute lecture"}
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <Icon name={isMuted ? "volume_off" : "volume_up"} className="text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={openFullscreen}
                    aria-label="View lecture fullscreen"
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <Icon name="fullscreen" className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
