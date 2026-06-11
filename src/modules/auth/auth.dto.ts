// Data Transfer Objects, validation schemas
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Mật khẩu tối thiểu 8 ký tự" })
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2, { message: "Tên hiển thị tối thiểu 2 ký tự" })
  @MaxLength(50)
  displayName: string;
}

export class LoginDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
