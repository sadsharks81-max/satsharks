import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import { generateTokens } from "../utils/jwt";
import { sendPasswordResetEmail } from "../utils/mailer";
import { sendError } from "../utils/http";
import {
  generateResetToken,
  hashPassword,
  hashResetToken,
  verifyPassword,
} from "../utils/password";

const normalizeEmail = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

/**
 * Shape returned to the client on register/login. An explicit allowlist , never
 * spread a Mongoose document, which would carry password/sessionId/resetToken
 * along with any field added to the schema later.
 */
const toAuthUser = (user: {
  id?: string;
  name: string;
  email: string;
  role: string;
  country: string;
  region: string;
  subscription: string;
  status: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  country: user.country,
  region: user.region,
  subscription: user.subscription,
  status: user.status,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    // `country` is validated as non-empty upstream, but a non-string body value
    // (e.g. an array) would still crash on .toLowerCase().
    const country = typeof req.body.country === "string" ? req.body.country : "";

    const region = country.toLowerCase() === "pakistan" ? "LOCAL" : "INTERNATIONAL";
    const subscription = "FREE";
    const status = "ACTIVE";

    if (!process.env.DATABASE_URL) {
      // Mock mode
      const tokens = generateTokens("mock-id", "STUDENT", region, subscription, status);
      return res.status(201).json({
        success: true,
        user: {
          id: "mock-id",
          name,
          email,
          role: "STUDENT",
          country,
          region,
          subscription,
          status,
        },
        ...tokens,
      });
    }

    const existingUser = await User.findOne({ email }).select("_id").lean();
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);
    const sessionId = crypto.randomUUID();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      country,
      region,
      subscription,
      status,
      sessionId,
    });

    const tokens = generateTokens(
      user.id,
      user.role,
      user.region,
      user.subscription,
      user.status,
      sessionId,
    );
    res.status(201).json({ success: true, user: toAuthUser(user), ...tokens });
  } catch (error) {
    sendError(res, error, "auth.register");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!process.env.DATABASE_URL) {
      // Mock mode
      const mockRole = email.includes("admin") ? "ADMIN" : "STUDENT";
      const mockRegion = email.includes("international")
        ? "INTERNATIONAL"
        : "LOCAL";
      const mockSubscription = email.includes("paid") ? "PAID" : "FREE";
      const mockCountry = mockRegion === "LOCAL" ? "Pakistan" : "USA";
      const tokens = generateTokens(
        "mock-id",
        mockRole,
        mockRegion,
        mockSubscription,
        "ACTIVE",
      );
      return res
        .status(200)
        .json({
          success: true,
          user: {
            id: "mock-id",
            name: email.split("@")[0],
            email,
            role: mockRole,
            country: mockCountry,
            region: mockRegion,
            subscription: mockSubscription,
            status: "ACTIVE",
          },
          ...tokens,
        });
    }

    // `password` is select:false on the schema, so it must be requested explicitly.
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        error: "Your account is suspended. Please contact support.",
      });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const sessionId = crypto.randomUUID();
    // Targeted update instead of user.save(): saving a doc loaded with
    // +password would re-run validators over the whole document and rewrite
    // fields this request never intended to touch.
    await User.updateOne({ _id: user._id }, { $set: { sessionId } });

    const tokens = generateTokens(
      user.id,
      user.role,
      user.region,
      user.subscription,
      user.status,
      sessionId,
    );
    res.status(200).json({ success: true, user: toAuthUser(user), ...tokens });
  } catch (error) {
    sendError(res, error, "auth.login");
  }
};

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
// Identical response whether or not the address exists, so the endpoint cannot
// be used to enumerate registered users.
const RESET_REQUEST_MESSAGE = "Reset instructions sent if email exists";

/**
 * Step 1 of password recovery: issue a single-use token and email it.
 *
 * Only the token's SHA-256 digest is stored. Previously the raw token was
 * persisted, so any read of the user document (backup, log, or the admin user
 * list, which returned every non-password field) could be replayed to seize the
 * account.
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email }).select("_id email");

    if (!user) {
      return res.status(200).json({ success: true, message: RESET_REQUEST_MESSAGE });
    }

    const { raw, hash } = generateResetToken();
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken: hash, resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS) } },
    );

    await sendPasswordResetEmail(user.email, raw);

    res.status(200).json({ success: true, message: RESET_REQUEST_MESSAGE });
  } catch (error) {
    sendError(res, error, "auth.resetPassword");
  }
};

/**
 * Step 2 of password recovery, which previously did not exist: the frontend page
 * only simulated success, so a locked-out user could never actually recover an
 * account. Consumes the token, sets the new hash, and invalidates the token plus
 * any active session.
 */
export const confirmPasswordReset = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (typeof token !== "string" || !token) {
      return res.status(400).json({ success: false, error: "Reset token is required" });
    }

    const user = await User.findOne({
      resetToken: hashResetToken(token),
      resetTokenExpiry: { $gt: new Date() },
    }).select("_id");

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: await hashPassword(password) },
        // Clearing sessionId logs out every existing device, which is the point
        // of a reset: whoever held the old password loses access.
        $unset: { resetToken: "", resetTokenExpiry: "", sessionId: "" },
      },
    );

    res.status(200).json({
      success: true,
      message: "Your password has been updated. Please log in.",
    });
  } catch (error) {
    sendError(res, error, "auth.confirmPasswordReset");
  }
};
