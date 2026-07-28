import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createCheckoutSession } from "../controllers/payment.controller";
import {
  uploadPaymentProof,
  getPaymentProofs,
  approvePaymentProof,
  rejectPaymentProof
} from "../controllers/payment-proof.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

// Multer setup for payment proof screenshots
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.resolve(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `proof-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, JPEG, WEBP, and GIF images are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

// Stripe checkouts
router.post("/create-checkout", optionalAuthenticate, createCheckoutSession);

// Manual payment proof routes (Students)
router.post("/upload-proof", authenticate, upload.single("screenshot"), uploadPaymentProof);

// Admin manual payment verification routes
router.get("/proofs", authenticate, requireAdmin(), getPaymentProofs);
router.put("/proofs/:id/approve", authenticate, requireAdmin(), approvePaymentProof);
router.put("/proofs/:id/reject", authenticate, requireAdmin(), rejectPaymentProof);

export default router;
