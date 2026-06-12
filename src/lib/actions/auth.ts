"use server";

// ============================================================================
// 认证相关 Server Actions
// ============================================================================

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
  // 1. 解析 + 验证输入
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role: formData.get("role") as string,
    department: (formData.get("department") as string) || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, role, department } = parsed.data;

  // 2. 检查邮箱是否已被注册
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "该邮箱已被注册" };
  }

  // 3. 哈希密码并创建用户
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role,
      department,
    },
  });

  return { success: true };
}

// ⚠️ 备用 Server Action：当前客户端登录使用 next-auth/react 的 signIn，
// 此函数保留以备后续需要服务端登录的场景。
export async function loginUser(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "邮箱或密码错误" };
    }
    // NextAuth redirects by throwing — re-throw to allow redirect
    throw error;
  }
}
