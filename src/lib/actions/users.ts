"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * 更新个人介绍（院系 + 专业班级）
 * 院系必填
 */
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const department = (formData.get("department") as string)?.trim() || null;
  const major = (formData.get("major") as string)?.trim() || null;

  if (!department) return { error: "请填写院系" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { department, major },
    });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch {
    return { error: "更新失败，请稍后重试" };
  }
}

/**
 * 更新留言板（给来访者的话）
 * 独立于个人介绍，不会互相覆盖
 */
export async function updateBio(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const bio = (formData.get("bio") as string)?.trim() || null;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { bio },
    });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch {
    return { error: "更新失败，请稍后重试" };
  }
}
