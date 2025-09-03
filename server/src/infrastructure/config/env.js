// backend/src/infrastructure/config/env.js
import 'dotenv/config';

function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) {
    throw new Error(`[env] Missing required env: ${name}`);
  }
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  // DB
  DATABASE_URL: required('DATABASE_URL'),

  // JWT
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',

  REFRESH_SECRET: required('REFRESH_SECRET'),
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || '7d',

  // Bcrypt
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),

  // Server
  PORT: Number(process.env.PORT || 3001),
  API_PREFIX: process.env.API_PREFIX || '/api',
};
