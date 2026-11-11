import { Readable } from "stream";
import { google } from "googleapis";
import {
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  GCPUpload,
} from "livekit-server-sdk";
import { env } from "../config/env";
import LiveClass from "../models/LiveClass";

export class ClassRecordingNotConfiguredError extends Error {
  constructor() {
    super(
      "Class recording is not configured. Set the Google service account, GCS staging bucket, and Drive folder environment variables.",
    );
    this.name = "ClassRecordingNotConfiguredError";
  }
}

const serviceAccountCredentials = () => ({
  client_email: env.googleServiceAccountEmail,
  private_key: env.googleServiceAccountPrivateKey,
});

const liveKitHttpUrl = () => env.livekitUrl.replace(/^wss:/, "https:").replace(/^ws:/, "http:");

const safeFilePart = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "class";

const getEgressClient = () => {
  if (!env.isClassRecordingConfigured) throw new ClassRecordingNotConfiguredError();
  return new EgressClient(liveKitHttpUrl(), env.livekitApiKey, env.livekitApiSecret);
};

export const startClassRecording = async (liveClass: InstanceType<typeof LiveClass>) => {
  if (!env.isClassRecordingConfigured) throw new ClassRecordingNotConfiguredError();
  if (["STARTING", "ACTIVE", "PROCESSING"].includes(liveClass.recordingStatus)) {
    return liveClass;
  }

  // Claim the recording atomically. Teacher and admin browsers can both observe
  // the SCHEDULED -> LIVE transition, and without this guard they could launch
  // two billable egress jobs for the same room.
  const claimedClass = await LiveClass.findOneAndUpdate(
    {
      _id: liveClass._id,
      $or: [
        { recordingStatus: { $in: ["NONE", "FAILED"] } },
        { recordingStatus: { $exists: false } },
      ],
    },
    {
      recordingStatus: "STARTING",
      recordingError: null,
      recordingDriveFileId: null,
      recordingDriveUrl: null,
      recordingEgressId: null,
    },
    { new: true },
  );
  if (!claimedClass) return (await LiveClass.findById(liveClass._id)) || liveClass;

  try {
    const gcp = new GCPUpload({
      bucket: env.recordingGcpBucket,
      credentials: JSON.stringify(serviceAccountCredentials()),
    });
    const output = new EncodedFileOutput({
      fileType: EncodedFileType.MP4,
      filepath: `sat-sharks/${safeFilePart(claimedClass.title)}-${claimedClass._id.toString()}-{time}.mp4`,
      disableManifest: true,
      output: { case: "gcp", value: gcp },
    });
    const info = await getEgressClient().startRoomCompositeEgress(
      claimedClass.roomName,
      { file: output },
      { layout: "speaker" },
    );

    claimedClass.recordingEgressId = info.egressId;
    claimedClass.recordingStatus = "ACTIVE";
    claimedClass.recordingStartedAt = new Date();
    await claimedClass.save();
    return claimedClass;
  } catch (error) {
    claimedClass.recordingStatus = "FAILED";
    claimedClass.recordingError =
      error instanceof Error ? error.message.slice(0, 500) : "Unable to start recording";
    await claimedClass.save();
    throw error;
  }
};

export const stopClassRecording = async (liveClass: InstanceType<typeof LiveClass>) => {
  if (!liveClass.recordingEgressId || !["STARTING", "ACTIVE"].includes(liveClass.recordingStatus)) {
    return liveClass;
  }

  const claimedClass = await LiveClass.findOneAndUpdate(
    { _id: liveClass._id, recordingStatus: "ACTIVE", recordingEgressId: liveClass.recordingEgressId },
    { recordingStatus: "PROCESSING", recordingEndedAt: new Date() },
    { new: true },
  );
  if (!claimedClass) return (await LiveClass.findById(liveClass._id)) || liveClass;

  try {
    await getEgressClient().stopEgress(claimedClass.recordingEgressId!);
    return claimedClass;
  } catch (error) {
    claimedClass.recordingStatus = "ACTIVE";
    claimedClass.recordingError =
      error instanceof Error ? error.message.slice(0, 500) : "Unable to stop recording";
    await claimedClass.save();
    throw error;
  }
};

const googleAuth = () =>
  new google.auth.GoogleAuth({
    credentials: serviceAccountCredentials(),
    scopes: [
      "https://www.googleapis.com/auth/devstorage.read_write",
      "https://www.googleapis.com/auth/drive",
    ],
  });

export const getDriveRecordingStream = async (fileId: string, range?: string) => {
  if (!env.isClassRecordingConfigured) throw new ClassRecordingNotConfiguredError();
  const drive = google.drive({ version: "v3", auth: googleAuth() });
  return drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    {
      responseType: "stream",
      ...(range ? { headers: { Range: range } } : {}),
    },
  );
};

const gcsObjectName = (filename: string, location: string) => {
  if (location.startsWith("gs://")) {
    const withoutScheme = location.slice(5);
    return withoutScheme.slice(withoutScheme.indexOf("/") + 1);
  }
  return filename.replace(/^\//, "");
};

/**
 * Move a completed LiveKit egress file from its required GCS staging bucket to
 * the configured Drive folder. This is called after the egress_ended webhook.
 */
export const transferRecordingToDrive = async (
  roomName: string,
  file: { filename: string; location: string },
) => {
  const liveClass = await LiveClass.findOne({ roomName });
  if (!liveClass) return;

  liveClass.recordingStatus = "PROCESSING";
  liveClass.recordingEndedAt ||= new Date();
  await liveClass.save();

  try {
    const auth = googleAuth();
    const storage = google.storage({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });
    const object = gcsObjectName(file.filename, file.location);
    const download = await storage.objects.get(
      { bucket: env.recordingGcpBucket, object, alt: "media" },
      { responseType: "stream" },
    );
    const name = object.split("/").pop() || `${safeFilePart(liveClass.title)}.mp4`;
    const upload = await drive.files.create({
      supportsAllDrives: true,
      requestBody: { name, parents: [env.recordingDriveFolderId] },
      media: {
        mimeType: "video/mp4",
        body: download.data as unknown as Readable,
      },
      fields: "id,webViewLink",
    });

    liveClass.recordingStatus = "READY";
    liveClass.recordingDriveFileId = upload.data.id || null;
    liveClass.recordingDriveUrl =
      upload.data.webViewLink ||
      (upload.data.id ? `https://drive.google.com/file/d/${upload.data.id}/view` : null);
    liveClass.recordingError = null;
    await liveClass.save();

    await storage.objects.delete({ bucket: env.recordingGcpBucket, object }).catch((error) => {
      console.warn("[Recording] Drive upload succeeded but GCS cleanup failed", {
        roomName,
        object,
        message: error instanceof Error ? error.message : "Unknown cleanup error",
      });
    });
  } catch (error) {
    liveClass.recordingStatus = "FAILED";
    liveClass.recordingError =
      error instanceof Error ? error.message.slice(0, 500) : "Unable to transfer recording to Drive";
    await liveClass.save();
    console.error("[Recording] Drive transfer failed", {
      roomName,
      message: liveClass.recordingError,
    });
  }
};
