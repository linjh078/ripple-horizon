"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * 更新个人简介信息
 * 包括 department（院系）和 bio（个人介绍/留言）
 */
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const department = (formData.get("department") as string) || null;
  const bio = (formData.get("bio") as string) || null;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { department, bio },
    });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch {
    return { error: "更新失败，请稍后重试" };
  }
}
