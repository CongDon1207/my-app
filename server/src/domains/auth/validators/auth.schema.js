// backend/src/domains/auth/validators/auth.schema.js
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được bỏ trống" }),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token bắt buộc" }),
});
