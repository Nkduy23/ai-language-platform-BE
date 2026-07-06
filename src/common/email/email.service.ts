// common/email/email.service.ts — Nodemailer SMTP, dùng cho welcome/receipt/streak reminder
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromName: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>("smtp.host");
    const user = this.configService.get<string>("smtp.user");
    const pass = this.configService.get<string>("smtp.pass");
    this.fromName = this.configService.get<string>("smtp.fromName")!;
    this.fromEmail = this.configService.get<string>("smtp.fromEmail")!;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>("smtp.port"),
        secure: false,
        auth: { user, pass },
      });
    } else {
      this.logger.warn("SMTP chưa được cấu hình — email sẽ chỉ log ra console thay vì gửi thật");
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`[EMAIL DEV MODE] to=${to} subject="${subject}"`);
      return;
    }
    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Gửi email thất bại tới ${to}: ${(err as Error).message}`);
    }
  }

  async sendWelcomeEmail(to: string, displayName: string) {
    await this.send(
      to,
      "Chào mừng bạn đến với AI Language Platform! 🎉",
      `<p>Chào ${displayName},</p>
       <p>Cảm ơn bạn đã đăng ký AI Language Platform. Bắt đầu học Anh/Trung/Nhật cùng AI ngay hôm nay nhé!</p>
       <p>Chúc bạn học vui 🚀</p>`,
    );
  }

  async sendPaymentReceipt(to: string, plan: string, amountVnd: number) {
    await this.send(
      to,
      `Xác nhận thanh toán gói ${plan}`,
      `<p>Bạn đã nâng cấp thành công lên gói <b>${plan}</b>.</p>
       <p>Số tiền: <b>${amountVnd.toLocaleString("vi-VN")}đ/tháng</b></p>
       <p>Cảm ơn bạn đã đồng hành cùng AI Language Platform!</p>`,
    );
  }

  async sendStreakReminder(to: string, displayName: string, streakDays: number) {
    await this.send(
      to,
      `Đừng để mất streak ${streakDays} ngày! 🔥`,
      `<p>Chào ${displayName},</p>
       <p>Bạn đang có streak ${streakDays} ngày liên tiếp — đừng để hôm nay bị đứt mạch nhé!</p>
       <p>Vào học ngay để giữ streak: <a href="${this.configService.get("frontendUrl")}/dashboard/learn">Học ngay</a></p>`,
    );
  }
}
