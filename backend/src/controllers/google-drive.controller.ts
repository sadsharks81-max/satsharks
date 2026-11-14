import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import {
  buildGoogleDriveAuthorizationUrl,
  disconnectGoogleDrive,
  getGoogleDriveConnectionStatus,
  GoogleDriveNotConfiguredError,
  storeGoogleDriveAuthorization,
} from "../services/google-drive.service";

type DriveOAuthState = {
  typ: "google-drive-oauth";
  userId: string;
};

const settingsRedirect = (result: "connected" | "error", reason?: string) => {
  const url = new URL("/admin/settings", env.frontendUrl);
  url.searchParams.set("drive", result);
  if (reason) url.searchParams.set("reason", reason.slice(0, 120));
  return url.toString();
};

export const getGoogleDriveStatus = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    res.json({ success: true, ...(await getGoogleDriveConnectionStatus()) });
  } catch (error) {
    console.error("[Google Drive] Unable to read connection status", error);
    res
      .status(500)
      .json({ success: false, error: "Unable to read Google Drive status" });
  }
};

export const startGoogleDriveConnection = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const state = jwt.sign(
      {
        typ: "google-drive-oauth",
        userId: req.user.userId,
      } satisfies DriveOAuthState,
      env.jwtSecret,
      { expiresIn: "10m" },
    );
    res.json({
      success: true,
      authorizationUrl: buildGoogleDriveAuthorizationUrl(state),
    });
  } catch (error) {
    const message =
      error instanceof GoogleDriveNotConfiguredError
        ? error.message
        : "Unable to start Google Drive authorization";
    res
      .status(error instanceof GoogleDriveNotConfiguredError ? 503 : 500)
      .json({
        success: false,
        error: message,
      });
  }
};

export const completeGoogleDriveConnection = async (
  req: AuthRequest,
  res: Response,
) => {
  const code = typeof req.query.code === "string" ? req.query.code : "";
  const stateValue = typeof req.query.state === "string" ? req.query.state : "";
  const oauthError = typeof req.query.error === "string" ? req.query.error : "";
  if (oauthError)
    return res.redirect(
      settingsRedirect("error", "Google authorization was cancelled"),
    );
  if (!code || !stateValue)
    return res.redirect(
      settingsRedirect("error", "Missing authorization response"),
    );

  try {
    const state = jwt.verify(stateValue, env.jwtSecret) as DriveOAuthState;
    if (state.typ !== "google-drive-oauth" || !state.userId)
      throw new Error("Invalid OAuth state");
    const admin = await User.findOne({
      _id: state.userId,
      role: "ADMIN",
      status: "ACTIVE",
    }).select("_id");
    if (!admin)
      throw new Error("The administrator account is no longer authorized");
    await storeGoogleDriveAuthorization(code, state.userId);
    res.redirect(settingsRedirect("connected"));
  } catch (error) {
    console.error("[Google Drive] OAuth callback failed", {
      message: error instanceof Error ? error.message : "Unknown OAuth error",
    });
    res.redirect(
      settingsRedirect(
        "error",
        error instanceof Error
          ? error.message
          : "Google Drive connection failed",
      ),
    );
  }
};

export const removeGoogleDriveConnection = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    await disconnectGoogleDrive();
    res.json({ success: true });
  } catch (error) {
    console.error("[Google Drive] Disconnect failed", error);
    res
      .status(500)
      .json({ success: false, error: "Unable to disconnect Google Drive" });
  }
};
