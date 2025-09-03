// backend/src/infrastructure/http/auth.middleware.js
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

function parseToken(req) {
  const auth = req.headers['authorization'] || '';
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export function optionalAuth(req, _res, next) {
  const token = parseToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    // payload: { sub, role, email, iat, exp }
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
  } catch {
    // token lỗi thì vẫn cho qua nhưng không set user
  }
  return next();
}

export function requireAuth(req, _res, next) {
  const token = parseToken(req);
  if (!token) {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch {
    const err = new Error('Invalid or expired token');
    err.status = 401;
    return next(err);
  }
}
