"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const study_material_controller_1 = require("../controllers/study-material.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const storage = multer_1.default.diskStorage({
    destination: path_1.default.resolve(__dirname, "../../uploads"),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `notes-${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf")
            cb(null, true);
        else
            cb(new Error("Only PDF files are allowed"));
    },
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, study_material_controller_1.getStudyMaterials);
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdminOrTeacher)(), upload.single("file"), study_material_controller_1.uploadStudyMaterial);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdminOrTeacher)(), study_material_controller_1.deleteStudyMaterial);
exports.default = router;
