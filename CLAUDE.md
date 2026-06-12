# CLAUDE.md — RippleHorizon（观澜知远）

## 项目概述

观澜知远（RippleHorizon）是一个面向广东石油化工学院师生/校友的校园知识共享平台。用户可以分享学习资源、在线课程、实用网站、考研考公经验、软件技巧、职场技能，以及校园周边生活信息。核心创新点：每个用户拥有个人空间和时间轴，展示在校经历与反思。

- **当前阶段：** MVP（最小可用版本），仅限本校
- **目标用户：** 广东石油化工学院在校生、教师、校友
- **后续规划：** 多校分区扩展、鸿蒙/Android/iOS APP、AI 内容审核

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.x |
| 组件库 | shadcn/ui (New York style) | latest |
| 数据库 | SQLite (开发) → PostgreSQL (生产) | — |
| ORM | Prisma | latest |
| 认证 | Auth.js v5 (Credentials + JWT) | 5.x (beta) |
| 部署 | Vercel | — |

## 核心规范

### 1. 数据流模式（三大模式，严格遵循）

本项目使用三种数据流模式，不得混用：

**模式 A — Server Components 直读数据库（列表/详情页）**
```typescript
// Server Component 中直接 await prisma.xxx.findMany()
// ✅ 用于：页面初始数据加载
// ❌ 不用于：任何需要交互的地方
import { prisma } from "@/lib/prisma";
export default async function PostsPage() {
  const posts = await prisma.post.findMany({ ... });
  return posts.map(p => <PostCard key={p.id} post={p} />);
}
```

**模式 B — Server Actions 处理表单（创建/编辑/删除）**
```typescript
// "use server" 函数，直接从 form action 调用
// ✅ 用于：表单提交、数据修改
// ❌ 不用于：不需要用户交互的数据读取
"use server";
export async function createPost(formData: FormData) { ... }
```

**模式 C — Client Components + API Routes（需要即时 UI 反馈）**
```typescript
// ✅ 用于：点赞、评论等需要乐观更新的交互
// ❌ 不用于：初始数据加载（直接用模式 A）
"use client";
const [data, setData] = useState(...);
fetch('/api/posts/...');
```

### 2. 命名约定

- 文件名：kebab-case（`post-card.tsx`, `comment-section.tsx`）
- 组件名：PascalCase（`PostCard`, `CommentSection`）
- 函数名：camelCase（`createPost`, `getUserProfile`）
- 数据库表名：PascalCase 单数（`Post`, `User`, `Comment`）
- URL 路径：kebab-case（`/posts/new`, `/space/[userId]`）
- 中文优先：面向用户的文案、表单标签、错误提示全部使用中文

### 3. 文件结构规则

- 共享组件放在 `src/components/shared/`
- 业务组件按功能模块分目录
- Server Actions 放在 `src/lib/actions/` 下按模块分文件
- 每个页面目录对应一个 URL 段
- 不要创建路由组 `(xxx)`，统一使用扁平路由结构

### 4. 状态处理铁律

**每个数据获取组件必须处理四种状态：**
- **Loading** — `<LoadingSkeleton />`
- **Empty** — `<EmptyState title="..." description="..." />`
- **Error** — `<ErrorState error={...} onRetry={...} />`
- **Success** — 正常渲染

### 5. 组件分类标签

| 标识 | 含义 |
|------|------|
| `"use server"` | Server Action 文件 |
| `"use client"` | Client Component |
| 无标识 | Server Component（默认） |

## 重要注意事项

### Windows 开发注意事项
- 终端使用 Git Bash，不要用 cmd.exe 或 PowerShell
- 换行符：仓库使用 LF，Windows 下 Git 自动转换
- 路径分隔符：代码中使用 `/`，不要使用 `\`
- 命令行不能交互时，使用非交互模式或 `echo` 管道

### 数据库
- **开发阶段绝不删除 `prisma/dev.db`** — 其中包含所有开发数据
- 修改 schema 后运行 `npx prisma db push`（不需要 migration）
- 使用 `npx prisma studio` 可视化浏览数据库
- 生产环境迁移前，将 provider 改为 `postgresql`

### 认证
- AUTH_SECRET 在 `.env` 中，绝不能提交到 Git
- 使用 `auth()` 在 Server Component 中获取会话
- 使用 `useSession()` 在 Client Component 中获取会话
- JWT 策略下 `auth()` 不会查询数据库（性能优势）

### 项目启动
```bash
npm run dev          # 启动开发服务器 (localhost:3000)
npx prisma studio    # 启动数据库浏览器 (localhost:5555)
npm run build        # 生产构建
```

### 相关文件
- [notes.md](notes.md) — 重要决策记录
- [prisma/schema.prisma](prisma/schema.prisma) — 数据库模型定义
- [src/lib/auth.ts](src/lib/auth.ts) — 认证配置
- [src/lib/prisma.ts](src/lib/prisma.ts) — 数据库客户端
- [src/middleware.ts](src/middleware.ts) — 路由保护
