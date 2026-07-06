// subscriptions.controller.ts — Plans, checkout, current subscription, webhooks (Stripe/VNPay)
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import type { Request } from "express";
import { SubscriptionsService } from "./subscriptions.service";
import { CreateCheckoutDto } from "./subscriptions.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // GET /subscriptions/plans — public, không cần login
  @Get("plans")
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  // GET /subscriptions/current
  @Get("current")
  @UseGuards(JwtAuthGuard)
  getCurrent(@CurrentUser("id") userId: string) {
    return this.subscriptionsService.getCurrent(userId);
  }

  // POST /subscriptions/checkout
  @Post("checkout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  createCheckout(@CurrentUser("id") userId: string, @Body() dto: CreateCheckoutDto) {
    return this.subscriptionsService.createCheckout(userId, dto);
  }

  // POST /subscriptions/webhook/stripe — internal, Stripe gọi trực tiếp, verify bằng chữ ký raw body
  @Post("webhook/stripe")
  @HttpCode(HttpStatus.OK)
  handleStripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers("stripe-signature") signature: string) {
    return this.subscriptionsService.handleStripeWebhook(req.rawBody as Buffer, signature);
  }

  // POST /subscriptions/webhook/vnpay — VNPay redirect kèm query params đã ký
  @Post("webhook/vnpay")
  @HttpCode(HttpStatus.OK)
  handleVnpayWebhook(@Query() query: Record<string, string>) {
    return this.subscriptionsService.handleVnpayWebhook(query);
  }
}
