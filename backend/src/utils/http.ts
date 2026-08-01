import { Response } from "express";
import { env } from "../config/env";

/**
 * Error carrying a deliberate, client-safe message. Anything that is not an
 * ApiError is treated as an internal fault and its message is withheld.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const badRequest = (message: string) => new ApiError(400, message);
export const unauthorized = (message = "Unauthorized") => new ApiError(401, message);
export const forbidden = (message = "Forbidden") => new ApiError(403, message);
export const notFound = (message = "Not found") => new ApiError(404, message);

const isMongoDuplicateKey = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;

const isMongoValidationError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { name?: string }).name === "ValidationError";

const isMongoCastError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { name?: string }).name === "CastError";

/**
 * Single place where an exception becomes an HTTP response.
 *
 * Controllers previously did `res.status(500).json({ error: error.message })`
 * in 94 places, which forwarded raw driver/Mongoose messages (and therefore
 * collection names, field names, and connection details) to unauthenticated
 * clients. Internal details are now logged server-side only.
 */
export const sendError = (res: Response, error: unknown, context?: string) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ success: false, error: error.message });
  }

  if (isMongoDuplicateKey(error)) {
    return res.status(409).json({ success: false, error: "That record already exists" });
  }

  if (isMongoValidationError(error)) {
    return res.status(400).json({ success: false, error: "Some of the submitted values are invalid" });
  }

  if (isMongoCastError(error)) {
    return res.status(400).json({ success: false, error: "Malformed identifier" });
  }

  console.error(`[error]${context ? ` ${context}:` : ""}`, error);
  return res.status(500).json({
    success: false,
    error: "Something went wrong. Please try again.",
    ...(env.isProduction ? {} : { detail: error instanceof Error ? error.message : String(error) }),
  });
};
