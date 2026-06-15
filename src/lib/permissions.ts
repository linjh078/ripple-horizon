import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 权限检查工具 v2
 *
 * 核心规则：
 * - 管理员（ADMIN）：完全控制，可修改/删除任何内容
 * - 企业 HR：可管理职位和企业，可修改/删除自己的内容
 * - 在校生/教师/校友：仅可修改/删除自己的内容
 */

type RoleResult = { role: string | null; userId: string | null };

async function getUserRole(): Promise<RoleResult> {
  const session = await auth();
  if (!session?.user?.id) return { role: null, userId: null };
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return { role: user?.role ?? null, userId: session.user.id };
}

/** 检查当前用户是否为管理员 */
export async function isAdmin(): Promise<boolean> {
  const { role } = await getUserRole();
  return role === "ADMIN";
}

/** 检查当前用户是否为 HR */
export async function isHR(): Promise<boolean> {
  const { role } = await getUserRole();
  return role === "HR";
}

/** 检查是否可以修改（管理员 或 发布者本人） */
export async function canEdit(authorId: string): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  if (role === "ADMIN") return true;
  return userId === authorId;
}

/** 检查是否可以删除（管理员 或 发布者本人） */
export async function canDelete(authorId: string): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  if (role === "ADMIN") return true;
  return userId === authorId;
}

/** 检查是否可以管理职位（管理员 或 HR） */
export async function canManagePositions(): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  return role === "ADMIN" || role === "HR";
}

/** 检查是否可以管理职位（管理员 或 HR） — 创建/编辑/删除 */
export async function canEditPosition(): Promise<boolean> {
  return canManagePositions();
}

/** 检查是否可以管理企业（管理员 或 HR） */
export async function canManageCompanies(): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  return role === "ADMIN" || role === "HR";
}
