import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 权限检查工具
 *
 * 通用规则：
 * - 删除：发布者本人 或 管理员
 * - 修改：仅发布者本人（管理员不能修改他人内容）
 *
 * 职位特殊规则：
 * - 发布/删除：HR 或 管理员
 * - 修改：仅 HR（管理员不能修改职位）
 *
 * 企业特殊规则：
 * - 创建/删除：HR 或 管理员
 * - 修改：仅创建者本人
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

/** 检查是否可以删除（发布者本人 或 管理员） */
export async function canDelete(authorId: string): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  if (userId === authorId) return true;
  return role === "ADMIN";
}

/** 检查是否可以修改（仅发布者本人，管理员不能改） */
export async function canEdit(authorId: string): Promise<boolean> {
  const { userId } = await getUserRole();
  if (!userId) return false;
  return userId === authorId;
}

/** 检查是否可以管理职位（HR 或 管理员） */
export async function canManagePositions(): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  return role === "HR" || role === "ADMIN";
}

/** 检查是否可以修改职位（仅 HR，管理员不能改） */
export async function canEditPosition(): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  return role === "HR";
}

/** 检查是否可以管理企业（HR 或 管理员） */
export async function canManageCompanies(): Promise<boolean> {
  const { role, userId } = await getUserRole();
  if (!userId) return false;
  return role === "HR" || role === "ADMIN";
}
