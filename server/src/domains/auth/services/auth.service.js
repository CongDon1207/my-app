// backend/src/domains/auth/services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserRepo from '../repositories/user.repo.js';
import { env } from '../../../infrastructure/config/env.js'; // JWT_SECRET, REFRESH_SECRET, ...
// Lưu ý: controller đã gọi các hàm này và res.json / next(err)

function signTokens(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ sub: user.id, typ: 'refresh' }, env.REFRESH_SECRET, {
    expiresIn: env.REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
}

function maskUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role };
}

export async function register({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  const existed = await UserRepo.findByEmail(email);
  if (existed) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const saltRounds = Number(env.BCRYPT_SALT_ROUNDS || 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await UserRepo.create({ email, passwordHash, role: 'USER' });
  const tokens = signTokens(user);
  return { user: maskUser(user), tokens };
}

export async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  const user = await UserRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const tokens = signTokens(user);
  return { user: maskUser(user), tokens };
}

export async function refresh({ refreshToken }) {
  if (!refreshToken) {
    const err = new Error('refreshToken is required');
    err.status = 400;
    throw err;
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.REFRESH_SECRET);
  } catch {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  // Optionally: kiểm tra revoke trong DB
  const user = await UserRepo.findById(decoded.sub);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const tokens = signTokens(user);
  return { ...tokens };
}

export async function me({ userId }) {
  if (!userId) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  const user = await UserRepo.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return maskUser(user);
}

// Tuỳ chọn: nếu sau này lưu refresh token trong DB để revoke
export async function logout(/* { userId } */) {
  // No-op hiện tại: FE tự xoá token; có thể triển khai revoke sau.
  return true;
}
