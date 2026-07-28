"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrTeacher = exports.requireTeacher = exports.requireActiveUser = exports.requireInternationalUser = exports.requireLocalUser = exports.requirePaidUser = exports.requireStudent = exports.requireAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const requireAdmin = () => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, error: "Forbidden: Admin access required" });
        }
        next();
    };
};
exports.requireAdmin = requireAdmin;
const requireStudent = () => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== "STUDENT") {
            return res.status(403).json({ success: false, error: "Forbidden: Student access required" });
        }
        next();
    };
};
exports.requireStudent = requireStudent;
const requirePaidUser = () => {
    return (req, res, next) => {
        if (!req.user || req.user.subscription !== "PAID") {
            return res.status(403).json({ success: false, error: "Forbidden: Paid subscription required" });
        }
        next();
    };
};
exports.requirePaidUser = requirePaidUser;
const requireLocalUser = () => {
    return (req, res, next) => {
        if (!req.user || req.user.region !== "LOCAL") {
            return res.status(403).json({ success: false, error: "Forbidden: Local region required" });
        }
        next();
    };
};
exports.requireLocalUser = requireLocalUser;
const requireInternationalUser = () => {
    return (req, res, next) => {
        if (!req.user || req.user.region !== "INTERNATIONAL") {
            return res.status(403).json({ success: false, error: "Forbidden: International region required" });
        }
        next();
    };
};
exports.requireInternationalUser = requireInternationalUser;
const requireActiveUser = () => {
    return async (req, res, next) => {
        if (!req.user || req.user.status === "SUSPENDED") {
            return res.status(403).json({ success: false, error: "Forbidden: Account is suspended" });
        }
        if (req.user.role === "STUDENT") {
            const user = await User_1.default.findById(req.user.userId).select("portalAccessStart portalAccessEnd subscription");
            const now = new Date();
            if (user?.portalAccessStart && user.portalAccessStart > now) {
                return res.status(403).json({ success: false, error: "Your portal access has not started yet." });
            }
            if (user?.portalAccessEnd && user.portalAccessEnd <= now) {
                if (user.subscription !== "FREE") {
                    user.subscription = "FREE";
                    await user.save();
                }
                return res.status(403).json({ success: false, error: "Your portal access has expired." });
            }
        }
        next();
    };
};
exports.requireActiveUser = requireActiveUser;
const requireTeacher = () => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== "TEACHER") {
            return res.status(403).json({ success: false, error: "Forbidden: Teacher access required" });
        }
        next();
    };
};
exports.requireTeacher = requireTeacher;
const requireAdminOrTeacher = () => {
    return (req, res, next) => {
        if (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "TEACHER")) {
            return res.status(403).json({ success: false, error: "Forbidden: Admin or Teacher access required" });
        }
        next();
    };
};
exports.requireAdminOrTeacher = requireAdminOrTeacher;
