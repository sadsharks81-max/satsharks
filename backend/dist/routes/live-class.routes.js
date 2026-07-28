"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const live_class_controller_1 = require("../controllers/live-class.controller");
const router = express_1.default.Router();
// Get list of classes (accessible to all logged in users, with role-based filtering inside)
router.get("/", auth_middleware_1.authenticate, live_class_controller_1.getLiveClasses);
// Get single class details
router.get("/:id", auth_middleware_1.authenticate, live_class_controller_1.getLiveClassById);
// Create class (only admins or teachers)
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdminOrTeacher)(), live_class_controller_1.createLiveClass);
// Update status (only admins or teacher assigned to the class)
router.put("/:id/status", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdminOrTeacher)(), live_class_controller_1.updateLiveClassStatus);
// Delete class (only creator or admin)
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdminOrTeacher)(), live_class_controller_1.deleteLiveClass);
exports.default = router;
