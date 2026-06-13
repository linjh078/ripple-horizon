"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const name = formData.get("name") as string;
  const industry = (formData.get("industry") as string) || null;
  const description = formData.get("description") as string;
  const location = (formData.get("location") as string) || null;
  const website = (formData.get("website") as string) || null;

  if (!name || !description) return { error: "请填写企业名称和介绍" };

  try {
    await prisma.company.create({
      data: { name, industry, description, location, website },
    });
    revalidatePath("/companies");
    return { success: true };
  } catch {
    return { error: "创建失败，请稍后重试" };
  }
}

export async function createPosition(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const requirements = (formData.get("requirements") as string) || null;
  const companyId = formData.get("companyId") as string;

  if (!title || !description || !companyId) return { error: "请填写完整信息" };

  try {
    await prisma.position.create({
      data: { title, description, requirements, companyId },
    });
    revalidatePath(`/companies/${companyId}`);
    return { success: true };
  } catch {
    return { error: "创建失败，请稍后重试" };
  }
}
