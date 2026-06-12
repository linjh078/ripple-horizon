# 重要决策记录 — RippleHorizon（观澜知远）

## 决策 1：选择 Next.js 16 全栈方案

**日期：** 2026-06-12
**背景：** 用户零 Web 开发经验，希望项目符合现代潮流，能尽快展示成果。
**选项：**
- A. Django 全栈（Python，学习曲线最平缓）
- B. Vue 3 + FastAPI（前后端分离，需学两套）
- C. Next.js 全栈（最流行，JavaScript/TypeScript 生态）

**结论：** 选择方案 C。
**理由：**
1. Next.js 是 2026 年最流行的全栈框架，简历价值最高
2. App Router + Server Components 是未来方向
3. 一个项目覆盖前端、后端、数据库，学习密度高
4. Vercel 免费部署，零运维成本
5. 鸿蒙 APP 可通过 API 复用后端逻辑（HTTP 标准协议）

**影响：** 需要用 TypeScript（类型系统类似 C），学习曲线较陡但可迁移。

---

## 决策 2：SQLite 作为开发数据库

**日期：** 2026-06-12
**理由：**
1. 零配置：不需要安装数据库服务、不需要 Docker
2. 单文件存储（`prisma/dev.db`），方便备份
3. Prisma 抽象了差异，生产切 PostgreSQL 只需改一行配置
4. 开发阶段数据量小，SQLite 完全够用

---

## 决策 3：扁平路由结构

**日期：** 2026-06-12
**理由：**
1. 避免路由组 `(auth)` `(main)` 带来的概念复杂度
2. 单根 layout 条件渲染比多层 layout 更容易理解
3. 后续如需分组，重构成本低（只需创建目录移动文件）

---

## 决策 4：Auth.js Credentials Provider + JWT

**日期：** 2026-06-12
**理由：**
1. MVP 只需邮箱密码登录，不需要 OAuth（微信/QQ等）
2. JWT 策略：Session 存在浏览器 Cookie 中，不查数据库
3. 保留了 Prisma Adapter 模型，未来无缝添加 OAuth
4. 不需要配置第三方开发者平台，即刻可用

---

## 决策 5：Server Actions 优先于 API Routes

**日期：** 2026-06-12
**判断标准：**
- 需要即时 UI 反馈（点赞、评论）→ API Route + Client Component
- 表单提交后跳转/刷新（创建帖子）→ Server Action
- 页面数据加载（列表、详情）→ Server Component 直读 Prisma

这个标准是经过深思熟虑的，不要随意打破。

---

## 决策 6：MVP 不做图片上传

**日期：** 2026-06-12
**理由：**
1. 文件上传需要对象存储（Vercel Blob / S3），增加复杂度和成本
2. MVP 使用图片 URL 文本字段，用户可粘贴外部链接
3. 后期可接入 Vercel Blob 或 UploadThing

---

## 决策 7：使用 Prisma v5（非 v7）

**日期：** 2026-06-12
**背景：** 最初安装 Prisma v7，但其新的 client engine 强制要求使用 driver adapter，在 Windows + SQLite 上出现兼容性问题（URL 解析、ESM/CJS 互操作等），经反复调试无法稳定运行。
**结论：** 降级至 Prisma v5.22.0。
**理由：**
1. v5 原生支持 SQLite，不需要 adapter
2. `new PrismaClient()` 开箱即用，无需额外配置
3. 稳定可靠，社区资料丰富
4. 生产环境切换到 PostgreSQL 成本低（改一行 provider）
5. 对初学者友好，减少不必要的概念负担

**影响：** 使用 `@prisma/client` 而非自定义生成路径；SQLite 不支持 enum，改用 String + 应用层约束。

---

## 后续规划（按优先级排列）

### 🔴 Phase 1.5（部署 — 下一步）
0. **Vercel 部署** — GitHub 推送 + Vercel Postgres + 环境变量配置

### 🔵 Phase 2（MVP 完成后）
1. **AI 内容审核** — 调用大模型 API 自动审核帖子内容
2. **举报/下架功能** — 用户举报 + 管理员下架
3. **优质内容突出展示** — 高赞帖子首页推荐位
4. **Markdown 渲染** — 使用 react-markdown 渲染帖子内容

### 🟢 Phase 3（多端扩展）
5. **鸿蒙 APP 开发** — 使用 ArkUI + HTTP 调用现有 API
6. **共用 API 层重构** — 确保后端 API 对所有端一致

### 🟡 Phase 4（规模化）
7. **多校分区** — 学校选择 + 分校内容隔离
8. **iOS / Android APP** — React Native 或 Flutter
9. **OAuth 登录** — 微信/QQ 快捷登录

---

## 技术债务记录

- [ ] 密码重置功能（MVP 不做，用户量小可手动处理）
- [ ] 邮箱验证（MVP 注册即可用，后期加验证流程）
- [ ] 用户头像上传（当前使用首字母头像）
- [ ] 帖子搜索功能
- [ ] 通知系统（评论/点赞通知）
- [ ] 数据导出功能
