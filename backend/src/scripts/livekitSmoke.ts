import { TokenVerifier } from "livekit-server-sdk";
import { env } from "../config/env";
import {
  TrackSource,
  deleteRoomIfExists,
  ensureRoomExists,
  issueRoomToken,
  listRoomParticipants,
} from "../services/livekit.service";

const roomName = `sat-sharks-smoke-${Date.now()}`;
const roles = ["STUDENT", "TEACHER", "ADMIN"] as const;

const fail = (message: string): never => {
  throw new Error(message);
};

const run = async () => {
  if (!env.isLiveKitConfigured) fail("LiveKit environment variables are not configured");

  const verifier = new TokenVerifier(env.livekitApiKey, env.livekitApiSecret);
  const identities = new Set<string>();
  const summaries: Array<Record<string, unknown>> = [];

  try {
    await ensureRoomExists(roomName, 40);
    const participants = await listRoomParticipants(roomName);
    if (participants.length !== 0) fail("Ephemeral smoke-test room was not empty");

    for (const role of roles) {
      const identity = `smoke_${role.toLowerCase()}_${Date.now()}_${identities.size}`;
      identities.add(identity);
      const canPublishSources =
        role === "STUDENT"
          ? [TrackSource.CAMERA, TrackSource.MICROPHONE]
          : [
              TrackSource.CAMERA,
              TrackSource.MICROPHONE,
              TrackSource.SCREEN_SHARE,
              TrackSource.SCREEN_SHARE_AUDIO,
            ];

      const token = await issueRoomToken({
        roomName,
        identity,
        name: `Smoke ${role}`,
        role,
        ttlSeconds: 30 * 60,
        grant: {
          canPublish: true,
          canPublishSources,
          canSubscribe: true,
          canUpdateOwnMetadata: true,
        },
      });
      const claims = await verifier.verify(token);
      const video = claims.video;
      const encodedSources = video?.canPublishSources as unknown as string[] | undefined;
      const expectedSources =
        role === "STUDENT"
          ? ["camera", "microphone"]
          : ["camera", "microphone", "screen_share", "screen_share_audio"];
      const ttl = Number(claims.exp) - Math.floor(Date.now() / 1_000);

      if (claims.sub !== identity) fail(`${role} token identity mismatch`);
      if (video?.room !== roomName || video.roomJoin !== true) fail(`${role} token room mismatch`);
      if (video.canPublish !== true || video.canSubscribe !== true || video.canPublishData !== true) {
        fail(`${role} token media permissions mismatch`);
      }
      if (video.canUpdateOwnMetadata !== true || video.roomAdmin === true) {
        fail(`${role} token metadata/admin permissions mismatch`);
      }
      if (JSON.stringify(encodedSources) !== JSON.stringify(expectedSources)) {
        fail(`${role} token publish-source permissions mismatch`);
      }
      if (!Number.isFinite(ttl) || ttl < 1_790 || ttl > 1_810) {
        fail(`${role} token TTL mismatch`);
      }
      if (JSON.parse(String(claims.metadata || "{}")).role !== role) {
        fail(`${role} token metadata mismatch`);
      }

      summaries.push({
        role,
        roomScoped: true,
        publishSources: expectedSources,
        ttlSeconds: ttl,
      });
    }

    if (identities.size !== roles.length) fail("Participant identities were not unique");
    console.info(
      JSON.stringify({
        roomService: "ok",
        roomInitiallyEmpty: true,
        uniqueIdentities: identities.size,
        tokens: summaries,
      }),
    );
  } finally {
    await deleteRoomIfExists(roomName);
  }
};

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : "LiveKit smoke test failed");
  process.exitCode = 1;
});
