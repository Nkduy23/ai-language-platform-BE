// common/guards/subscription.guard.ts — Chặn route cần Premium/Pro nếu user đang Free hoặc hết hạn
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../database/prisma.service";
import { REQUIRED_PLANS_KEY } from "../decorators/require-plan.decorator";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.getAllAndOverride<string[]>(REQUIRED_PLANS_KEY, [context.getHandler(), context.getClass()]);

    // Route không gắn @RequirePlan → cho qua, không cần check
    if (!requiredPlans || requiredPlans.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    const isActive = subscription && subscription.status === "ACTIVE";
    const hasPlan = isActive && requiredPlans.includes(subscription.plan);

    if (!hasPlan) {
      throw new ForbiddenException({
        statusCode: 403,
        message: "Premium required",
        upgradeUrl: "/pricing",
      });
    }

    return true;
  }
}
