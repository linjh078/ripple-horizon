"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      data: {
        title,
        content,
        imageUrls: imageUrls || null,
        subjectId,
        authorId: session.user.id,
      },
    });
    revalidatePath(`/courses/${subjectId}`);
    return { success: true };
  } catch {
    return { error: "上传失败，请稍后重试" };
  }
}
