"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_ROLES = ["USER", "HR", "ADMIN"];

/** 确保当前用户是管理员 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("请先登录");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") throw new Error("无权访问");
  return session.user.id;
}

/** 获取所有用户列表（支持搜索） */
export async function getUsers(search?: string) {
  await requireAdmin();

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { userNumber: { contains: search } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      identity: true,
      userNumber: true,
      department: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { users };
}

/** 修改用户角色 */
export async function updateUserRole(formData: FormData) {
  try {
    await requireAdmin();

    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;

    if (!userId || !role) return { error: "缺少参数" };
    if (!VALID_ROLES.includes(role)) return { error: "无效的角色" };

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    if ((e as Error).message === "无权访问") return { error: "无权访问" };
    return { error: "修改失败，请稍后重试" };
  }
}

/** 删除用户 */
export async function deleteUser(formData: FormData) {
  try {
    const adminId = await requireAdmin();

    const userId = formData.get("userId") as string;
    if (!userId) return { error: "缺少用户 ID" };

    // 不能删除自己
    if (userId === adminId) return { error: "不能删除自己的账户" };

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    if ((e as Error).message === "无权访问") return { error: "无权访问" };
    return { error: "删除失败，请稍后重试" };
  }
}
