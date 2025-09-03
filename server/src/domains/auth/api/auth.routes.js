// backend/src/domains/auth/api/auth.routes.js
import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";

// ⬇️ Import từ infrastructure (đã có sẵn theo bạn cung cấp)
import {
  requireAuth,
  // optionalAuth, // (dùng cho route public nếu bạn muốn parse user khi có token)
} from "../../../infrastructure/http/auth.middleware.js";

const router = Router();

// Public
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);

// Private
router.get("/me", requireAuth, AuthController.me);
router.post("/logout", requireAuth, AuthController.logout);

export default router;
