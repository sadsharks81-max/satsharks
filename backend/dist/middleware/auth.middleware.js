"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.optionalAuthenticate = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        // Enforce single-device login
        if (decoded.sessionId && process.env.DATABASE_URL) {
            const user = await User_1.default.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ success: false, error: "User not found" });
            }
            if (user.sessionId && user.sessionId !== decoded.sessionId) {
                return res.status(401).json({ success: false, error: "Session expired: logged in from another device" });
            }
        }
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ success: false, error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next();
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (decoded.sessionId && process.env.DATABASE_URL) {
            const user = await User_1.default.findById(decoded.userId);
            if (user && user.sessionId && user.sessionId !== decoded.sessionId) {
                return next();
            }
        }
        req.user = decoded;
        next();
    }
    catch {
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
const isAdmin = (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Forbidden: Admin access required" });
    }
    next();
};
exports.isAdmin = isAdmin;
