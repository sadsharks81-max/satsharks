import { Router } from "express";
import { submitInquiry, getInquiries, updateInquiryStatus } from "../controllers/contact.controller";
import { validate } from "../middleware/validate.middleware";
import { inquiryValidator } from "../validators/contact.validator";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { publicWriteRateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

// Unauthenticated write reachable by anyone, so it is rate limited to stop the
// inquiry table (and the notification emails it triggers) being flooded.
router.post(
  "/inquiry",
  publicWriteRateLimiter,
  optionalAuthenticate,
  inquiryValidator,
  validate,
  submitInquiry,
);
router.get("/", authenticate, requireAdmin(), getInquiries);
router.put("/:id/status", authenticate, requireAdmin(), updateInquiryStatus);

export default router;
