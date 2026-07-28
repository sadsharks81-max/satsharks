import { Router } from "express";
import { submitInquiry, getInquiries, updateInquiryStatus } from "../controllers/contact.controller";
import { validate } from "../middleware/validate.middleware";
import { inquiryValidator } from "../validators/contact.validator";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.post("/inquiry", optionalAuthenticate, inquiryValidator, validate, submitInquiry);
router.get("/", authenticate, requireAdmin(), getInquiries);
router.put("/:id/status", authenticate, requireAdmin(), updateInquiryStatus);

export default router;
