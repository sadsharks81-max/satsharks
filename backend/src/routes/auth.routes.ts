import { Router } from "express";
import {
  register,
  login,
  resetPassword,
  confirmPasswordReset,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
  confirmResetPasswordValidator,
} from "../validators/auth.validator";
import {
  loginRateLimiter,
  passwordResetRateLimiter,
  registerRateLimiter,
} from "../middleware/rate-limit.middleware";

const router = Router();

router.post("/register", registerRateLimiter, registerValidator, validate, register);
router.post("/login", loginRateLimiter, loginValidator, validate, login);

// Step 1: request a reset link.
router.post(
  "/reset-password",
  passwordResetRateLimiter,
  resetPasswordValidator,
  validate,
  resetPassword,
);
// Alias that reads correctly from the client side. The original path above is
// retained for backward compatibility with anything already calling it.
router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  resetPasswordValidator,
  validate,
  resetPassword,
);

// Step 2: redeem the emailed token and set the new password. This step had no
// endpoint at all, so password recovery could never actually complete.
router.post(
  "/reset-password/confirm",
  passwordResetRateLimiter,
  confirmResetPasswordValidator,
  validate,
  confirmPasswordReset,
);

export default router;
