// backend/src/domains/auth/api/auth.routes.js
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
// (sẽ thêm validators ở bước sau)
// import { validate } from '../../../infrastructure/http/validate.js';
// import { loginSchema, registerSchema, refreshSchema } from '../validators/auth.schema.js';

const router = Router();

// Register new user
// DTO in: { email, password }
// out: { user: { id, email, role }, tokens: { accessToken, refreshToken } }
router.post('/register', /* validate(registerSchema), */ AuthController.register);

// Login
// DTO in: { email, password }
// out: { user: { id, email, role }, tokens: { accessToken, refreshToken } }
router.post('/login', /* validate(loginSchema), */ AuthController.login);

// Refresh access token
// DTO in: { refreshToken }
// out: { accessToken, refreshToken }
router.post('/refresh', /* validate(refreshSchema), */ AuthController.refreshToken);

// Get current user (requires auth; middleware sẽ thêm ở bước sau)
// out: { id, email, role }
router.get('/me', /* authMiddleware, */ AuthController.me);

// (tuỳ chọn) Logout: FE có thể tự xoá token, BE hỗ trợ revoke refresh sau
// router.post('/logout', /* authMiddleware, */ AuthController.logout);

router.post('/logout', AuthController.logout);

export default router;
