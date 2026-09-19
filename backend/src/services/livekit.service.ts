import { AccessToken, RoomServiceClient, ServerError, WebhookReceiver, VideoGrant, TrackType, TrackSource } from "livekit-server-sdk";
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

const MODERATOR_CAPACITY_BUFFER = 5;
const ROOM_ENSURE_CACHE_MS = 60_000;
const ensuredRooms = new Map<string, number>();
const pendingRoomCreates = new Map<string, Promise<void>>();

interface IssueTokenParams {
  roomName: string;
  identity: string;
  name: string;
  role: string;
  ttlSeconds: number;
  grant: Pick<VideoGrant, "canPublish" | "canPublishSources" | "canSubscribe" | "canUpdateOwnMetadata">;
}

/**
 * Issues a short-lived LiveKit access token scoped to a single room.
 * The API secret never leaves the server - only the resulting JWT is returned.
 */
export const issueRoomToken = async ({ roomName, identity, name, role, ttlSeconds, grant }: IssueTokenParams): Promise<string> => {
  assertConfigured();
  const at = new AccessToken(env.livekitApiKey, env.livekitApiSecret, {
    identity,
    name,
    ttl: ttlSeconds,
    metadata: JSON.stringify({ role }),
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
  if ((ensuredRooms.get(roomName) ?? 0) > Date.now()) return;

  const pending = pendingRoomCreates.get(roomName);
  if (pending) return pending;

  const client = getRoomServiceClient();
  const create = client.createRoom({
    name: roomName,
    // maxStudents describes students, not the teacher/admin seats required to
    // run and moderate the class.
    maxParticipants: maxParticipants + MODERATOR_CAPACITY_BUFFER,
    // Room created ahead of class may remain empty while participants arrive.
    emptyTimeout: 10 * 60,
    // Preserve the room through a brief whole-class network interruption.
    departureTimeout: 5 * 60,
  }).then(() => {
    ensuredRooms.set(roomName, Date.now() + ROOM_ENSURE_CACHE_MS);
  }).finally(() => {
    pendingRoomCreates.delete(roomName);
  });
  pendingRoomCreates.set(roomName, create);
  return create;
};

export const deleteRoomIfExists = async (roomName: string): Promise<void> => {
  ensuredRooms.delete(roomName);
  const client = getRoomServiceClient();
  try {
    await client.deleteRoom(roomName);
  } catch (error) {
    // Room may already be gone (e.g. auto-cleaned by emptyTimeout) - not a failure case.
    console.warn(`[LiveKit] deleteRoom(${roomName}) failed (likely already gone):`, (error as Error).message);
  }
};

export const countStudentParticipants = (participants: Array<{ identity: string; metadata?: string }>, teacherId: string) =>
  participants.filter((participant) => {
    try {
      const role = JSON.parse(participant.metadata || "{}")?.role;
      if (role === "TEACHER" || role === "ADMIN") return false;
      if (role === "STUDENT") return true;
    } catch {
      // Fall through for legacy participants that joined before role metadata.
    }
    return participant.identity !== teacherId;
  }).length;

export const listRoomParticipants = async (roomName: string) => {
  const client = getRoomServiceClient();
  try {
    return await client.listParticipants(roomName);
  } catch (error) {
    // Room not created yet (e.g. class hasn't started) - treat as empty.
    if (error instanceof ServerError && error.code === "not_found") return [];
    console.error(`[LiveKit] Unable to list participants for room ${roomName}:`, {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown LiveKit service error",
    });
    throw error;
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

export { LiveKitNotConfiguredError, TrackSource };
