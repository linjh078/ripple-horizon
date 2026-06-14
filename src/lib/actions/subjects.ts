"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDelete, canEdit } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// ─── 学科 ───────────────────────────────────────────────

export async function createSubject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const name = formData.get("name") as string;
  const department = (formData.get("department") as string) || null;
  const description = (formData.get("description") as string) || null;

  if (!name) return { error: "请填写学科名称" };
  if (name.length > 50) return { error: "学科名称不能超过50个字符" };

  try {
    await prisma.subject.create({
      data: { name, department, description, authorId: session.user.id },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch {
    return { error: "创建失败，请稍后重试" };
  }
}

export async function deleteSubject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少学科 ID" };

  try {
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) return { error: "学科不存在" };
    if (!(await canDelete(subject.authorId))) return { error: "无权删除此学科" };

    await prisma.subject.delete({ where: { id } });
    revalidatePath("/courses");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updateSubject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少学科 ID" };

  try {
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) return { error: "学科不存在" };
    if (!(await canEdit(subject.authorId))) return { error: "无权修改此学科" };

    const name = formData.get("name") as string;
    const department = (formData.get("department") as string) || null;
    const description = (formData.get("description") as string) || null;

    if (!name) return { error: "请填写学科名称" };
    if (name.length > 50) return { error: "学科名称不能超过50个字符" };

    await prisma.subject.update({
      where: { id },
      data: { name, department, description },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}

// ─── 学习资料 ───────────────────────────────────────────

export async function uploadMaterial(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrls = formData.get("imageUrls") as string;
  const subjectId = formData.get("subjectId") as string;

  if (!title || !content || !subjectId) return { error: "请填写完整信息" };

  try {
    await prisma.subjectMaterial.create({
      data: { title, content, imageUrls: imageUrls || null, subjectId, authorId: session.user.id },
    });
    revalidatePath(`/courses/${subjectId}`);
    revalidatePath("/courses");
    return { success: true };
  } catch {
    return { error: "上传失败，请稍后重试" };
  }
}

export async function deleteMaterial(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少资料 ID" };

  try {
    const material = await prisma.subjectMaterial.findUnique({ where: { id } });
    if (!material) return { error: "资料不存在" };
    if (!(await canDelete(material.authorId))) return { error: "无权删除此资料" };

    await prisma.subjectMaterial.delete({ where: { id } });
    revalidatePath(`/courses/${material.subjectId}`);
    revalidatePath("/courses");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updateMaterial(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少资料 ID" };

  try {
    const material = await prisma.subjectMaterial.findUnique({ where: { id } });
    if (!material) return { error: "资料不存在" };
    if (!(await canEdit(material.authorId))) return { error: "无权修改此资料" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrls = (formData.get("imageUrls") as string) || null;

    if (!title || !content) return { error: "请填写标题和内容" };

    await prisma.subjectMaterial.update({
      where: { id },
      data: { title, content, imageUrls },
    });
    revalidatePath(`/courses/${material.subjectId}`);
    revalidatePath("/courses");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}
