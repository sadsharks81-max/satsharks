import { Router } from "express";
import { getPlans } from "../controllers/subscription.controller";
import { optionalAuthenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/plans",
  optionalAuthenticate,
  getPlans,
);

export default router;

