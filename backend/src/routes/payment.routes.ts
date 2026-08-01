import { Router } from "express";
import { createCheckoutSession } from "../controllers/payment.controller";
import {
  uploadPaymentProof,
  getPaymentProofs,
  approvePaymentProof,
  rejectPaymentProof
} from "../controllers/payment-proof.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { paymentProofUpload as upload } from "../middleware/upload.middleware";
import { publicWriteRateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

// Stripe checkouts. Rate limited because this endpoint is reachable without
// authentication and each call creates a live Stripe Checkout Session.
router.post("/create-checkout", publicWriteRateLimiter, optionalAuthenticate, createCheckoutSession);

// Manual payment proof routes (Students)
router.post("/upload-proof", authenticate, upload.single("screenshot"), uploadPaymentProof);

// Admin manual payment verification routes
router.get("/proofs", authenticate, requireAdmin(), getPaymentProofs);
router.put("/proofs/:id/approve", authenticate, requireAdmin(), approvePaymentProof);
router.put("/proofs/:id/reject", authenticate, requireAdmin(), rejectPaymentProof);

export default router;
