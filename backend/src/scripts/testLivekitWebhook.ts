import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import express from "express";
import { AccessToken } from "livekit-server-sdk";
import { env } from "../config/env";
import { liveKitWebhook } from "../controllers/live-class.controller";
import { liveKitWebhookBodyParser } from "../middleware/livekit-webhook.middleware";

const closeServer = (server: ReturnType<ReturnType<typeof express>["listen"]>) =>
  new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

const main = async () => {
  assert.equal(env.isLiveKitConfigured, true, "LiveKit environment variables are required");

  const app = express();
  app.post("/api/live-classes/webhook", liveKitWebhookBodyParser, liveKitWebhook);
  app.use(express.json());
  app.post("/api/json-check", (req, res) => {
    res.json({ isBuffer: Buffer.isBuffer(req.body), body: req.body });
  });

  const server = app.listen(0, "127.0.0.1");

  try {
    await new Promise<void>((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });

    const address = server.address();
    assert(address && typeof address === "object", "Test server did not bind to a TCP port");
    const origin = `http://127.0.0.1:${address.port}`;

    // Intentional whitespace makes this fail if middleware parses and re-serializes the JSON.
    const rawBody = '{\n  "event": "room_started"\n}\n';
    const token = new AccessToken(env.livekitApiKey, env.livekitApiSecret);
    token.sha256 = createHash("sha256").update(rawBody).digest("base64");
    const authorization = await token.toJwt();

    const validResponse = await fetch(`${origin}/api/live-classes/webhook`, {
      method: "POST",
      headers: {
        authorization,
        "content-type": "application/webhook+json",
      },
      body: rawBody,
    });
    assert.equal(validResponse.status, 200, await validResponse.text());

    const tamperedResponse = await fetch(`${origin}/api/live-classes/webhook`, {
      method: "POST",
      headers: {
        authorization,
        "content-type": "application/webhook+json",
      },
      body: `${rawBody} `,
    });
    assert.equal(tamperedResponse.status, 400, "A modified signed body must be rejected");

    const jsonResponse = await fetch(`${origin}/api/json-check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: 42 }),
    });
    assert.equal(jsonResponse.status, 200);
    assert.deepEqual(await jsonResponse.json(), {
      isBuffer: false,
      body: { value: 42 },
    });

    console.log("LiveKit webhook raw-body and ordinary JSON parsing checks passed");
  } finally {
    await closeServer(server);
  }
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
