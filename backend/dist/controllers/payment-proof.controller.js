"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectPaymentProof = exports.approvePaymentProof = exports.getPaymentProofs = exports.uploadPaymentProof = void 0;
const PaymentProof_1 = __importDefault(require("../models/PaymentProof"));
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
const env_1 = require("../config/env");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Submit a new manual payment proof (Student)
const uploadPaymentProof = async (req, res) => {
    try {
        const { planId, planName, amount, paymentMethod } = req.body;
        const file = req.file;
        if (!planId || !planName || !amount || !paymentMethod) {
            return res.status(400).json({ success: false, error: "All fields (planId, planName, amount, paymentMethod) are required." });
        }
        if (!file) {
            return res.status(400).json({ success: false, error: "Payment proof screenshot is required." });
        }
        const screenshotUrl = `/uploads/${file.filename}`;
        if (req.user?.role === "ADMIN") {
            const filePath = path_1.default.resolve(__dirname, "../../uploads", file.filename);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
            return res.status(403).json({ success: false, error: "Administrators cannot submit payment proofs." });
        }
        if (!env_1.env.isDatabaseConfigured) {
            console.log(`[MOCK MODE] Received manual payment proof for plan ${planName} (${amount}) via ${paymentMethod}. File: ${file.filename}`);
            return res.status(201).json({
                success: true,
                message: "Payment proof submitted successfully (mock mode).",
                proof: {
                    _id: "mock_proof_id_" + Date.now(),
                    user: req.user?.userId || "mock_user_id",
                    planId,
                    planName,
                    amount,
                    paymentMethod,
                    screenshotUrl,
                    status: "PENDING",
                    createdAt: new Date(),
                }
            });
        }
        const userId = req.user?.userId;
        const userExists = await User_1.default.findById(userId);
        if (!userExists) {
            // Clean up uploaded file if user not found
            const filePath = path_1.default.resolve(__dirname, "../../uploads", file.filename);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
            return res.status(404).json({ success: false, error: "User not found." });
        }
        if (userExists.role === "ADMIN") {
            const filePath = path_1.default.resolve(__dirname, "../../uploads", file.filename);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
            return res.status(403).json({ success: false, error: "Administrators cannot submit payment proofs." });
        }
        const newProof = await PaymentProof_1.default.create({
            user: userId,
            planId,
            planName,
            amount,
            paymentMethod,
            screenshotUrl,
            status: "PENDING"
        });
        return res.status(201).json({
            success: true,
            message: "Payment proof submitted successfully.",
            proof: newProof
        });
    }
    catch (error) {
        console.error("Upload Payment Proof Error:", error);
        // Cleanup uploaded file if error occurs
        if (req.file) {
            const filePath = path_1.default.resolve(__dirname, "../../uploads", req.file.filename);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        return res.status(500).json({ success: false, error: error.message || "Server Error" });
    }
};
exports.uploadPaymentProof = uploadPaymentProof;
// Retrieve all pending payment proofs (Admin)
const getPaymentProofs = async (req, res) => {
    try {
        if (!env_1.env.isDatabaseConfigured) {
            return res.status(200).json({
                success: true,
                proofs: [
                    {
                        _id: "mock_proof_1",
                        user: { name: "John Doe", email: "john@example.com" },
                        planId: "group",
                        planName: "Group Sessions",
                        amount: "Rs 40,000",
                        paymentMethod: "BANK",
                        screenshotUrl: "/uploads/mock-screenshot.png",
                        status: "PENDING",
                        createdAt: new Date(Date.now() - 3600000),
                    },
                    {
                        _id: "mock_proof_2",
                        user: { name: "Jane Smith", email: "jane@example.com" },
                        planId: "oneOnOne",
                        planName: "1-on-1 Sessions",
                        amount: "Rs 100,000",
                        paymentMethod: "EASYPAISA",
                        screenshotUrl: "/uploads/mock-screenshot.png",
                        status: "PENDING",
                        createdAt: new Date(Date.now() - 7200000),
                    }
                ]
            });
        }
        const proofs = await PaymentProof_1.default.find({ status: "PENDING" })
            .populate("user", "name email")
            .sort({ createdAt: 1 });
        return res.status(200).json({ success: true, proofs });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message || "Server Error" });
    }
};
exports.getPaymentProofs = getPaymentProofs;
// Helper function to delete payment proof screenshot file from filesystem
const deleteScreenshotFile = (screenshotUrl) => {
    try {
        const filename = path_1.default.basename(screenshotUrl);
        const filePath = path_1.default.resolve(__dirname, "../../uploads", filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log(`Successfully deleted payment proof file: ${filename}`);
        }
        else {
            console.warn(`File not found for deletion: ${filePath}`);
        }
    }
    catch (error) {
        console.error("Error unlinking screenshot file:", error);
    }
};
// Approve manual payment proof, upgrade student, and delete proof/screenshot (Admin)
const approvePaymentProof = async (req, res) => {
    try {
        const { id } = req.params;
        if (!env_1.env.isDatabaseConfigured) {
            console.log(`[MOCK MODE] Approved manual payment proof ID: ${id}`);
            return res.status(200).json({ success: true, message: "Payment proof approved (mock mode)." });
        }
        const proof = await PaymentProof_1.default.findById(id);
        if (!proof) {
            return res.status(404).json({ success: false, error: "Payment proof not found." });
        }
        // Set expiry based on plan duration
        const expiry = new Date();
        if (proof.planId.toLowerCase().includes("oneonone")) {
            expiry.setMonth(expiry.getMonth() + 1); // 1 month for 1-on-1
        }
        else {
            expiry.setMonth(expiry.getMonth() + 6); // 6 months for course (Group)
        }
        // Upgrade student user
        await User_1.default.findByIdAndUpdate(proof.user, {
            subscription: "PAID",
            subscriptionPlan: proof.planName,
            subscriptionExpiry: expiry,
        });
        console.log(`Upgraded user ${proof.user} to PAID status for plan ${proof.planName}.`);
        // Create approval notification
        await Notification_1.default.create({
            user: proof.user,
            type: "PAYMENT_SUCCESS",
            title: "Subscription Approved!",
            message: `Your payment proof has been verified and your subscription is now upgraded to ${proof.planName} (PAID). Thank you!`,
            isRead: false
        });
        // Clean up filesystem space: delete the uploaded screenshot file
        deleteScreenshotFile(proof.screenshotUrl);
        // Clean up database space: delete the PaymentProof document
        await PaymentProof_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Payment proof approved. User upgraded and proof file deleted."
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message || "Server Error" });
    }
};
exports.approvePaymentProof = approvePaymentProof;
// Reject payment proof, delete proof/screenshot (Admin)
const rejectPaymentProof = async (req, res) => {
    try {
        const { id } = req.params;
        if (!env_1.env.isDatabaseConfigured) {
            console.log(`[MOCK MODE] Rejected manual payment proof ID: ${id}`);
            return res.status(200).json({ success: true, message: "Payment proof rejected (mock mode)." });
        }
        const proof = await PaymentProof_1.default.findById(id);
        if (!proof) {
            return res.status(404).json({ success: false, error: "Payment proof not found." });
        }
        // Create rejection notification
        await Notification_1.default.create({
            user: proof.user,
            type: "ACCOUNT",
            title: "Payment Proof Rejected",
            message: `Your payment proof for ${proof.planName} could not be verified. Please check your transaction details and upload again, or nudge us on WhatsApp.`,
            isRead: false
        });
        // Clean up filesystem space: delete the uploaded screenshot file
        deleteScreenshotFile(proof.screenshotUrl);
        // Clean up database space: delete the PaymentProof document
        await PaymentProof_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Payment proof rejected and file deleted."
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message || "Server Error" });
    }
};
exports.rejectPaymentProof = rejectPaymentProof;
