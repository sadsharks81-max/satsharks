import { Response } from "express";
import SubscriptionPlan from "../models/SubscriptionPlan";
import { AuthRequest } from "../middleware/auth.middleware";
import { env } from "../config/env";
import { phaseOneSubscriptionPlans } from "../data/phaseOne";

const roleRequiredByRegion: Record<string, string[]> = {
  LOCAL: ["LOCAL_FREE", "LOCAL_PAID"],
  INTERNATIONAL: ["INTL_FREE", "INTL_PAID"],
};

const getAllowedPlanRoles = (region?: string) =>
  region ? roleRequiredByRegion[region] : undefined;

export const getVisiblePlans = <T extends { roleRequired: string }>(
  plans: T[],
  region?: string,
) => {
  const allowedRoles = getAllowedPlanRoles(region);

  if (!allowedRoles) {
    return [];
  }

  return plans.filter((plan) => allowedRoles.includes(plan.roleRequired));
};

export const getPlans = async (req: AuthRequest, res: Response) => {
  try {
    const userRegion = req.user?.region;
    const allowedRoles = getAllowedPlanRoles(userRegion);

    if (!env.isDatabaseConfigured) {
      const plans = allowedRoles
        ? getVisiblePlans(phaseOneSubscriptionPlans, userRegion)
        : phaseOneSubscriptionPlans;
      return res
        .status(200)
        .json({
          success: true,
          plans,
        });
    }

    const filter = allowedRoles ? { roleRequired: { $in: allowedRoles } } : {};
    const plans = await SubscriptionPlan.find(filter);
    res.status(200).json({ success: true, plans });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
