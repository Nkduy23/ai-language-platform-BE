// subscriptions.service.ts — Plan management, Stripe + VNPay checkout, webhook handling
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import Stripe from "stripe";
import { PrismaService } from "../../database/prisma.service";
import { CreateCheckoutDto, CheckoutGateway, CheckoutPlan } from "./subscriptions.dto";
import { EmailService } from "../../common/email/email.service";

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    const secretKey = this.configService.get<string>("stripe.secretKey");
    // Stripe SDK vẫn khởi tạo được dù thiếu key — chỉ lỗi khi thực sự gọi API
    this.stripe = new Stripe(secretKey || "sk_test_placeholder", { apiVersion: "2023-10-16" as any });
  }

  // GET /subscriptions/plans
  getPlans() {
    const premiumVnd = this.configService.get<number>("pricing.premiumVnd")!;
    const proVnd = this.configService.get<number>("pricing.proVnd")!;
    return [
      {
        plan: "FREE",
        priceVnd: 0,
        features: ["Flashcard, Quiz, Ngữ pháp A1-A2", "AI Chat 10 tin nhắn/ngày"],
      },
      {
        plan: "PREMIUM",
        priceVnd: premiumVnd,
        features: ["AI Chat không giới hạn", "AI Speaking", "Lộ trình cá nhân hóa"],
      },
      {
        plan: "PRO",
        priceVnd: proVnd,
        features: ["Tất cả Premium", "Mock Interview", "Business Mode", "Chứng chỉ hoàn thành"],
      },
    ];
  }

  // GET /subscriptions/current
  async getCurrent(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) throw new NotFoundException("Chưa có subscription");
    return sub;
  }

  // POST /subscriptions/checkout
  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User không tồn tại");

    const amountVnd = dto.plan === CheckoutPlan.PREMIUM ? this.configService.get<number>("pricing.premiumVnd")! : this.configService.get<number>("pricing.proVnd")!;

    if (dto.gateway === CheckoutGateway.STRIPE) {
      return this.createStripeCheckout(userId, user.email, dto.plan, amountVnd);
    }
    return this.createVnpayCheckout(userId, dto.plan, amountVnd);
  }

  private async createStripeCheckout(userId: string, email: string, plan: CheckoutPlan, amountVnd: number) {
    const frontendUrl = this.configService.get<string>("frontendUrl");

    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "vnd", // zero-decimal currency — không nhân 100
            product_data: { name: `AI Language Platform — ${plan.toUpperCase()}` },
            unit_amount: amountVnd,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: { userId, plan },
      success_url: `${frontendUrl}/dashboard/profile?checkout=success`,
      cancel_url: `${frontendUrl}/pricing?checkout=cancelled`,
    });

    return { checkoutUrl: session.url };
  }

  private createVnpayCheckout(userId: string, plan: CheckoutPlan, amountVnd: number) {
    const tmnCode = this.configService.get<string>("vnpay.tmnCode");
    const secretKey = this.configService.get<string>("vnpay.secretKey");
    const vnpUrl = this.configService.get<string>("vnpay.url");
    const appUrl = this.configService.get<string>("appUrl");

    if (!tmnCode || !secretKey) {
      throw new BadRequestException("VNPay chưa được cấu hình");
    }

    const createDate = this.formatVnpayDate(new Date());
    const orderId = `${Date.now()}`;

    const params: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Nang cap ${plan} - user ${userId}`,
      vnp_OrderType: "other",
      vnp_Amount: String(amountVnd * 100), // VNPay yêu cầu nhân 100
      vnp_ReturnUrl: `${appUrl}/api/v1/subscriptions/webhook/vnpay`,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    const signed = this.buildVnpaySignedUrl(vnpUrl!, params, secretKey);
    return { checkoutUrl: signed };
  }

  // POST /subscriptions/webhook/stripe
  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>("stripe.webhookSecret");
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret!);
    } catch (err) {
      throw new BadRequestException(`Webhook signature không hợp lệ: ${(err as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan?.toUpperCase();
      if (userId && plan) {
        const amountVnd = session.amount_total ?? 0;
        await this.upsertSubscription(userId, plan, amountVnd, {
          stripeCustomerId: session.customer as string,
          stripeSubId: session.subscription as string,
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      await this.prisma.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: { status: "CANCELLED", plan: "FREE" },
      });
    }

    return { received: true };
  }

  // POST /subscriptions/webhook/vnpay — VNPay redirect về kèm query params đã ký
  async handleVnpayWebhook(query: Record<string, string>) {
    const secretKey = this.configService.get<string>("vnpay.secretKey")!;
    const { vnp_SecureHash, ...rest } = query;

    const isValid = this.verifyVnpaySignature(rest, vnp_SecureHash, secretKey);
    if (!isValid) throw new BadRequestException("Chữ ký VNPay không hợp lệ");

    const isSuccess = query.vnp_ResponseCode === "00";
    if (isSuccess) {
      // OrderInfo chứa "user <userId>" — parse đơn giản, nên gắn userId có cấu trúc rõ ràng hơn ở bản production
      const match = query.vnp_OrderInfo?.match(/user (\S+)/);
      const userId = match?.[1];
      const planMatch = query.vnp_OrderInfo?.match(/Nang cap (\w+)/i);
      const plan = planMatch?.[1]?.toUpperCase();
      if (userId && plan) {
        const amountVnd = query.vnp_Amount ? Math.round(parseInt(query.vnp_Amount, 10) / 100) : 0;
        await this.upsertSubscription(userId, plan, amountVnd, {});
      }
    }

    return { success: isSuccess };
  }

  private async upsertSubscription(userId: string, plan: string, amountVnd: number, extra: { stripeCustomerId?: string; stripeSubId?: string }) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: plan as any,
        status: "ACTIVE",
        expiresAt,
        ...extra,
      },
      update: {
        plan: plan as any,
        status: "ACTIVE",
        expiresAt,
        ...extra,
      },
    });
    this.logger.log(`Subscription updated: user=${userId} plan=${plan}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      this.emailService.sendPaymentReceipt(user.email, plan, amountVnd).catch(() => {});
    }
  }

  private formatVnpayDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  private sortParams(params: Record<string, string>): Record<string, string> {
    return Object.keys(params)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {} as Record<string, string>);
  }

  private buildVnpaySignedUrl(baseUrl: string, params: Record<string, string>, secretKey: string): string {
    const sorted = this.sortParams(params);
    const signData = new URLSearchParams(sorted).toString();
    const secureHash = crypto.createHmac("sha512", secretKey).update(signData).digest("hex");
    return `${baseUrl}?${signData}&vnp_SecureHash=${secureHash}`;
  }

  private verifyVnpaySignature(params: Record<string, string>, receivedHash: string, secretKey: string): boolean {
    const sorted = this.sortParams(params);
    const signData = new URLSearchParams(sorted).toString();
    const expectedHash = crypto.createHmac("sha512", secretKey).update(signData).digest("hex");
    return expectedHash === receivedHash;
  }
}
