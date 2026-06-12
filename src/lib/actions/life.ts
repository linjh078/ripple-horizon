"use server";

// ============================================================================
// 校园周边 + 人生事件 Server Actions
// ============================================================================

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLifeSpot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const location = (formData.get("location") as string) || null;

  if (!name || !description || !category) {
    return { error: "请填写完整的店铺信息" };
  }

  if (name.length > 50) {
    return { error: "店铺名称不能超过50个字符" };
  }

  try {
    await prisma.lifeSpot.create({
      data: {
        name,
        description,
        category,
        location,
        submittedById: session.user.id,
      },
    });
    revalidatePath("/life");
    return { success: true };
  } catch {
    return { error: "添加失败，请稍后重试" };
  }
}

export async function createLifeEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const eventDate = formData.get("eventDate") as string;

  if (!title || !content || !eventDate) {
    return { error: "请填写完整的事件信息" };
  }

  if (title.length > 50) {
    return { error: "标题不能超过50个字符" };
  }

  try {
    await prisma.lifeEvent.create({
      data: {
        title,
        content,
        eventDate: new Date(eventDate),
        userId: session.user.id,
      },
    });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch {
    return { error: "添加失败，请稍后重试" };
  }
}
