import express from "express";
import { env } from "../config/env";

/**
 * LiveKit signs the exact bytes sent in the webhook request. This parser must
 * run before express.json() and must match LiveKit's application/webhook+json
 * media type so the controller receives those bytes as a Buffer.
 */
export const liveKitWebhookBodyParser = express.raw({
  type: "application/webhook+json",
  limit: env.jsonBodyLimit,
});
