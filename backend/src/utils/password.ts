import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Single source of truth for password hashing. Every write path that persists a
 * password must go through here , storing a raw string leaves a plaintext
 * credential in the database and also makes the account impossible to log into,
 * because bcrypt.compare() can never match a non-hash.
 */
export const BCRYPT_ROUNDS = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, BCRYPT_ROUNDS);

export const verifyPassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

/**
 * Cryptographically strong placeholder password for accounts created on the
 * user's behalf (e.g. Stripe guest checkout). Math.random() is not a CSPRNG and
 * must never be used for anything credential shaped.
 */
export const generateRandomPassword = () =>
  `${crypto.randomBytes(24).toString("base64url")}Aa1!`;

/**
 * Password reset tokens are bearer credentials. The raw value goes to the user's
 * inbox; only its SHA-256 digest is persisted, so a database read (backup, log,
 * over-broad admin projection) cannot be replayed to take over an account.
 */
export const generateResetToken = () => {
  const raw = crypto.randomBytes(32).toString("hex");
  return { raw, hash: hashResetToken(raw) };
};

export const hashResetToken = (raw: string) =>
  crypto.createHash("sha256").update(raw).digest("hex");
