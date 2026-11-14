import { useCallback, useEffect, useMemo, useState } from "react";
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recordings.map((recording) => {
            const status = PUBLICATION_DETAILS[recording.publicationStatus];
            const isPublished = recording.publicationStatus === "PUBLISHED";
            return (
              <article
                key={recording._id}
                className={`overflow-hidden rounded-2xl border bg-surface shadow-sm transition-transform hover:-translate-y-0.5 ${
                  selectedIds.has(recording._id)
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-outline-variant/40"
                }`}
              >
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 via-surface-container-high to-accent/15">
                  {isAdmin && isPublished && (
                    <label className="absolute left-3 top-3 flex cursor-pointer items-center rounded-lg bg-surface/95 p-2 shadow-sm">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(recording._id)}
                        onChange={() => toggleSelected(recording._id)}
                        aria-label={`Select ${recording.title}`}
                        className="h-4 w-4 rounded border-outline accent-primary"
                      />
                    </label>
                  )}
                  <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${status.badge}`}
                    >
                      {status.label}
                    </span>
                    {isPublished && (isAdmin || isTeacher) && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${
                          recording.visibleToStudents
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-800 text-white"
                        }`}
                      >
                        {recording.visibleToStudents ? "Students can view" : "Private"}
                      </span>
                    )}
                  </div>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                    <Icon
                      name={isPublished ? "play_arrow" : status.icon}
                      className={`text-4xl ${
                        recording.publicationStatus === "PUBLISHING" ? "animate-spin" : ""
                      }`}
                    />
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
                  <div className={`mt-4 rounded-xl border px-3 py-2.5 text-xs ${status.panel}`}>
                    <p className="flex items-center gap-2 font-bold">
                      <Icon name={status.icon} className="text-base" />
                      {status.label}
                      {recording.publicationStatus === "UPLOADING" && (
                        <span className="ml-auto font-medium">
                          {formatUploadedSize(recording.uploadedBytes)}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 leading-5">
                      {recording.publicationStatus === "FAILED" && recording.recordingError
                        ? recording.recordingError
                        : status.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void watchRecording(recording)}
                    disabled={!isPublished || openingId === recording._id}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-on-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:opacity-70"
                  >
                    <Icon
                      name={isPublished ? "play_circle" : status.icon}
                      className="text-[18px]"
                    />
                    {openingId === recording._id
                      ? "Opening..."
                      : isPublished
                        ? "Watch lecture"
                        : status.label}
                  </button>
                  {isAdmin && isPublished && (
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void setStudentVisibility(recording, !recording.visibleToStudents)
                        }
                        disabled={actionId === recording._id}
                        className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant/50 px-3 py-2.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-50"
                      >
                        <Icon
                          name={recording.visibleToStudents ? "visibility_off" : "visibility"}
                          className="text-[17px]"
                        />
                        {recording.visibleToStudents ? "Make private" : "Show to students"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteRecordings([recording._id])}
                        disabled={actionId === recording._id}
                        aria-label={`Delete ${recording.title}`}
                        title="Delete recording"
                        className="flex w-11 items-center justify-center rounded-xl border border-error/30 text-error transition-colors hover:bg-error/10 disabled:opacity-50"
                      >
                        <Icon
                          name={actionId === recording._id ? "progress_activity" : "delete"}
                          className={
                            actionId === recording._id ? "animate-spin text-lg" : "text-lg"
                          }
                        />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeRecording && playbackUrl && (
        <div
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
