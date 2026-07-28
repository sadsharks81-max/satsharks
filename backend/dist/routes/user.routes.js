"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.authenticate, user_controller_1.getCurrentUser);
router.put("/me/settings", auth_middleware_1.authenticate, user_controller_1.updateUserSettings);
// Admin Routes
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), user_controller_1.getUsers);
router.put("/:id/subscription", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), user_controller_1.updateUserSubscription);
router.put("/:id/status", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), user_controller_1.updateUserStatus);
router.put("/:id/role", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), user_controller_1.updateUserRole);
router.put("/:id/access-dates", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), user_controller_1.updateUserAccessDates);
exports.default = router;
