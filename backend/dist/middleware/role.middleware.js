"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrTeacher = exports.requireTeacher = exports.requireActiveUser = exports.requireInternationalUser = exports.requireLocalUser = exports.requirePaidUser = exports.requireStudent = exports.requireAdmin = void 0;
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
    return (req, res, next) => {
        if (!req.user || req.user.status === "SUSPENDED") {
            return res.status(403).json({ success: false, error: "Forbidden: Account is suspended" });
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
