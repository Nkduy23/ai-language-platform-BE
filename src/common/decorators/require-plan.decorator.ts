// Đánh dấu route yêu cầu gói Premium/Pro — dùng chung với SubscriptionGuard
import { SetMetadata } from "@nestjs/common";

export const REQUIRED_PLANS_KEY = "requiredPlans";
export const RequirePlan = (...plans: Array<"PREMIUM" | "PRO">) => SetMetadata(REQUIRED_PLANS_KEY, plans);
