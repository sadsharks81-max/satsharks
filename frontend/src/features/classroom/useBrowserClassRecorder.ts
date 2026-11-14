import { useCallback, useEffect, useRef, useState } from "react";
import { Track, type LocalParticipant } from "livekit-client";
import { liveClassApi, type RecordingStatus } from "../../services/liveClassApi";

// Smaller aligned blocks update the server-side progress timestamp frequently,
// so an interrupted laptop/network can be detected without waiting a long time.
const DRIVE_CHUNK_BYTES = 2 * 1024 * 1024;
const RECORDER_TIMESLICE_MS = 5_000;
const MIME_TYPES = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];

const supportedMimeType = () =>
  MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || "";

const joinBytes = (left: Uint8Array, right: Uint8Array) => {
  const joined = new Uint8Array(left.length + right.length);
  joined.set(left);
  joined.set(right, left.length);
  return joined;
};

const captureErrorMessage = (error: unknown) => {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Screen recording was cancelled or blocked. Choose Entire screen, a window, or a browser tab to record.";
  }
  if (name === "NotSupportedError" || name === "SecurityError") {
    return "Screen recording requires a supported browser over HTTPS. Use the latest Chrome or Edge.";
  }
  return error instanceof Error ? error.message : "Unable to start screen recording";
};

interface BrowserClassRecorderOptions {
  classId: string;
  localParticipant: LocalParticipant;
  onStatusChange: (status: RecordingStatus) => void;
  onError: (message: string) => void;
}

