import type { SubscriptionPlan, User } from "../types";

export type UserRegion = User["region"];

const planRegionMap: Record<UserRegion, string[]> = {
  LOCAL: ["LOCAL_FREE", "LOCAL_PAID"],
  INTERNATIONAL: ["INTL_FREE", "INTL_PAID"],
};

export const getVisiblePlans = (plans: SubscriptionPlan[], userType: UserRegion) => {
  const visibleRoles = planRegionMap[userType];

  return plans.filter((plan) => visibleRoles.includes(plan.roleRequired));
};

export const getPlanHeading = (userType: UserRegion) =>
  userType === "LOCAL"
    ? "Available Plans For Local Students"
    : "Available Plans For International Students";
