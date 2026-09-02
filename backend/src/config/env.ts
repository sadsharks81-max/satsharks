import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const requiredInProduction = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"] as const;

for (const key of requiredInProduction) {
  if (isProduction && !process.env[key]) {
    throw new Error(`${key} is required in production`);
  }
}

/**
 * Development fallbacks are generated per process instead of being hardcoded.
 * A literal default secret in source is a token-forging key for anyone who can
 * read the repo, and it silently becomes the real secret the moment an
 * environment is misconfigured. Randomising per boot keeps local dev working
 * while making a missing secret obvious (tokens stop verifying on restart).
 */
const developmentSecret = () => crypto.randomBytes(32).toString("hex");

const jwtSecret = process.env.JWT_SECRET || developmentSecret();
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || developmentSecret();
const databaseUrl = (process.env.DATABASE_URL || "").trim();

if (isProduction && jwtSecret === jwtRefreshSecret) {
  throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be different values");
}

const parsePositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Additional allowed browser origins, comma separated. Preview deployments are
 * opt-in through this list rather than matched by a wildcard pattern, because a
 * wildcard over a shared hosting domain can be claimed by an attacker.
 */
const extraCorsOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const env = {
  nodeEnv,
  isProduction,
  port: parsePositiveInt(process.env.PORT, 5000),
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, ""),
  databaseUrl,
  jwtSecret,
  jwtRefreshSecret,
  // Kept at the previous 7d default so existing sessions and the current
  // (refresh-less) frontend flow keep working; tune via env once a refresh
  // endpoint is wired into the client.
  accessTokenTtl: process.env.JWT_ACCESS_TTL || "7d",
  refreshTokenTtl: process.env.JWT_REFRESH_TTL || "30d",
  isDatabaseConfigured: Boolean(databaseUrl),
  // Mock auth mints tokens without verifying credentials, so it can never be
  // switchable on in production regardless of how the env var is set.
  allowMockAuth: !isProduction && process.env.ALLOW_MOCK_AUTH === "true",
  extraCorsOrigins,
  // Kept large enough for existing records that may still contain legacy base64
  // images. New uploads use Cloudinary or GridFS and return a short URL.
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || "16mb",
  // Nothing in the app posts large urlencoded forms.
  urlencodedBodyLimit: process.env.URLENCODED_BODY_LIMIT || "1mb",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  payproClientId: process.env.PAYPRO_CLIENT_ID || "",
  payproSecretKey: process.env.PAYPRO_SECRET_KEY || "",
  livekitUrl: process.env.LIVEKIT_URL || "",
  livekitApiKey: process.env.LIVEKIT_API_KEY || "",
  livekitApiSecret: process.env.LIVEKIT_API_SECRET || "",
  isLiveKitConfigured: Boolean(
    process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET,
  ),
};