export function useBrowserClassRecorder({
  classId,
  localParticipant,
  onStatusChange,
  onError,
}: BrowserClassRecorderOptions) {
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const captureStreamRef = useRef<MediaStream | null>(null);
  const microphoneCloneRef = useRef<MediaStreamTrack | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const uploadIdRef = useRef("");
  const pendingRef = useRef(new Uint8Array());
  const offsetRef = useRef(0);
  const recordingStartedAtRef = useRef(0);
  const recordingDurationSecondsRef = useRef(0);
  const uploadQueueRef = useRef<Promise<void>>(Promise.resolve());
  const uploadErrorRef = useRef<Error | null>(null);
  const stoppingRef = useRef(false);
  const stopRef = useRef<() => Promise<boolean>>(async () => false);

  const releaseMedia = useCallback(() => {
    captureStreamRef.current?.getTracks().forEach((track) => track.stop());
    microphoneCloneRef.current?.stop();
    void audioContextRef.current?.close().catch(() => {});
    captureStreamRef.current = null;
    microphoneCloneRef.current = null;
    audioContextRef.current = null;
    recorderRef.current = null;
  }, []);

  const uploadChunk = useCallback(
    async (chunk: Uint8Array, final: boolean) => {
      const uploadId = uploadIdRef.current;
      if (!uploadId) throw new Error("Recording upload session is missing");
      const offset = offsetRef.current;
      const durationSeconds = final
        ? recordingDurationSecondsRef.current ||
          Math.max(1, Math.round((Date.now() - recordingStartedAtRef.current) / 1000))
        : undefined;
      let lastError = "Recording upload failed";

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const result = await liveClassApi.uploadRecordingChunk(
            classId,
            uploadId,
            chunk,
            offset,
            final,
            durationSeconds,
          );
          if (result.success) {
            offsetRef.current = result.nextOffset ?? offset + chunk.length;
            setUploadedBytes(offsetRef.current);
            return;
          }
          if (result.expectedOffset === offset + chunk.length) {
            offsetRef.current = result.expectedOffset;
            setUploadedBytes(offsetRef.current);
            return;
          }
          lastError = result.error || lastError;
        } catch (error) {
          lastError = error instanceof Error ? error.message : lastError;
        }
        if (attempt < 3) await new Promise((resolve) => window.setTimeout(resolve, attempt * 1000));
      }
      throw new Error(lastError);
    },
    [classId],
  );

  const consumeBlob = useCallback(
    async (blob: Blob) => {
      if (!blob.size) return;
      pendingRef.current = joinBytes(pendingRef.current, new Uint8Array(await blob.arrayBuffer()));

      // Keep the newest block locally. It must be sent with the final byte total
      // when recording stops; earlier blocks can use Drive's unknown-total form.
      while (pendingRef.current.length > DRIVE_CHUNK_BYTES) {
        const block = pendingRef.current.slice(0, DRIVE_CHUNK_BYTES);
        pendingRef.current = pendingRef.current.slice(DRIVE_CHUNK_BYTES);
        await uploadChunk(block, false);
      }
    },
    [uploadChunk],
  );

  const failUpload = useCallback(
    async (error: unknown) => {
      const message = error instanceof Error ? error.message : "Recording upload failed";
      uploadErrorRef.current = error instanceof Error ? error : new Error(message);
      onError(`${message}. Keep this classroom open and try recording again.`);
      onStatusChange("FAILED");
      const uploadId = uploadIdRef.current;
      if (uploadId) await liveClassApi.abortRecording(classId, uploadId, message).catch(() => {});
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      setActive(false);
      releaseMedia();
    },
    [classId, onError, onStatusChange, releaseMedia],
  );

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current || stoppingRef.current) return false;
    stoppingRef.current = true;
    setBusy(true);
    onStatusChange("PROCESSING");
    recordingDurationSecondsRef.current = Math.max(
      1,
      Math.round((Date.now() - recordingStartedAtRef.current) / 1000),
    );

    try {
      const recorder = recorderRef.current;
      if (recorder.state !== "inactive") {
        await new Promise<void>((resolve) => {
          recorder.addEventListener("stop", () => resolve(), { once: true });
          recorder.stop();
        });
      }
      await uploadQueueRef.current;
      if (uploadErrorRef.current) throw uploadErrorRef.current;
      if (!pendingRef.current.length)
        throw new Error("The browser did not capture any recording data");

      const finalChunk = pendingRef.current;
      pendingRef.current = new Uint8Array();
      await uploadChunk(finalChunk, true);
      onStatusChange("READY");
      setActive(false);
      return true;
    } catch (error) {
      await failUpload(error);
      setActive(false);
      return false;
    } finally {
      releaseMedia();
      setBusy(false);
      stoppingRef.current = false;
      uploadIdRef.current = "";
    }
  }, [failUpload, onStatusChange, releaseMedia, uploadChunk]);

  stopRef.current = stopRecording;

  const startRecording = useCallback(async () => {
    if (active || busy) return false;
    setBusy(true);
    onError("");
    uploadErrorRef.current = null;
    pendingRef.current = new Uint8Array();
    offsetRef.current = 0;
    recordingDurationSecondsRef.current = 0;
    setUploadedBytes(0);

    try {
      if (!navigator.mediaDevices?.getDisplayMedia || typeof MediaRecorder === "undefined") {
        throw new Error(
          "This browser does not support screen recording. Use the latest Chrome or Edge.",
        );
      }
      const mimeType = supportedMimeType();
      if (!mimeType) throw new Error("This browser cannot create a WebM class recording");

      const display = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 15, max: 30 } },
        audio: true,
      });
      captureStreamRef.current = display;

      const outputTracks: MediaStreamTrack[] = [...display.getVideoTracks()];
      const audioTracks = [...display.getAudioTracks()];
      const microphone = localParticipant.getTrackPublication(Track.Source.Microphone)?.track
        ?.mediaStreamTrack;
      if (microphone) {
        microphoneCloneRef.current = microphone.clone();
        audioTracks.push(microphoneCloneRef.current);
      }

      if (audioTracks.length) {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const destination = audioContext.createMediaStreamDestination();
        audioTracks.forEach((track) => {
          audioContext.createMediaStreamSource(new MediaStream([track])).connect(destination);
        });
        outputTracks.push(...destination.stream.getAudioTracks());
      }

      const start = await liveClassApi.startRecording(classId, mimeType);
      if (!start.success || !start.uploadId) {
        throw new Error(start.error || "Unable to create the Google Drive recording");
      }
      uploadIdRef.current = start.uploadId;

      const recorder = new MediaRecorder(new MediaStream(outputTracks), {
        mimeType,
        videoBitsPerSecond: 2_000_000,
        audioBitsPerSecond: 128_000,
      });
      recorderRef.current = recorder;
      uploadQueueRef.current = Promise.resolve();
      recorder.addEventListener("dataavailable", (event) => {
        if (uploadErrorRef.current) return;
        uploadQueueRef.current = uploadQueueRef.current
          .then(() => consumeBlob(event.data))
          .catch(failUpload);
      });
      recorder.addEventListener("error", (event) => {
        const recorderError = (event as Event & { error?: DOMException }).error;
        void failUpload(recorderError || new Error("The browser recorder stopped unexpectedly"));
      });
      display.getVideoTracks()[0]?.addEventListener(
        "ended",
        () => {
          void stopRef.current();
        },
        { once: true },
      );

      recorder.start(RECORDER_TIMESLICE_MS);
      recordingStartedAtRef.current = Date.now();
      setActive(true);
      onStatusChange("ACTIVE");
      return true;
    } catch (error) {
      const uploadId = uploadIdRef.current;
      if (uploadId) {
        await liveClassApi
          .abortRecording(classId, uploadId, "Browser recording could not start")
          .catch(() => {});
        uploadIdRef.current = "";
      }
      releaseMedia();
      onError(captureErrorMessage(error));
      onStatusChange("FAILED");
      return false;
    } finally {
      setBusy(false);
    }
  }, [
    active,
    busy,
    classId,
    consumeBlob,
    failUpload,
    localParticipant,
    onError,
    onStatusChange,
    releaseMedia,
  ]);

  useEffect(() => {
    if (!active) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [active]);

  useEffect(
    () => () => {
      captureStreamRef.current?.getTracks().forEach((track) => track.stop());
      microphoneCloneRef.current?.stop();
    },
    [],
  );

  return { active, busy, uploadedBytes, startRecording, stopRecording };
}
