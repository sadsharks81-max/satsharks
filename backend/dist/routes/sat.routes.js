"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sat_controller_1 = require("../controllers/sat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
// Student routes
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireActiveUser)(), sat_controller_1.getSATTests);
router.get("/attempts", auth_middleware_1.authenticate, sat_controller_1.getMySATAttempts);
router.get("/attempt/:id", auth_middleware_1.authenticate, sat_controller_1.getSATAttempt);
router.post("/:id/start", auth_middleware_1.authenticate, (0, role_middleware_1.requireActiveUser)(), sat_controller_1.startSATTest);
router.post("/attempt/:id/save", auth_middleware_1.authenticate, sat_controller_1.saveSATProgress);
router.post("/attempt/:id/complete-module", auth_middleware_1.authenticate, sat_controller_1.completeModule);
router.post("/attempt/:id/end-break", auth_middleware_1.authenticate, sat_controller_1.endBreak);
router.post("/attempt/:id/submit", auth_middleware_1.authenticate, sat_controller_1.submitSATTest);
// Admin routes
router.get("/admin/all", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), sat_controller_1.getAllSATTestsAdmin);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), sat_controller_1.updateSATTestAdmin);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), sat_controller_1.deleteSATTestAdmin);
exports.default = router;
