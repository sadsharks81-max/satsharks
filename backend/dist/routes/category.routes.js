"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
// public: allow frontend to fetch categories without auth
router.get("/", category_controller_1.getCategories);
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), category_validator_1.categoryValidator, validate_middleware_1.validate, category_controller_1.createCategory);
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), category_validator_1.categoryValidator, validate_middleware_1.validate, category_controller_1.updateCategory);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), category_controller_1.deleteCategory);
exports.default = router;
