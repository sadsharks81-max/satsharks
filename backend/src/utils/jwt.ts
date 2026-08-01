import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  role: string;
  region?: string;
  subscription?: string;
  status?: string;
  sessionId?: string;
}

/**
 * Secrets come from the validated env module instead of being re-read here with
 * literal fallbacks. Reading process.env directly at import time meant that if
 * this module ever loaded before dotenv ran, every token would be signed with a
 * constant committed to source control , i.e. anyone could mint an ADMIN token.
 */
export const generateTokens = (
  userId: string,
  role: string,
  region?: string,
  subscription?: string,
  status?: string,
  sessionId?: string,
) => {
  const payload: TokenPayload = { userId, role, region, subscription, status, sessionId };

  const accessToken = jwt.sign({ ...payload, typ: "access" }, env.jwtSecret, {
    expiresIn: env.accessTokenTtl as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ ...payload, typ: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtl as jwt.SignOptions["expiresIn"],
  });

  return { accessToken, refreshToken };
};

/**
 * `typ` is asserted so a refresh token can never be replayed as an access token
 * (or vice versa) even if the two secrets are misconfigured to the same value.
 * Tokens issued before this claim existed are still accepted, so live sessions
 * survive the deploy.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload & { typ?: string };
  if (decoded.typ && decoded.typ !== "access") {
    throw new jwt.JsonWebTokenError("Invalid token type");
  }
  return decoded;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, env.jwtRefreshSecret) as TokenPayload & { typ?: string };
  if (decoded.typ && decoded.typ !== "refresh") {
    throw new jwt.JsonWebTokenError("Invalid token type");
  }
  return decoded;
};
