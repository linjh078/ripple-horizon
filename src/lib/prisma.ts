// ============================================================================
// Prisma 客户端单例 (Prisma v5)
// 懒加载 — 确保 Next.js 加载 .env 后才初始化
// ============================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// 首次调用时延迟创建（确保 Next.js 已加载 .env）
export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());
