"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const payment_controller_1 = require("../controllers/payment.controller");
const payment_proof_controller_1 = require("../controllers/payment-proof.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
// Multer setup for payment proof screenshots
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path_1.default.resolve(__dirname, "../../uploads");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `proof-${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only PNG, JPG, JPEG, WEBP, and GIF images are allowed"));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
const router = (0, express_1.Router)();
// Stripe checkouts
router.post("/create-checkout", auth_middleware_1.optionalAuthenticate, payment_controller_1.createCheckoutSession);
// Manual payment proof routes (Students)
router.post("/upload-proof", auth_middleware_1.authenticate, upload.single("screenshot"), payment_proof_controller_1.uploadPaymentProof);
// Admin manual payment verification routes
router.get("/proofs", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), payment_proof_controller_1.getPaymentProofs);
router.put("/proofs/:id/approve", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), payment_proof_controller_1.approvePaymentProof);
router.put("/proofs/:id/reject", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), payment_proof_controller_1.rejectPaymentProof);
exports.default = router;
