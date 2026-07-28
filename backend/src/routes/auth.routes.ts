import { Router } from "express";
import { register, login, resetPassword } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerValidator, loginValidator, resetPasswordValidator } from "../validators/auth.validator";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

export default router;
