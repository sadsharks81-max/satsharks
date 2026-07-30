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
    const { successRate, studentsMentored, eliteAdmissions, avgSatGain } = req.body;
    let stats = await HomepageStats.findOne();
    if (!stats) {
      stats = new HomepageStats();
    }
    if (successRate !== undefined) stats.successRate = successRate;
    if (studentsMentored !== undefined) stats.studentsMentored = studentsMentored;
    if (eliteAdmissions !== undefined) stats.eliteAdmissions = eliteAdmissions;
    if (avgSatGain !== undefined) stats.avgSatGain = avgSatGain;

    await stats.save();
    return res.status(200).json({ success: true, stats, message: "Homepage stats updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
