"use server";

// ============================================================================
// 校园周边 + 人生事件 + 线下活动 Server Actions
// ============================================================================

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDelete, canEdit } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// ─── 校园周边 ───────────────────────────────────────────

export async function createLifeSpot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const location = (formData.get("location") as string) || null;
  const imageUrls = (formData.get("imageUrls") as string) || null;

  if (!name || !description || !category) return { error: "请填写完整的店铺信息" };
  if (name.length > 50) return { error: "店铺名称不能超过50个字符" };

  try {
    await prisma.lifeSpot.create({
      data: { name, description, category, location, imageUrls, submittedById: session.user.id },
    });
    revalidatePath("/life");
    return { success: true };
  } catch {
    return { error: "添加失败，请稍后重试" };
  }
}

export async function deleteLifeSpot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少地点 ID" };

  try {
    const spot = await prisma.lifeSpot.findUnique({ where: { id } });
    if (!spot) return { error: "地点不存在" };
    if (!(await canDelete(spot.submittedById))) return { error: "无权删除此地点的信息" };

    await prisma.lifeSpot.delete({ where: { id } });
    revalidatePath("/life");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updateLifeSpot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少地点 ID" };

  try {
    const spot = await prisma.lifeSpot.findUnique({ where: { id } });
    if (!spot) return { error: "地点不存在" };
    if (!(await canEdit(spot.submittedById))) return { error: "无权修改此地点的信息" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const location = (formData.get("location") as string) || null;
    const imageUrls = (formData.get("imageUrls") as string) || null;

    if (!name || !description || !category) return { error: "请填写完整的店铺信息" };
    if (name.length > 50) return { error: "店铺名称不能超过50个字符" };

    await prisma.lifeSpot.update({
      where: { id },
      data: { name, description, category, location, imageUrls },
    });
    revalidatePath("/life");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}

// ─── 人生事件 ───────────────────────────────────────────

export async function createLifeEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const eventDate = formData.get("eventDate") as string;
  const imageUrls = (formData.get("imageUrls") as string) || null;

  if (!title || !content || !eventDate) return { error: "请填写完整的事件信息" };
  if (title.length > 50) return { error: "标题不能超过50个字符" };

  try {
    await prisma.lifeEvent.create({
      data: { title, content, eventDate: new Date(eventDate), imageUrls, userId: session.user.id },
    });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch {
    return { error: "添加失败，请稍后重试" };
  }
}

export async function deleteLifeEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少事件 ID" };

  try {
    const event = await prisma.lifeEvent.findUnique({ where: { id } });
    if (!event) return { error: "事件不存在" };
    if (!(await canDelete(event.userId))) return { error: "无权删除此事件" };

    await prisma.lifeEvent.delete({ where: { id } });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updateLifeEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少事件 ID" };

  try {
    const event = await prisma.lifeEvent.findUnique({ where: { id } });
    if (!event) return { error: "事件不存在" };
    if (!(await canEdit(event.userId))) return { error: "无权修改此事件" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const eventDate = formData.get("eventDate") as string;
    const imageUrls = (formData.get("imageUrls") as string) || null;

    if (!title || !content || !eventDate) return { error: "请填写完整的事件信息" };
    if (title.length > 50) return { error: "标题不能超过50个字符" };

    await prisma.lifeEvent.update({
      where: { id },
      data: { title, content, eventDate: new Date(eventDate), imageUrls },
    });
    revalidatePath(`/space/${session.user.id}`);
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}

// ─── 线下活动 ───────────────────────────────────────────

export async function createOfflineEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const location = (formData.get("location") as string) || null;
  const category = (formData.get("category") as string) || "沙龙";

  if (!title || !description || !eventDate) return { error: "请填写标题、描述和时间" };
  if (title.length > 50) return { error: "标题不能超过50个字符" };

  try {
    await prisma.offlineEvent.create({
      data: { title, description, eventDate: new Date(eventDate), location, category, authorId: session.user.id },
    });
    revalidatePath("/offline");
    return { success: true };
  } catch {
    return { error: "发布失败，请稍后重试" };
  }
}

export async function deleteOfflineEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少活动 ID" };

  try {
    const event = await prisma.offlineEvent.findUnique({ where: { id } });
    if (!event) return { error: "活动不存在" };
    if (!(await canDelete(event.authorId))) return { error: "无权删除此活动" };

    await prisma.offlineEvent.delete({ where: { id } });
    revalidatePath("/offline");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updateOfflineEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少活动 ID" };

  try {
    const event = await prisma.offlineEvent.findUnique({ where: { id } });
    if (!event) return { error: "活动不存在" };
    if (!(await canEdit(event.authorId))) return { error: "无权修改此活动" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const eventDate = formData.get("eventDate") as string;
    const location = (formData.get("location") as string) || null;
    const category = (formData.get("category") as string) || "沙龙";

    if (!title || !description || !eventDate) return { error: "请填写标题、描述和时间" };
    if (title.length > 50) return { error: "标题不能超过50个字符" };

    await prisma.offlineEvent.update({
      where: { id },
      data: { title, description, eventDate: new Date(eventDate), location, category },
    });
    revalidatePath("/offline");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}
