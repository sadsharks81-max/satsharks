import { Router } from "express";
import { 
  getSuccessStories, 
  createSuccessStory, 
  updateSuccessStory, 
  deleteSuccessStory,
  getHeroFeature,
  updateHeroFeature,
  getHomepageSuccessContent,
  getSuccessStoryImage,
  getHeroFeatureImage,
} from "../controllers/success-stories.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get("/", getSuccessStories);
router.get("/homepage", getHomepageSuccessContent);
router.get("/featured", getHeroFeature);
router.get("/featured/image", getHeroFeatureImage);
router.get("/image/:id", getSuccessStoryImage);
router.put("/featured", authenticate, requireAdmin(), updateHeroFeature);

router.post("/", authenticate, requireAdmin(), createSuccessStory);
router.put("/:id", authenticate, requireAdmin(), updateSuccessStory);
router.delete("/:id", authenticate, requireAdmin(), deleteSuccessStory);

export default router;
