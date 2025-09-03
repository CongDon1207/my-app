// backend/src/infrastructure/db/prisma.js
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
});

// Đảm bảo đóng kết nối khi process dừng
async function gracefulShutdown() {
  try {
    await prisma.$disconnect();
  } catch (e) {
    // noop
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
