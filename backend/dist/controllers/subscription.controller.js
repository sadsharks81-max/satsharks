"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlans = exports.getVisiblePlans = void 0;
const SubscriptionPlan_1 = __importDefault(require("../models/SubscriptionPlan"));
const env_1 = require("../config/env");
const phaseOne_1 = require("../data/phaseOne");
const roleRequiredByRegion = {
    LOCAL: ["LOCAL_FREE", "LOCAL_PAID"],
    INTERNATIONAL: ["INTL_FREE", "INTL_PAID"],
};
const getAllowedPlanRoles = (region) => region ? roleRequiredByRegion[region] : undefined;
const getVisiblePlans = (plans, region) => {
    const allowedRoles = getAllowedPlanRoles(region);
    if (!allowedRoles) {
        return [];
    }
    return plans.filter((plan) => allowedRoles.includes(plan.roleRequired));
};
exports.getVisiblePlans = getVisiblePlans;
const getPlans = async (req, res) => {
    try {
        const userRegion = req.user?.region;
        const allowedRoles = getAllowedPlanRoles(userRegion);
        if (!env_1.env.isDatabaseConfigured) {
            const plans = allowedRoles
                ? (0, exports.getVisiblePlans)(phaseOne_1.phaseOneSubscriptionPlans, userRegion)
                : phaseOne_1.phaseOneSubscriptionPlans;
            return res
                .status(200)
                .json({
                success: true,
                plans,
            });
        }
        const filter = allowedRoles ? { roleRequired: { $in: allowedRoles } } : {};
        const plans = await SubscriptionPlan_1.default.find(filter);
        res.status(200).json({ success: true, plans });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getPlans = getPlans;
