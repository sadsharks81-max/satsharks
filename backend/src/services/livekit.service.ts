import { AccessToken, RoomServiceClient, WebhookReceiver, VideoGrant, TrackType } from "livekit-server-sdk";
import { env } from "../config/env";

// Grace window kept in sync with JOIN_BUFFER_MINUTES on the frontend (dashboard/live-classes.tsx)
// and the server-side window check in live-class.controller.ts.
export const JOIN_BUFFER_MINUTES = 10;

class LiveKitNotConfiguredError extends Error {
  constructor() {
    super("Live classroom is not configured. Please contact support.");
    this.name = "LiveKitNotConfiguredError";
  }
}

let roomServiceClient: RoomServiceClient | null = null;
let webhookReceiver: WebhookReceiver | null = null;

const assertConfigured = () => {
  if (!env.isLiveKitConfigured) {
    throw new LiveKitNotConfiguredError();
  }
};

const getRoomServiceClient = (): RoomServiceClient => {
  assertConfigured();
  if (!roomServiceClient) {
    roomServiceClient = new RoomServiceClient(env.livekitUrl, env.livekitApiKey, env.livekitApiSecret);
  }
  return roomServiceClient;
};

const getWebhookReceiver = (): WebhookReceiver => {
  assertConfigured();
  if (!webhookReceiver) {
    webhookReceiver = new WebhookReceiver(env.livekitApiKey, env.livekitApiSecret);
  }
  return webhookReceiver;
};

interface IssueTokenParams {
  roomName: string;
  identity: string;
  name: string;
  ttlSeconds: number;
  grant: Pick<VideoGrant, "roomAdmin" | "canPublish" | "canSubscribe" | "canUpdateOwnMetadata">;
}

/**
 * Issues a short-lived LiveKit access token scoped to a single room.
 * The API secret never leaves the server - only the resulting JWT is returned.
 */
export const issueRoomToken = async ({ roomName, identity, name, ttlSeconds, grant }: IssueTokenParams): Promise<string> => {
  assertConfigured();
  const at = new AccessToken(env.livekitApiKey, env.livekitApiSecret, {
    identity,
    name,
    ttl: ttlSeconds,
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublishData: true,
    ...grant,
  });
  return at.toJwt();
};

/**
 * Idempotently ensures a LiveKit room exists (e.g. when a teacher starts class).
 * Explicit creation lets us set maxParticipants as a hard capacity backstop.
 */
export const ensureRoomExists = async (roomName: string, maxParticipants: number): Promise<void> => {
  const client = getRoomServiceClient();
  await client.createRoom({
    name: roomName,
    maxParticipants,
    // Auto-clean an empty room after 10 minutes so a forgotten "Start Class" doesn't linger.
    emptyTimeout: 10 * 60,
  });
};

export const deleteRoomIfExists = async (roomName: string): Promise<void> => {
  const client = getRoomServiceClient();
  try {
    await client.deleteRoom(roomName);
  } catch (error) {
    // Room may already be gone (e.g. auto-cleaned by emptyTimeout) - not a failure case.
    console.warn(`[LiveKit] deleteRoom(${roomName}) failed (likely already gone):`, (error as Error).message);
  }
};

export const listRoomParticipants = async (roomName: string) => {
  const client = getRoomServiceClient();
  try {
    return await client.listParticipants(roomName);
  } catch (error) {
    // Room not created yet (e.g. class hasn't started) - treat as empty.
    return [];
  }
};

export const removeRoomParticipant = async (roomName: string, identity: string): Promise<void> => {
  const client = getRoomServiceClient();
  await client.removeParticipant(roomName, identity);
};

export const muteRoomParticipant = async (roomName: string, identity: string, muted: boolean): Promise<void> => {
  const client = getRoomServiceClient();
  const participant = await client.getParticipant(roomName, identity);
  const audioTrack = participant.tracks.find((track) => track.type === TrackType.AUDIO);
  if (!audioTrack) return;
  await client.mutePublishedTrack(roomName, identity, audioTrack.sid, muted);
};

export const verifyWebhookEvent = async (body: string, authHeader: string) => {
  const receiver = getWebhookReceiver();
  return receiver.receive(body, authHeader);
};

export { LiveKitNotConfiguredError };
