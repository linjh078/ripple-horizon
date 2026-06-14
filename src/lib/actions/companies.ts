"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDelete, canEdit } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// ─── 企业 ───────────────────────────────────────────────

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
      data: { name, industry, description, location, website, creatorId: session.user.id },
    });
    revalidatePath("/companies");
    return { success: true };
  } catch {
    return { error: "创建失败，请稍后重试" };
  }
}

export async function deleteCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少企业 ID" };

  try {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) return { error: "企业不存在" };
    if (!company.creatorId) return { error: "该企业无创建者信息，无法删除" };
    if (!(await canDelete(company.creatorId))) return { error: "无权删除此企业" };

    await prisma.company.delete({ where: { id } });
    revalidatePath("/companies");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updateCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  if (!id) return { error: "缺少企业 ID" };

  try {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) return { error: "企业不存在" };
    if (!company.creatorId) return { error: "该企业无创建者信息，无法修改" };
    if (!(await canEdit(company.creatorId))) return { error: "无权修改此企业信息" };

    const name = formData.get("name") as string;
    const industry = (formData.get("industry") as string) || null;
    const description = formData.get("description") as string;
    const location = (formData.get("location") as string) || null;
    const website = (formData.get("website") as string) || null;

    if (!name || !description) return { error: "请填写企业名称和介绍" };

    await prisma.company.update({
      where: { id },
      data: { name, industry, description, location, website },
    });
    revalidatePath("/companies");
    revalidatePath(`/companies/${id}`);
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}

// ─── 职位 ───────────────────────────────────────────────

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
      data: { title, description, requirements, companyId, creatorId: session.user.id },
    });
    revalidatePath(`/companies/${companyId}`);
    revalidatePath("/companies");
    return { success: true };
  } catch {
    return { error: "创建失败，请稍后重试" };
  }
}

export async function deletePosition(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  const companyId = formData.get("companyId") as string;
  if (!id) return { error: "缺少职位 ID" };

  try {
    const position = await prisma.position.findUnique({ where: { id } });
    if (!position) return { error: "职位不存在" };
    if (!position.creatorId) return { error: "该职位无创建者信息，无法删除" };
    if (!(await canDelete(position.creatorId))) return { error: "无权删除此职位" };

    await prisma.position.delete({ where: { id } });
    if (companyId) {
      revalidatePath(`/companies/${companyId}`);
    }
    revalidatePath("/companies");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "删除失败，请稍后重试" };
  }
}

export async function updatePosition(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };
  const id = formData.get("id") as string;
  const companyId = formData.get("companyId") as string;

  if (!id || !companyId) return { error: "缺少职位或企业 ID" };

  try {
    const position = await prisma.position.findUnique({ where: { id } });
    if (!position) return { error: "职位不存在" };
    if (!position.creatorId) return { error: "该职位无创建者信息，无法修改" };
    if (!(await canEdit(position.creatorId))) return { error: "无权修改此职位" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const requirements = (formData.get("requirements") as string) || null;

    if (!title || !description) return { error: "请填写完整信息" };

    await prisma.position.update({
      where: { id },
      data: { title, description, requirements },
    });
    revalidatePath(`/companies/${companyId}`);
    revalidatePath("/companies");
    return { success: true };
  } catch (e) {
    if ((e as { error?: string })?.error) return e as { error: string };
    return { error: "更新失败，请稍后重试" };
  }
}
