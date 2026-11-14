import { google } from "googleapis";
import { env } from "../config/env";
import GoogleDriveCredential from "../models/GoogleDriveCredential";
import { decryptSecret, encryptSecret } from "../utils/secret-box";

const DRIVE_FILE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export class GoogleDriveNotConfiguredError extends Error {
  constructor() {
    super(
      "Google Drive is not configured. Add the Drive client ID, client secret, folder ID, and redirect URI in Railway.",
    );
    this.name = "GoogleDriveNotConfiguredError";
  }
}

export class GoogleDriveNotConnectedError extends Error {
  constructor() {
    super("Google Drive has not been connected by an administrator yet.");
    this.name = "GoogleDriveNotConnectedError";
  }
}

const assertConfigured = () => {
  if (!env.isGoogleDriveOAuthConfigured)
    throw new GoogleDriveNotConfiguredError();
};

export const createGoogleOAuthClient = () => {
  assertConfigured();
  return new google.auth.OAuth2(
    env.googleDriveClientId,
    env.googleDriveClientSecret,
    env.googleDriveRedirectUri,
  );
};

export const buildGoogleDriveAuthorizationUrl = (state: string) => {
  const client = createGoogleOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: [DRIVE_FILE_SCOPE],
    state,
  });
};

export const storeGoogleDriveAuthorization = async (
  code: string,
  connectedBy: string,
) => {
  const client = createGoogleOAuthClient();
  const { tokens } = await client.getToken(code);
  let refreshToken = tokens.refresh_token || "";

  if (!refreshToken) {
    const existing = await GoogleDriveCredential.findOne({
      provider: "GOOGLE_DRIVE",
    })
      .select("+encryptedRefreshToken")
      .lean();
    if (existing?.encryptedRefreshToken) {
      refreshToken = decryptSecret(existing.encryptedRefreshToken);
    }
  }

  if (!refreshToken) {
    throw new Error(
      "Google did not return offline access. Remove SAT Sharks from the Google account's connected apps, then connect again.",
    );
  }

  await GoogleDriveCredential.findOneAndUpdate(
    { provider: "GOOGLE_DRIVE" },
    {
      provider: "GOOGLE_DRIVE",
      encryptedRefreshToken: encryptSecret(refreshToken),
      connectedBy,
      connectedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return tokens;
};

let cachedClient: ReturnType<typeof createGoogleOAuthClient> | null = null;
let cachedEncryptedToken = "";

export const getAuthorizedGoogleClient = async () => {
  assertConfigured();
  const credential = await GoogleDriveCredential.findOne({
    provider: "GOOGLE_DRIVE",
  })
    .select("+encryptedRefreshToken")
    .lean();
  if (!credential?.encryptedRefreshToken)
    throw new GoogleDriveNotConnectedError();

  if (
    !cachedClient ||
    cachedEncryptedToken !== credential.encryptedRefreshToken
  ) {
    cachedClient = createGoogleOAuthClient();
    cachedClient.setCredentials({
      refresh_token: decryptSecret(credential.encryptedRefreshToken),
    });
    cachedEncryptedToken = credential.encryptedRefreshToken;
  }
  return cachedClient;
};

export const getGoogleDriveConnectionStatus = async () => {
  const credential = await GoogleDriveCredential.findOne({
    provider: "GOOGLE_DRIVE",
  })
    .select("connectedAt connectedBy")
    .populate("connectedBy", "name email")
    .lean();
  return {
    configured: env.isGoogleDriveOAuthConfigured,
    connected: Boolean(credential),
    folderId: env.googleDriveFolderId || null,
    connectedAt: credential?.connectedAt || null,
    connectedBy: credential?.connectedBy || null,
  };
};

export const disconnectGoogleDrive = async () => {
  const credential = await GoogleDriveCredential.findOne({
    provider: "GOOGLE_DRIVE",
  })
    .select("+encryptedRefreshToken")
    .lean();
  if (credential?.encryptedRefreshToken && env.isGoogleDriveOAuthConfigured) {
    try {
      const client = createGoogleOAuthClient();
      await client.revokeToken(decryptSecret(credential.encryptedRefreshToken));
    } catch (error) {
      console.warn(
        "[Google Drive] Token revocation failed; removing local authorization",
        {
          message:
            error instanceof Error ? error.message : "Unknown revocation error",
        },
      );
    }
  }
  await GoogleDriveCredential.deleteMany({ provider: "GOOGLE_DRIVE" });
  cachedClient = null;
  cachedEncryptedToken = "";
};

const accessToken = async () => {
  const client = await getAuthorizedGoogleClient();
  const result = await client.getAccessToken();
  if (!result.token) throw new GoogleDriveNotConnectedError();
  return result.token;
};

const driveError = async (response: globalThis.Response, fallback: string) => {
  const body = await response.text().catch(() => "");
  console.error("[Google Drive] API request failed", {
    status: response.status,
    body: body.slice(0, 1000),
  });
  return new Error(`${fallback} (Google Drive returned ${response.status})`);
};

export const createDriveResumableUpload = async (
  name: string,
  mimeType: string,
) => {
  assertConfigured();
  const token = await accessToken();
  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
      },
      body: JSON.stringify({
        name,
        mimeType,
        parents: [env.googleDriveFolderId],
      }),
    },
  );
  if (!response.ok)
    throw await driveError(response, "Unable to start the Drive upload");
  const uploadUrl = response.headers.get("location");
  if (!uploadUrl)
    throw new Error("Google Drive did not return a resumable upload URL");
  return uploadUrl;
};

