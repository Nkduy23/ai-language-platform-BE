// subscriptions.controller.ts — Plans, checkout, current subscription, webhooks (Stripe/VNPay)
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import type { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { SubscriptionsService } from "./subscriptions.service";
import { CreateCheckoutDto } from "./subscriptions.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly configService: ConfigService,
  ) {}

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

  // GET /subscriptions/webhook/vnpay — VNPay redirect TRÌNH DUYỆT người dùng về đây bằng GET (không phải POST)
  // Xử lý xong thì redirect tiếp sang FE để hiển thị UI đẹp, không trả JSON thô cho người dùng thấy
  @Get("webhook/vnpay")
  async handleVnpayWebhook(@Query() query: Record<string, string>, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>("frontendUrl");
    try {
      const result = await this.subscriptionsService.handleVnpayWebhook(query);
      const redirectUrl = result.success ? `${frontendUrl}/dashboard/profile?checkout=success` : `${frontendUrl}/pricing?checkout=failed`;
      return res.redirect(redirectUrl);
    } catch (err) {
      return res.redirect(`${frontendUrl}/pricing?checkout=error`);
    }
  }
}
