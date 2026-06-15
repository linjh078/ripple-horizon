# CLAUDE.md — RippleHorizon（观澜知远）

## 项目概述

观澜知远（RippleHorizon）是一个面向广东石油化工学院师生/校友的校园知识共享平台。用户可以分享学习资源、在线课程、实用网站、考研考公经验、软件技巧、职场技能，以及校园周边生活信息。核心创新点：每个用户拥有个人空间和时间轴，展示在校经历与反思。

- **当前阶段：** MVP 完成，可投入生产使用
- **线上地址：** http://120.79.181.72:3000
- **代码仓库：** https://github.com/linjh078/ripple-horizon
- **目标用户：** 广东石油化工学院在校生、教师、校友
- **后续规划：** 多校分区扩展、鸿蒙/Android/iOS APP、AI 内容审核

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router, Turbopack) | 16.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.x |
| 组件库 | shadcn/ui (New York style, base-ui) | latest |
| 数据库 | SQLite (当前) → PostgreSQL (生产规划) | — |
| ORM | Prisma | v5.22 |
| 认证 | Auth.js v5 (Credentials + JWT) | 5.x beta |
| 部署 | 阿里云 ECS + PM2 | — |
| 动画 | framer-motion | latest |

## ⚠️ 记忆系统维护（每次会话必读）

**每次开发完成后，必须检查并更新以下记忆文件：**

1. **项目记忆文件**（位于 `.claude/projects/.../memory/`）：
   - `project-overview.md` — 技术栈、功能、线上地址变化时更新
   - `project-decisions.md` — 任何新架构决策必须记录
   - `project-status.md` — 完成事项、部署状态变化时更新
   - `deployment-plan.md` — 服务器信息、部署流程变化时更新
   - `coding-conventions.md` — 新增编码模式或规范变更时更新

2. **本项目文件**：
   - `CLAUDE.md`（本文件）— 技术栈、规范变化时更新
   - `ROADMAP.md` — 待办事项完成或新增时更新

**铁律：代码改了，记忆就要同步更新。不要让记忆文件落后超过一次会话。**

## 核心规范

### 1. 权限与身份系统（独立双维度）

```typescript
// role = 权限（控制操作能力）：USER（默认）| HR | ADMIN
// identity = 身份（描述实体身份）：STUDENT | ALUMNI | TEACHER | COUNSELOR | HR

// 注册：用户选 identity，role 固定为 USER
// 管理员：/admin/users 可修改 role（不可改 identity）
// 空间页：显示身份 Badge + 权限 Badge 双徽章
// 校友/在校生页：按 identity 过滤而非 role

// Server Component 获取：
import { auth } from "@/lib/auth";
const session = await auth();
const role = (session?.user as { role?: string; identity?: string })?.role;

// Client Component 获取：
const { data: session } = useSession();
const role = (session?.user as { role?: string })?.role;

// 权限检查：
import { canEdit, canDelete, canManagePositions, isAdmin } from "@/lib/permissions";
```

### 2. 数据流模式（三大模式，严格遵循）

**模式 A — Server Components 直读数据库（列表/详情页）**
```typescript
import { prisma } from "@/lib/prisma";
export default async function PostsPage() {
  const posts = await prisma.post.findMany({ ... });
  return posts.map(p => <PostCard key={p.id} post={p} />);
}
```

**模式 B — Server Actions 处理表单（创建/编辑/删除）**
```typescript
"use server";
export async function createPost(formData: FormData) { ... }
```

**模式 C — Client Components + API Routes（评论、评价等即时交互）**
```typescript
"use client";
fetch('/api/posts/...');
```

### 3. Dialog 弹窗表单模式（参照 OfflineEventForm）

发帖、发布活动等创建操作使用 Dialog 弹窗，不跳转到独立页面：

```tsx
"use client";
// 1. useSession() 检测登录（Client Component 专用）
// 2. Dialog + DialogTrigger（render prop）+ DialogContent
// 3. 未登录：onClick/onOpenChange → router.push("/login")
// 4. 表单：<form action={handleSubmit}> 调用 Server Action
// 5. 成功：toast.success + setOpen(false) + router.refresh()
// 6. 失败：toast.error(result.error)

// 参考：src/components/posts/post-dialog.tsx
// 参考：src/components/offline/event-form.tsx
```

### 4. 删除确认 Dialog 模式

**所有删除操作使用 shadcn Dialog 二次确认，禁止使用浏览器原生 confirm()：**

```tsx
// 通用组件：src/components/shared/delete-button.tsx
<DeleteButton action={deletePost} itemId={post.id} itemLabel={post.title} />

// 内联模式：src/components/space/delete-event-button.tsx
```

### 5. 命名约定

- 文件名：kebab-case（`post-card.tsx`）
- 组件名：PascalCase（`PostCard`）
- URL 路径：kebab-case（`/posts/new`, `/space/[userId]`）
- 中文优先：用户可见文案全部中文

### 6. shadcn/ui v4（base-ui）注意事项

- **不能用 `asChild`**！替代：`buttonVariants()` 应用到 Link 的 className，或用 `render` prop
- DialogTrigger：`<DialogTrigger render={<Button />}>`

## 重要注意事项

### Windows 开发
- 终端使用 Git Bash，不用 cmd.exe 或 PowerShell
- 路径分隔符用 `/`，不用 `\`

### 数据库
- **绝不删除 `prisma/dev.db`** — 包含所有开发数据
- 修改 schema → `npx prisma db push --accept-data-loss`
- `.gitignore` 已排除 `prisma/dev.db*` — 不会被 git 覆盖
- 部署前自动备份服务器数据库

### 认证
- `AUTH_SECRET` 在 `.env` 中，不可提交 Git
- Server Component：`await auth()`
- Client Component：`useSession()`
- JWT token 含 `sub`、`role`、`identity`

### 项目启动
```bash
npm run dev          # localhost:3000
npx prisma studio    # localhost:5555
npm run build        # 生产构建
```

### 关键文件索引
- [ROADMAP.md](ROADMAP.md) — 项目路线图（待办 P0-P3、多人协作、费用预估）
- [prisma/schema.prisma](prisma/schema.prisma) — 数据库模型（11 个模型，含索引）
- [src/lib/auth.ts](src/lib/auth.ts) — Auth.js v5 认证配置
- [src/lib/permissions.ts](src/lib/permissions.ts) — 权限检查工具
- [src/lib/validations.ts](src/lib/validations.ts) — Zod 验证 Schema
- [src/lib/rate-limit.ts](src/lib/rate-limit.ts) — 内存滑动窗口速率限制
- [src/middleware.ts](src/middleware.ts) — 安全响应头 + 缓存策略
- [.env.example](.env.example) — 环境变量模板（新开发者参考）
