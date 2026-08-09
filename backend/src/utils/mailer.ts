import nodemailer from "nodemailer";
import { env } from "../config/env";

/**
 * Mail transport.
 *
 * Credentials are no longer defaulted to a real-looking address plus
 * "dummy-app-password": that combination made a misconfigured deployment look
 * configured, and every send failed silently. `isMailerConfigured` makes the
 * unconfigured state explicit so callers and logs can distinguish "not set up"
 * from "send failed".
 */
export const isMailerConfigured = Boolean(
  (process.env.EMAIL_USER && process.env.EMAIL_PASS) || process.env.RESEND_API_KEY
);

const transporter = isMailerConfigured
  ? (process.env.RESEND_API_KEY
      ? nodemailer.createTransport({
          host: "smtp.resend.com",
          port: 465,
          secure: true,
          auth: {
            user: "resend",
            pass: process.env.RESEND_API_KEY,
          },
        })
      : nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }))
  : null;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

export const sendPasswordResetEmail = async (to: string, token: string) => {
  // Uses the same FRONTEND_URL that env.ts validates, rather than a second
  // independent default (this file used to fall back to :8080 while env.ts used
  // :5173, so reset links pointed at the wrong dev origin).
  const resetLink = `${env.frontendUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const safeLink = escapeHtml(resetLink);

  if (!transporter) {
    console.warn(
      "[warn] mailer not configured (EMAIL_USER/EMAIL_PASS and RESEND_API_KEY unset); password reset email not sent",
    );
    if (!env.isProduction) console.warn(`[dev] password reset link for ${to}: ${resetLink}`);
    return false;
  }

  const fromAddress =
    process.env.EMAIL_FROM ||
    (process.env.RESEND_API_KEY ? "noreply@satsharks.org" : process.env.EMAIL_USER);

  const mailOptions = {
    from: fromAddress,
    to,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${safeLink}" style="display: inline-block; padding: 10px 20px; background-color: #3B7DD8; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link expires in one hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
    return true;
  } catch (error) {
    // Swallowed deliberately: the caller must return an identical response
    // whether or not the address exists, so a send failure cannot become an
    // account-enumeration signal. Logged loudly for operators.
    console.error("[error] mailer.sendPasswordResetEmail:", error);
    return false;
  }
};
