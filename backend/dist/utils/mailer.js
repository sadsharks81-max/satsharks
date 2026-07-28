"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Simple mailer configuration. In production, provide these via environment variables.
const transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER || "satsharks@gmail.com",
        pass: process.env.EMAIL_PASS || "dummy-app-password",
    },
});
const sendPasswordResetEmail = async (to, token) => {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:8080"}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER || "satsharks@gmail.com",
        to,
        subject: "Password Reset Request",
        html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3B7DD8; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
        // Even if it fails, we shouldn't crash the server. The user will be notified or it will silently fail in dev if credentials are wrong.
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
