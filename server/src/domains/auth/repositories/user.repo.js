// backend/src/domains/auth/repositories/user.repo.js
import { prisma } from '../../../infrastructure/db/prisma.js';

// [Suy luận] Prisma model là `user` mapping bảng `users`.
// Nếu bạn đặt tên model khác, hãy báo mình để chỉnh lại field.

export async function findByEmail(email) {
  return prisma.users.findUnique({
    where: { email },
  });
}

export async function findById(id) {
  return prisma.users.findUnique({
    where: { id: Number(id) },
  });
}

export async function create({ email, passwordHash, role = 'USER' }) {
  return prisma.users.create({
    data: {
      email,
      password_hash: passwordHash,
      role,
    },
  });
}
