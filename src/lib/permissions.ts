import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 权限检查工具
 *
 * 规则：
 * - 删除：发布者本人或管理员
 * - 修改：仅发布者本人（管理员不能修改他人内容）
 */

/** 获取当前登录用户 ID，未登录返回 null */
export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** 检查当前用户是否为管理员 */
export async function isAdmin(): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

/** 检查当前用户是否可以删除（发布者本人 或 管理员） */
export async function canDelete(authorId: string): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  if (userId === authorId) return true;
  return isAdmin();
}

/** 检查当前用户是否可以修改（仅发布者本人） */
export async function canEdit(authorId: string): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  return userId === authorId;
}
