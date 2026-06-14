// ============================================================================
// 表单验证 Schema (Zod)
// 客户端即时反馈 + 服务端安全校验
// ============================================================================

import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "姓名至少2个字符").max(50, "姓名最多50个字符"),
    email: z.string().email("请输入有效邮箱"),
    password: z.string().min(6, "密码至少6个字符").max(100),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "TEACHER", "ALUMNI", "HR"], {
      message: "请选择身份",
    }),
    department: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
