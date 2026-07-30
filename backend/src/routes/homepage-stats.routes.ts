import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import HomepageStats from "../models/HomepageStats";

const router = Router();

// GET /api/homepage-stats - Public
router.get("/", async (req, res) => {
  try {
    let stats = await HomepageStats.findOne();
    if (!stats) {
      stats = await HomepageStats.create({});
    }
    return res.status(200).json({ success: true, stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/homepage-stats - Admin only
router.put("/", authenticate, requireAdmin(), async (req, res) => {
  try {
    let stats = await HomepageStats.findOne();
    if (!stats) {
      stats = new HomepageStats();
    }

    const fields = [
      "successRate",
      "studentsMentored",
      "eliteAdmissions",
      "avgSatGain",
      "satPortalPk",
      "satGroupPk",
      "satOneOnOnePk",
      "satPortalIntl",
      "satGroupIntl",
      "satOneOnOneIntl",
      "lumsGuidedPk",
      "lumsCompletePk",
      "lumsGuidedIntl",
      "lumsCompleteIntl",
      "admGuidedUsaPk",
      "admCompleteUsaPk",
      "admGuidedCanadaPk",
      "admCompleteCanadaPk",
      "admGuidedUkPk",
      "admCompleteUkPk",
      "admGuidedTurkeyPk",
      "admCompleteTurkeyPk",
      "admGuidedEuropePk",
      "admCompleteEuropePk",
      "admGuidedGulfPk",
      "admCompleteGulfPk",
      "admGuidedUsaIntl",
      "admCompleteUsaIntl",
      "admGuidedCanadaIntl",
      "admCompleteCanadaIntl",
      "admGuidedUkIntl",
      "admCompleteUkIntl",
      "admGuidedTurkeyIntl",
      "admCompleteTurkeyIntl",
      "admGuidedEuropeIntl",
      "admCompleteEuropeIntl",
      "admGuidedGulfIntl",
      "admCompleteGulfIntl"
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        (stats as any)[field] = req.body[field];
      }
    }

    await stats.save();
    return res.status(200).json({ success: true, stats, message: "Settings updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
