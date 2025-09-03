// backend/src/domains/auth/controllers/auth.controller.js
// Controller chỉ điều phối, tất cả logic sẽ ở service (bước sau)
import * as AuthService from '../services/auth.service.js'; // sẽ tạo ở bước sau

import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.schema.js';

export async function register(req, res, next) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await AuthService.register(input);
    // result: { user: { id, email, role }, tokens: { accessToken, refreshToken } }
    return res.status(201).json({ success: true, data: result, error: null });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await AuthService.login(input);
    // result: { user, tokens }
    return res.status(200).json({ success: true, data: result, error: null });
  } catch (err) {
    return next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await AuthService.refresh({ refreshToken });
    // result: { accessToken, refreshToken }
    return res.status(200).json({ success: true, data: result, error: null });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    // req.user sẽ được set bởi authMiddleware (đã/ sẽ có)
    const user = await AuthService.me({ userId: req.user?.id });
    return res.status(200).json({ success: true, data: user, error: null });
  } catch (err) {
    return next(err);
  }
}

// (tuỳ chọn)
export async function logout(req, res, next) {
  try {
    // Ví dụ: revoke refresh token trong DB (bước sau)
    await AuthService.logout({ userId: req.user?.id });
    return res.status(204).send(); // No content
  } catch (err) {
    return next(err);
  }
}