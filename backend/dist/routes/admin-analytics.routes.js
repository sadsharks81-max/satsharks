"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_analytics_controller_1 = require("../controllers/admin-analytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get("/overview", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), admin_analytics_controller_1.getAdminOverview);
exports.default = router;
