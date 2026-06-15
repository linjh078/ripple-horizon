"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDelete, canEdit } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageUrls = (formData.get("imageUrls") as string) || null;

  if (!title || !content || !category) return { error: "请填写所有必填字段" };

  try {
    await prisma.post.create({
      data: { title, content, category, imageUrls, authorId: session.user.id },
    });
  } catch {
    return { error: "发布失败，请稍后重试" };
  }

  revalidatePath("/posts");
  revalidatePath("/exams");
  revalidatePath("/resources");
  return { success: true };
}

export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少帖子 ID" };

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return { error: "帖子不存在" };
    if (!(await canDelete(post.authorId))) return { error: "无权删除此帖子" };

    await prisma.post.delete({ where: { id } });
    revalidatePath("/posts");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updatePost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少帖子 ID" };

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return { error: "帖子不存在" };
    if (!(await canEdit(post.authorId))) return { error: "无权修改此帖子" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;

    if (!title || !content || !category) return { error: "请填写所有必填字段" };

    await prisma.post.update({
      where: { id },
      data: { title, content, category },
    });
    revalidatePath(`/posts/${id}`);
    revalidatePath("/posts");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}

export async function deleteComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少评论 ID" };

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return { error: "评论不存在" };
    if (!(await canDelete(comment.authorId))) return { error: "无权删除此评论" };

    await prisma.comment.delete({ where: { id } });
    revalidatePath(`/posts/${comment.postId}`);
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}
