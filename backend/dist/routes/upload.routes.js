"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const storage = multer_1.default.diskStorage({
    destination: path_1.default.resolve(__dirname, "../../uploads"),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
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
    limits: { fileSize: 50 * 1024 * 1024 },
});
const memoryStorage = multer_1.default.memoryStorage();
const imageUpload = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only PNG, JPG, JPEG, WEBP, and GIF images are allowed"));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 },
});
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload_controller_1.getUploads);
router.get("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload_controller_1.getUpload);
router.post("/practice-test", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload.single("file"), upload_controller_1.uploadPracticeTest);
router.post("/image", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), imageUpload.single("image"), upload_controller_1.uploadImage);
router.post("/:id/extract", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload_controller_1.triggerExtraction);
router.put("/:id/review", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload_controller_1.reviewUpload);
router.post("/:id/publish", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload_controller_1.publishUpload);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireAdmin)(), upload_controller_1.deleteUpload);
exports.default = router;
