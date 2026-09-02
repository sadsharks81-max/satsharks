import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type TokenPayload } from "../utils/jwt";
import User from "../models/User";
import { env } from "../config/env";
import { requireAdmin } from "./role.middleware";

export interface AuthUser extends TokenPayload {
  userId: string;
  role: string;
  email?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
};

type LiveUserRecord = {
  email: string;
  role: string;
  status: string;
  subscription: string;
  region: string;
  sessionId?: string | null;
};

const LIVE_USER_CACHE_TTL_MS = 5_000;
const LIVE_USER_CACHE_MAX_ENTRIES = 5_000;
const liveUserCache = new Map<
  string,
  { expiresAt: number; promise: Promise<LiveUserRecord | null> }
>();

/**
 * Coalesce the parallel user lookup issued by pages that load several API
 * resources together. The very short TTL preserves near-real-time suspension,
 * role and single-device checks while removing duplicate MongoDB work.
 */
const getLiveUserRecord = async (
  userId: string,
  sessionId?: string,
): Promise<LiveUserRecord | null> => {
  const now = Date.now();
  // A fresh student login gets a new session id and must bypass any record
  // cached for the previous device/session immediately.
  const cacheKey = `${userId}:${sessionId || "no-session"}`;
  const cached = liveUserCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.promise;
  if (cached) liveUserCache.delete(cacheKey);

  const promise = User.findById(userId)
    .select("email role status subscription region +sessionId")
    .lean<LiveUserRecord | null>()
    .exec();

  liveUserCache.set(cacheKey, { expiresAt: now + LIVE_USER_CACHE_TTL_MS, promise });

  // Keep the per-process cache bounded even if many distinct users arrive.
  if (liveUserCache.size > LIVE_USER_CACHE_MAX_ENTRIES) {
    const oldestKey = liveUserCache.keys().next().value;
    if (oldestKey) liveUserCache.delete(oldestKey);
  }

  try {
    return await promise;
  } catch (error) {
    liveUserCache.delete(cacheKey);
    throw error;
  }
};

/**
 * Resolves the caller against current database state.
 *
 * Access tokens live for days, so the `role`, `status`, and `subscription` baked
 * into a token go stale: a suspended, demoted, or downgraded account previously
 * kept its old privileges until the token expired, because every authorization
 * middleware read those claims. Authoritative values are re-read from the user
 * record and overwrite the claims before any authorization check sees them.
 *
 * The projection is narrow and lean so this per-request lookup stays cheap , it
 * previously loaded the entire user document on every authenticated call.
 */
const resolveLiveUser = async (decoded: TokenPayload) => {
  const user = await getLiveUserRecord(decoded.userId, decoded.sessionId);

  if (!user) return { error: "User not found" as const };

  // Single-device login, enforced for students only (unchanged behaviour).
  if (
    decoded.sessionId &&
    user.role === "STUDENT" &&
    user.sessionId &&
    user.sessionId !== decoded.sessionId
  ) {
    return { error: "Session expired: logged in from another device" as const };
  }

  return {
    error: undefined,
    user: {
      ...decoded,
      email: user.email,
      role: user.role,
      status: user.status,
      subscription: user.subscription,
      region: user.region,
    } as AuthUser,
  };
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  let decoded: TokenPayload;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  if (!decoded.userId) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  // Mock mode (no database configured) keeps working off token claims alone.
  if (!env.isDatabaseConfigured) {
    req.user = decoded as AuthUser;
    return next();
  }

  try {
    const resolved = await resolveLiveUser(decoded);
    if (resolved.error) {
      return res.status(401).json({ success: false, error: resolved.error });
    }
    req.user = resolved.user;
    next();
  } catch (error) {
    // A database blip must not read as a valid session, nor as a bad token.
    console.error("[error] auth.authenticate:", error);
    res.status(503).json({ success: false, error: "Authentication temporarily unavailable" });
  }
};

/**
 * Attaches the user when a valid token is present, otherwise continues
 * anonymously. Never fails the request , public endpoints rely on that to
 * personalise their response when a caller happens to be logged in.
 */
export const optionalAuthenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) return next();

  let decoded: TokenPayload;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return next();
  }

  if (!decoded.userId) return next();

  if (!env.isDatabaseConfigured) {
    req.user = decoded as AuthUser;
    return next();
  }

  try {
    const resolved = await resolveLiveUser(decoded);
    if (!resolved.error) req.user = resolved.user;
  } catch (error) {
    console.error("[error] auth.optionalAuthenticate:", error);
  }
  next();
};

/**
 * Kept as a named export because report.routes and university.routes already
 * import it. It now delegates to role.middleware's requireAdmin() instead of
 * being a second, independently maintained copy of the same rule , the two
 * copies could drift and leave one route family enforcing a weaker check.
 */
export const isAdmin = requireAdmin();
