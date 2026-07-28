"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const university_controller_1 = require("../controllers/university.controller");
const router = (0, express_1.Router)();
router.get("/", university_controller_1.getAllUniversities);
router.put("/sync", auth_middleware_1.authenticate, auth_middleware_1.isAdmin, university_controller_1.syncUniversities);
exports.default = router;
