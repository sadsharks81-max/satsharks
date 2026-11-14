import { google } from "googleapis";
import { env } from "../config/env";
import BrowserRecordingUpload from "../models/BrowserRecordingUpload";
import LiveClass from "../models/LiveClass";
import {
  createDriveResumableUpload,
  getAuthorizedGoogleClient,
  GoogleDriveNotConfiguredError,
  GoogleDriveNotConnectedError,
  uploadDriveChunk,
} from "./google-drive.service";
import { decryptSecret, encryptSecret } from "../utils/secret-box";

export class ClassRecordingNotConfiguredError extends Error {
  constructor(message?: string) {
    super(
      message ||
        "Class recording is not ready. Configure Google Drive in Railway and connect it from Admin Settings.",
    );
    this.name = "ClassRecordingNotConfiguredError";
  }
}

const safeFilePart = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "class";

const recordingFilename = (liveClass: InstanceType<typeof LiveClass>) => {
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  return `${safeFilePart(liveClass.title)}-${date}.webm`;
};

const asConfigurationError = (error: unknown) => {
  if (
    error instanceof GoogleDriveNotConfiguredError ||
    error instanceof GoogleDriveNotConnectedError
  ) {
    return new ClassRecordingNotConfiguredError(error.message);
  }
  return error;
};

export const beginBrowserClassRecording = async (
  liveClass: InstanceType<typeof LiveClass>,
  userId: string,
  mimeType: string,
) => {
  if (!env.isGoogleDriveOAuthConfigured)
    throw new ClassRecordingNotConfiguredError();
  if (!mimeType.toLowerCase().startsWith("video/webm")) {
    throw new Error(
      "This browser did not provide a supported WebM recording format",
    );
  }
  if (
    ["STARTING", "ACTIVE", "PROCESSING"].includes(liveClass.recordingStatus)
  ) {
    const existing = await BrowserRecordingUpload.findOne({
      liveClass: liveClass._id,
      status: "ACTIVE",
    }).select("_id");
    if (existing)
      throw new Error(
        "This class is already being recorded in another browser",
      );
  }
  if (liveClass.recordingStatus === "READY") {
    throw new Error("This class already has a completed recording");
  }

  liveClass.recordingStatus = "STARTING";
  liveClass.recordingError = null;
  liveClass.recordingDriveFileId = null;
  liveClass.recordingDriveUrl = null;
  liveClass.recordingStartedAt = new Date();
  liveClass.recordingEndedAt = null;
  await liveClass.save();

  try {
    const filename = recordingFilename(liveClass);
    const uploadUrl = await createDriveResumableUpload(filename, mimeType);
    const upload = await BrowserRecordingUpload.create({
      liveClass: liveClass._id,
      createdBy: userId,
      encryptedUploadUrl: encryptSecret(uploadUrl),
      filename,
      mimeType,
      nextOffset: 0,
      status: "ACTIVE",
    });

    liveClass.recordingStatus = "ACTIVE";
    liveClass.recordingError = null;
    await liveClass.save();
    return upload;
  } catch (error) {
    liveClass.recordingStatus = "FAILED";
    liveClass.recordingError =
      error instanceof Error
        ? error.message.slice(0, 500)
        : "Unable to start Drive upload";
    await liveClass.save();
    throw asConfigurationError(error);
  }
};

export const appendBrowserRecordingChunk = async ({
  uploadId,
  liveClassId,
  body,
  offset,
  final,
}: {
  uploadId: string;
  liveClassId: string;
  body: Buffer;
  offset: number;
  final: boolean;
}) => {
  const upload = await BrowserRecordingUpload.findOne({
    _id: uploadId,
    liveClass: liveClassId,
  }).select("+encryptedUploadUrl");
  if (!upload) throw new Error("Recording upload session not found");

  if (upload.status === "READY") {
    return {
      complete: true,
      nextOffset: upload.nextOffset,
      fileId: upload.driveFileId || undefined,
    };
  }
  if (upload.status !== "ACTIVE")
    throw new Error("Recording upload is no longer active");
  if (offset < upload.nextOffset && offset + body.length <= upload.nextOffset) {
    return {
      complete: false,
      nextOffset: upload.nextOffset,
      alreadyAccepted: true,
    };
  }
  if (offset !== upload.nextOffset) {
    const error = new Error(
      `Recording upload expected byte ${upload.nextOffset}`,
    ) as Error & {
      expectedOffset?: number;
    };
    error.expectedOffset = upload.nextOffset;
    throw error;
  }
  if (body.length === 0) throw new Error("Recording chunk is empty");

  try {
    const result = await uploadDriveChunk(
      decryptSecret(upload.encryptedUploadUrl),
      body,
      offset,
      final,
    );
    upload.nextOffset = result.nextOffset;

    if (final) {
      if (!result.complete || !result.fileId) {
        throw new Error("Google Drive did not finalize the recording");
      }
      upload.status = "READY";
      upload.driveFileId = result.fileId;
      await upload.save();
      await LiveClass.updateOne(
        { _id: liveClassId },
        {
          recordingStatus: "READY",
          recordingDriveFileId: result.fileId,
          recordingDriveUrl:
            result.webViewLink ||
            `https://drive.google.com/file/d/${result.fileId}/view`,
          recordingError: null,
          recordingEndedAt: new Date(),
        },
      );
    } else {
      await upload.save();
    }
    return result;
  } catch (error) {
    upload.error =
      error instanceof Error
        ? error.message.slice(0, 500)
        : "Drive upload failed";
    await upload.save();
    throw asConfigurationError(error);
  }
};

export const failBrowserClassRecording = async (
  uploadId: string,
  liveClassId: string,
  reason: string,
) => {
  const message =
    reason.slice(0, 500) || "Recording stopped before the upload completed";
  await BrowserRecordingUpload.updateOne(
    { _id: uploadId, liveClass: liveClassId, status: "ACTIVE" },
    { status: "FAILED", error: message },
  );
  await LiveClass.updateOne(
    {
      _id: liveClassId,
      recordingStatus: { $in: ["STARTING", "ACTIVE", "PROCESSING"] },
    },
    {
      recordingStatus: "FAILED",
      recordingError: message,
      recordingEndedAt: new Date(),
    },
  );
};

export const getDriveRecordingStream = async (
  fileId: string,
  range?: string,
) => {
  try {
    const drive = google.drive({
      version: "v3",
      auth: await getAuthorizedGoogleClient(),
    });
    return drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      {
        responseType: "stream",
        ...(range ? { headers: { Range: range } } : {}),
      },
    );
  } catch (error) {
    throw asConfigurationError(error);
  }
};
