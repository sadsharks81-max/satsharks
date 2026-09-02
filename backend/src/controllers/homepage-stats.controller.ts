import { Request, Response } from "express";
import HomepageStats from "../models/HomepageStats";
import { sendError } from "../utils/http";

/**
 * Explicit allowlist of editable settings. Anything outside this list in the
 * request body is ignored, so the endpoint cannot be used to write arbitrary
 * paths onto the document.
 */
const EDITABLE_FIELDS = [
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
    ] as const;

export const getHomepageStats = async (_req: Request, res: Response) => {
  try {
    // Upsert-on-read keeps the singleton behaviour but in one atomic round trip
    // instead of a findOne() followed by a create() that could race two callers
    // into creating two documents.
    const stats = await HomepageStats.findOneAndUpdate(
      {},
      { $setOnInsert: {} },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
    res.setHeader("Cache-Control", "public, max-age=30, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    return sendError(res, error, "homepage-stats.getHomepageStats");
  }
};

export const updateHomepageStats = async (req: Request, res: Response) => {
  try {
    const update: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }

    const stats = await HomepageStats.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    ).lean();

    return res
      .status(200)
      .json({ success: true, stats, message: "Settings updated successfully" });
  } catch (error) {
    return sendError(res, error, "homepage-stats.updateHomepageStats");
  }
};
