"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const report_controller_1 = require("../controllers/report.controller");
const router = express_1.default.Router();
// Student routes
router.post("/", auth_middleware_1.authenticate, report_controller_1.createReport);
// Admin routes
router.get("/", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, report_controller_1.getReports);
router.get("/count", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, report_controller_1.getReportCount);
router.get("/:id", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, report_controller_1.getReportById);
router.put("/:id/resolve", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, report_controller_1.resolveReport);
exports.default = router;
