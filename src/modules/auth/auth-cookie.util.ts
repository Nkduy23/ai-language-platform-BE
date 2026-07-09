// auth-cookie.util.ts — Set/clear httpOnly cookies cho access/refresh token
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

export function setAuthCookies(res: Response, configService: ConfigService, accessToken: string, refreshToken: string) {
  const domain = configService.get<string>("cookie.domain");
  const secure = configService.get<boolean>("cookie.secure");

  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    domain,
    path: "/",
  };

  res.cookie("accessToken", accessToken, { ...baseOptions, maxAge: 15 * 60 * 1000 }); // 15 phút
  res.cookie("refreshToken", refreshToken, { ...baseOptions, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 ngày
}

export function clearAuthCookies(res: Response, configService: ConfigService) {
  const domain = configService.get<string>("cookie.domain");
  const secure = configService.get<boolean>("cookie.secure");
  const baseOptions = { httpOnly: true, secure, sameSite: "lax" as const, domain, path: "/" };

  res.clearCookie("accessToken", baseOptions);
  res.clearCookie("refreshToken", baseOptions);
}
