// notifications.controller.ts — In-app notification center + Web Push subscribe/unsubscribe
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { Req } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser("id") userId: string, @Query("page") page?: string, @Query("limit") limit?: string) {
    return this.notificationsService.list(userId, page ? +page : 1, limit ? +limit : 20);
  }

  @Patch(":id/read")
  markAsRead(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Patch("read-all")
  markAllAsRead(@CurrentUser("id") userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  // GET /notifications/push/vapid-public-key — FE lấy public key để đăng ký push
  @Get("push/vapid-public-key")
  getVapidPublicKey() {
    return this.notificationsService.getVapidPublicKey();
  }

  // POST /notifications/push/subscribe — FE gửi PushSubscription object sau khi user cho phép
  @Post("push/subscribe")
  subscribePush(@CurrentUser("id") userId: string, @Body() subscription: any, @Req() req: Request) {
    return this.notificationsService.subscribePush(userId, subscription, req.headers["user-agent"]);
  }

  // DELETE /notifications/push/subscribe — huỷ đăng ký push (vd khi user tắt trong Settings)
  @Delete("push/subscribe")
  unsubscribePush(@CurrentUser("id") userId: string, @Body("endpoint") endpoint: string) {
    return this.notificationsService.unsubscribePush(userId, endpoint);
  }
}
