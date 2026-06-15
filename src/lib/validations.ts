// ============================================================================
// 表单验证 Schema (Zod)
// 客户端即时反馈 + 服务端安全校验
// ============================================================================

import { z } from "zod";

// ─── 认证相关 ───────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z.string().min(2, "姓名至少2个字符").max(50, "姓名最多50个字符"),
    email: z.string().email("请输入有效邮箱"),
    password: z.string().min(6, "密码至少6个字符").max(100),
    confirmPassword: z.string(),
    identity: z.enum(["STUDENT", "ALUMNI", "TEACHER", "COUNSELOR", "HR"], {
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

// ─── 帖子相关 ───────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200, "标题最多200个字符"),
  content: z.string().min(1, "请输入内容").max(10000, "内容最多10000个字符"),
  category: z.enum([
    "EXAM_PREP",
    "ONLINE_COURSES",
    "WEBSITES",
    "SOFTWARE_TIPS",
    "STUDY_RESOURCES",
    "CAREER_SKILLS",
  ]),
  imageUrls: z.string().nullable().optional(),
});

const VALID_CATEGORIES = [
  "EXAM_PREP",
  "ONLINE_COURSES",
  "WEBSITES",
  "SOFTWARE_TIPS",
] as const;

// ─── 评论相关 ───────────────────────────────────────────

export const createCommentSchema = z.object({
  content: z.string().min(1, "请输入评论内容").max(2000, "评论最多2000个字符"),
});

// ─── 资料相关 ───────────────────────────────────────────

export const createMaterialSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200, "标题最多200个字符"),
  content: z.string().min(1, "请输入内容").max(10000, "内容最多10000个字符"),
  subjectId: z.string().min(1, "请选择学科"),
  imageUrls: z.string().nullable().optional(),
});

// ─── 线下活动相关 ───────────────────────────────────────

export const createEventSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200, "标题最多200个字符"),
  description: z.string().min(1, "请输入描述").max(5000, "描述最多5000个字符"),
  eventDate: z.string().min(1, "请选择日期"),
  location: z.string().min(1, "请输入地点").max(200, "地点最多200个字符"),
  category: z.string().max(50),
});

// ─── 生活周边相关 ──────────────────────────────────────

export const createSpotSchema = z.object({
  name: z.string().min(1, "请输入名称").max(100, "名称最多100个字符"),
  description: z.string().min(1, "请输入描述").max(3000, "描述最多3000个字符"),
  location: z.string().max(200).nullable().optional(),
  category: z.enum(["FOOD", "SHOP", "SERVICE", "ENTERTAINMENT"]),
  imageUrls: z.string().nullable().optional(),
});

// ─── 学科相关 ───────────────────────────────────────────

export const createSubjectSchema = z.object({
  name: z.string().min(1, "请输入学科名称").max(50, "学科名称最多50个字符"),
  department: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
});

// ─── 类型导出 ───────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateSpotInput = z.infer<typeof createSpotSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
