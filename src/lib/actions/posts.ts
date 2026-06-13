"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageUrls = (formData.get("imageUrls") as string) || null;

  if (!title || !content || !category) {
    return { error: "请填写所有必填字段" };
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        category,
        imageUrls,
        authorId: session.user.id,
      },
    });
  } catch {
    return { error: "发布失败，请稍后重试" };
  }

  revalidatePath("/posts");
  redirect("/posts");
}
