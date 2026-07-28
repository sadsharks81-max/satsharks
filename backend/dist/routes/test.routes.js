"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const test_validator_1 = require("../validators/test.validator");
const router = (0, express_1.Router)();
// Student routes
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireActiveUser)(), test_controller_1.getTests);
router.get("/attempt/:id", auth_middleware_1.authenticate, test_controller_1.getAttempt);
router.post("/:id/start", auth_middleware_1.authenticate, (0, role_middleware_1.requireActiveUser)(), test_controller_1.startTest);
router.put("/attempt/:id/submit", auth_middleware_1.authenticate, test_validator_1.submitTestValidator, validate_middleware_1.validate, test_controller_1.submitTest);
// Admin routes
router.get("/admin/all", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), test_controller_1.getAllTestsAdmin);
router.get("/:id", auth_middleware_1.authenticate, test_controller_1.getTest);
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), test_validator_1.testValidator, validate_middleware_1.validate, test_controller_1.createTest);
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), test_controller_1.updateTest);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), test_controller_1.deleteTest);
exports.default = router;