type UploadResult = {
  complete: boolean;
  nextOffset: number;
  fileId?: string;
  webViewLink?: string;
};

const acceptedOffset = (range: string | null) => {
  const end = range?.match(/bytes=0-(\d+)/i)?.[1];
  return end ? Number(end) + 1 : 0;
};

const uploadRequest = async (
  uploadUrl: string,
  body: Buffer,
  offset: number,
  final: boolean,
): Promise<UploadResult> => {
  const total = offset + body.length;
  const token = await accessToken();
  const response = await fetch(uploadUrl, {
    method: "PUT",
    redirect: "manual",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Length": String(body.length),
      "Content-Range": `bytes ${offset}-${total - 1}/${final ? total : "*"}`,
    },
    body: body as unknown as BodyInit,
  });

  if (response.status === 308) {
    return {
      complete: false,
      nextOffset: Math.max(
        total,
        acceptedOffset(response.headers.get("range")),
      ),
    };
  }
  if (response.ok) {
    const file = (await response.json()) as {
      id?: string;
      webViewLink?: string;
    };
    if (!file.id)
      throw new Error(
        "Google Drive completed the upload without returning a file ID",
      );
    return {
      complete: true,
      nextOffset: total,
      fileId: file.id,
      webViewLink: file.webViewLink,
    };
  }
  throw await driveError(response, "Unable to upload the recording chunk");
};

const queryUpload = async (
  uploadUrl: string,
  knownTotal?: number,
): Promise<UploadResult> => {
  const token = await accessToken();
  const response = await fetch(uploadUrl, {
    method: "PUT",
    redirect: "manual",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Length": "0",
      "Content-Range": `bytes */${knownTotal ?? "*"}`,
    },
  });
  if (response.status === 308) {
    return {
      complete: false,
      nextOffset: acceptedOffset(response.headers.get("range")),
    };
  }
  if (response.ok) {
    const file = (await response.json()) as {
      id?: string;
      webViewLink?: string;
    };
    return {
      complete: true,
      nextOffset: knownTotal || 0,
      fileId: file.id,
      webViewLink: file.webViewLink,
    };
  }
  throw await driveError(response, "Unable to check the Drive upload");
};

export const uploadDriveChunk = async (
  uploadUrl: string,
  body: Buffer,
  offset: number,
  final: boolean,
) => {
  try {
    return await uploadRequest(uploadUrl, body, offset, final);
  } catch (error) {
    // If Railway lost the response after Google accepted a chunk, querying the
    // resumable session prevents the browser from uploading the same bytes twice.
    const status = await queryUpload(
      uploadUrl,
      final ? offset + body.length : undefined,
    ).catch(() => null);
    if (
      status &&
      (status.complete || status.nextOffset >= offset + body.length)
    )
      return status;
    throw error;
  }
};

export const googleDriveClientForPlayback = getAuthorizedGoogleClient;

export const deleteDriveRecordingFile = async (fileId: string) => {
  const drive = google.drive({
    version: "v3",
    auth: await getAuthorizedGoogleClient(),
  });
  try {
    await drive.files.delete({ fileId, supportsAllDrives: true });
  } catch (error) {
    const status =
      (error as { code?: number; response?: { status?: number } }).code ||
      (error as { response?: { status?: number } }).response?.status;
    // If somebody already removed the file in Drive, SATSharks should still
    // be able to clear its stale recording entry.
    if (status !== 404) throw error;
  }
};
