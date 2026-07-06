import { IsEnum } from "class-validator";

export enum CheckoutPlan {
  PREMIUM = "premium",
  PRO = "pro",
}

export enum CheckoutGateway {
  STRIPE = "stripe",
  VNPAY = "vnpay",
}

// POST /subscriptions/checkout
export class CreateCheckoutDto {
  @IsEnum(CheckoutPlan)
  plan: CheckoutPlan;

  @IsEnum(CheckoutGateway)
  gateway: CheckoutGateway;
}
