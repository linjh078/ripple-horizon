"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("请先登录");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;

  if (!title || !content || !category) {
    throw new Error("请填写所有必填字段");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      category,
      authorId: session.user.id,
    },
  });

  revalidatePath("/posts");
  redirect("/posts");
}
