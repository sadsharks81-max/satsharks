import mongoose from "mongoose";

/**
 * Express parses `?role[$ne]=x` into `{ role: { $ne: "x" } }`. Assigning such a
 * value straight into a Mongoose filter lets a caller inject query operators ,
 * bypassing `status: "PUBLISHED"` guards, enumerating other users, and so on.
 * Coercing to a primitive string removes the operator object entirely.
 */
export const asFilterString = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  // Arrays (?a=1&a=2) and operator objects are rejected rather than coerced.
  return undefined;
};

/** Same as asFilterString but constrained to a known set of values. */
export const asEnumValue = <T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | undefined => {
  const raw = asFilterString(value);
  return raw && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined;
};

export const asObjectId = (value: unknown): string | undefined => {
  const raw = asFilterString(value);
  return raw && mongoose.Types.ObjectId.isValid(raw) ? raw : undefined;
};

/**
 * Escapes regex metacharacters so a search term cannot become a pattern.
 * `search=(a+)+$` against an unindexed field is a catastrophic-backtracking DoS,
 * and `search=.*` silently defeats any intended narrowing.
 */
export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Bounded, regex-safe substring matcher for user supplied search boxes. */
export const buildSearchFilter = (value: unknown, maxLength = 100) => {
  const raw = asFilterString(value);
  if (!raw) return undefined;
  return { $regex: escapeRegex(raw.slice(0, maxLength)), $options: "i" };
};

export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Clamped pagination. `parseInt(undefined)` is NaN, and an unbounded `limit`
 * lets a single request ask for the whole collection.
 */
export const getPagination = (
  query: Record<string, unknown>,
  defaultLimit = 20,
  maxLimit = 100,
): Pagination => {
  const parsedPage = Number.parseInt(asFilterString(query.page) ?? "", 10);
  const parsedLimit = Number.parseInt(asFilterString(query.limit) ?? "", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0
    ? Math.min(maxLimit, parsedLimit)
    : defaultLimit;
  return { page, limit, skip: (page - 1) * limit };
};
