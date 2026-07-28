"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const mailer_1 = require("../utils/mailer");
const register = async (req, res) => {
    try {
        const { name, email, password, country } = req.body;
        const region = country.toLowerCase() === "pakistan" ? "LOCAL" : "INTERNATIONAL";
        const subscription = "FREE";
        const status = "ACTIVE";
        if (!process.env.DATABASE_URL) {
            // Mock mode
            const tokens = (0, jwt_1.generateTokens)("mock-id", "STUDENT", region, subscription, status);
            return res
                .status(201)
                .json({
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
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, error: "Email already in use" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: "STUDENT",
            country,
            region,
            subscription,
            status,
        });
        const tokens = (0, jwt_1.generateTokens)(user.id, user.role, user.region, user.subscription, user.status);
        res
            .status(201)
            .json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                country: user.country,
                region: user.region,
                subscription: user.subscription,
                status: user.status,
            },
            ...tokens,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!process.env.DATABASE_URL) {
            // Mock mode
            const mockRole = email.includes("admin") ? "ADMIN" : "STUDENT";
            const mockRegion = email.includes("international")
                ? "INTERNATIONAL"
                : "LOCAL";
            const mockSubscription = email.includes("paid") ? "PAID" : "FREE";
            const mockCountry = mockRegion === "LOCAL" ? "Pakistan" : "USA";
            const tokens = (0, jwt_1.generateTokens)("mock-id", mockRole, mockRegion, mockSubscription, "ACTIVE");
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
        const user = await User_1.default.findOne({ email });
        if (!user || !user.password) {
            return res
                .status(401)
                .json({ success: false, error: "Invalid credentials" });
        }
        if (user.status === "SUSPENDED") {
            return res
                .status(403)
                .json({
                success: false,
                error: "Your account is suspended. Please contact support.",
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, error: "Invalid credentials" });
        }
        const tokens = (0, jwt_1.generateTokens)(user.id, user.role, user.region, user.subscription, user.status);
        res
            .status(200)
            .json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                country: user.country,
                region: user.region,
                subscription: user.subscription,
                status: user.status,
            },
            ...tokens,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.login = login;
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({
                success: true,
                message: "Reset instructions sent if email exists",
            });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        // Token expires in 1 hour
        user.resetTokenExpiry = new Date(Date.now() + 3600000);
        await user.save();
        await (0, mailer_1.sendPasswordResetEmail)(user.email, resetToken);
        res.status(200).json({
            success: true,
            message: "Reset instructions sent if email exists",
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.resetPassword = resetPassword;
