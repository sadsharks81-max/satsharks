import rateLimit, { ipKeyGenerator, type Options } from "express-rate-limit";
import { env } from "../config/env";

/**
 * There was previously no rate limiting anywhere on the API. That left
 * /api/auth/login open to unlimited credential stuffing, /api/auth/reset-password
 * usable as an email flood, and /api/payment/create-checkout (unauthenticated)
 * usable to spam Stripe session creation.
 */
const baseOptions: Partial<Options> = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Limits are a safety net for abuse, not something to trip during local work.
  skip: () => !env.isProduction && process.env.ENABLE_RATE_LIMIT !== "true",
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many requests. Please wait a moment and try again.",
    });
  },
};

/**
 * Keyed on IP + submitted email so one attacker cannot lock every user out of
 * login by exhausting a shared IP budget, while still bounding guesses per
 * account. `ipKeyGenerator` normalises IPv6 (a /56 can otherwise supply
 * effectively unlimited distinct addresses).
 */
const credentialKey = (req: { ip?: string; body?: unknown }) => {
  const ip = ipKeyGenerator(req.ip ?? "");
  const body = req.body as { email?: unknown } | undefined;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  return `${ip}:${email}`;
};

export const loginRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: credentialKey,
  skipSuccessfulRequests: true,
});

export const registerRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: 10,
});

/** Password reset both emails a third party and does bcrypt work, so keep it tight. */
export const passwordResetRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  keyGenerator: credentialKey,
});

/** Unauthenticated write endpoints reachable by the public (contact, checkout). */
export const publicWriteRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 20,
});

/** Broad backstop for the whole API surface. */
export const apiRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  limit: 300,
});
