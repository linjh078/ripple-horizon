# 观澜知远（RippleHorizon）— 项目路线图

> 最后更新：2026-06-15
> 服务器：120.79.181.72:3000
> 代码仓库：https://github.com/linjh078/ripple-horizon

---

## 一、当前状态

### ✅ 已完成
- 核心功能：帖子（发帖/评论/评价）、课程资源、考试升学、信息共享
- 企业招聘（公司+职位，HR可管理）、线下活动、校园周边、个人空间时间轴
- 用户系统：注册/登录、权限（管理员/HR/普通用户）+ 身份（在校生/校友/教师/辅导员/HR）分离
- 管理员后台：用户搜索、权限修改、删除用户
- 首页探索频道（视频进场动画）
- 安全基础：API 速率限制、安全响应头（CSP/X-Frame-Options 等）、bcrypt 密码哈希

### 🟢 可直接使用
网站核心功能完整，可以开始添加真实数据并向公众开放。初期 100-200 用户无压力。

---

## 二、待处理事项（按优先级排列）

### P0 — 使用前建议完成

#### 1. 环境变量安全化
- [ ] 生成生产环境 AUTH_SECRET：
  ```bash
  openssl rand -base64 32
  ```
- [ ] 替换服务器 `.env` 中的 `AUTH_SECRET` 值
- [ ] 创建 `.env.example` 文件（不含密钥，供新开发者参考）
- [ ] 确认 `.env` 在 `.gitignore` 中（当前已配置 ✅）

#### 2. 数据库自动备份
服务器上添加 cron 定时任务，每天凌晨 3 点备份数据库：
```bash
# SSH 到服务器后执行
crontab -e
# 添加这一行：
0 3 * * * cp /home/admin/ripple-horizon/prisma/dev.db /home/admin/ripple-horizon/prisma/backups/dev.db.$(date +\%Y\%m\%d)
```
- [ ] 创建 `/home/admin/ripple-horizon/prisma/backups/` 目录
- [ ] 添加 cron 任务

#### 3. 服务器防火墙检查
```bash
# 确认阿里云安全组只开放必要端口
# 必须：22 (SSH), 3000 (应用)
# 可选：80/443 (如果后续加 Nginx)
```

### P1 — 用户体验优化

#### 4. Server Actions 添加 Zod 校验
当前只有注册功能用了 Zod 验证，其他 action（发帖、评论、创建公司等）只做空值检查。
- [ ] `src/lib/actions/posts.ts` — createPost / updatePost 使用 `createPostSchema`
- [ ] `src/lib/actions/companies.ts` — 所有 action 添加 Zod
- [ ] `src/lib/actions/life.ts` — 所有 action 添加 Zod
- [ ] `src/lib/actions/subjects.ts` — 所有 action 添加 Zod

#### 5. Prisma 事务保护
读-改-写操作应包在 `$transaction` 中，防止并发竞态：
- [ ] deletePost / deleteComment / deleteCompany / deletePosition
- [ ] updatePost / updateCompany / updatePosition
- [ ] deleteUser（admin）

#### 6. 图片上传优化
- [ ] 上传前验证文件真实类型（读文件头魔数，不信任 MIME 类型）
- [ ] 添加文件大小限制的用户提示
- [ ] 定期清理未被引用的上传文件

#### 7. 首页 `/posts` 页面导航缺失
当前顶部导航栏没有指向 `/posts`（帖子发现页）的链接。
- [ ] 在 `navbar.tsx` 和 `local-nav.tsx` 中添加 `/posts` 导航链接

#### 8. 登录页显示注册成功提示
- [ ] `login/page.tsx` 检查 URL 参数 `?registered=true`，显示"注册成功，请登录"提示

### P2 — 生产环境升级（用户量上来前）

#### 9. SQLite → PostgreSQL 迁移
这是最重要的基础设施升级。SQLite 在并发写入时性能差，不适合多用户同时使用。

**方案 A：阿里云 RDS PostgreSQL（推荐）**
- 费用：最低配 ~¥70/月
- 自动备份、监控、高可用
- 迁移步骤：
  ```bash
  # 1. 阿里云控制台创建 RDS PostgreSQL 实例
  # 2. 修改 .env:
  #    DATABASE_URL="postgresql://user:password@xxx.rds.aliyuncs.com:5432/ripplehorizon"
  # 3. prisma/schema.prisma 中 provider 改为 "postgresql"
  # 4. npx prisma db push
  # 5. 数据迁移（导出 SQLite → 导入 PostgreSQL）
  ```

**方案 B：服务器自建 PostgreSQL**
- 在 ECS 上直接安装 PostgreSQL
- 需要手动管理备份、监控

#### 10. 图片存储迁移到 OSS
当前图片存在服务器本地 `public/uploads/`，存在磁盘满风险。
- [ ] 阿里云 OSS + CDN 开通
- [ ] 上传接口改为上传到 OSS
- [ ] 前端图片 URL 改为 CDN 地址
- [ ] 清理本地 `public/uploads/` 旧文件

#### 11. Redis 缓存层
- [ ] 阿里云 Redis（最低配 ~¥30/月）或服务器自建
- [ ] 将速率限制从内存 Map 迁移到 Redis（多实例共享）
- [ ] 热数据缓存（首页帖子列表等）

### P3 — 规模化（200+ 同时在线）

#### 12. 服务器升级
- [ ] 阿里云 ECS 升配至 4vCPU/8GB（~¥200/月）
- [ ] 或增加 1 台 ECS + 负载均衡 SLB

#### 13. Nginx 反向代理
```bash
# 安装 Nginx，配置反向代理
# 好处：静态文件缓存、SSL 终止、gzip 压缩
# 80/443 → localhost:3000
```

#### 14. HTTPS 证书
- [ ] 阿里云免费 SSL 证书 或 Let's Encrypt
- [ ] 配置 Nginx SSL

#### 15. 监控和日志
- [ ] 阿里云云监控（免费，CPU/内存/磁盘告警）
- [ ] PM2 日志轮转：`pm2 install pm2-logrotate`
- [ ] 错误追踪：Sentry 免费版 或 自建日志系统

---

## 三、多人协作开发

### 环境搭建（新开发者）
```bash
# 1. 克隆仓库
git clone git@github.com:linjh078/ripple-horizon.git
cd ripple-horizon

# 2. 安装依赖
npm install

# 3. 创建环境变量（向管理员要 AUTH_SECRET）
cp .env.example .env
# 编辑 .env，填入：
#   DATABASE_URL="file:./dev.db"
#   AUTH_SECRET="xxx"

# 4. 初始化数据库
npx prisma db push

# 5. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 分支策略
```
master           ← 生产环境（部署到 120.79.181.72）
  └─ develop     ← 开发主线（日常开发在此合并）
       ├─ feat/功能名   ← 新功能分支
       ├─ fix/问题描述  ← Bug 修复分支
       └─ refactor/xxx  ← 重构分支
```

### 工作流程
1. 从 `develop` 创建功能分支
2. 开发 → 本地测试 → 提交 commit
3. Push 到 GitHub → 创建 Pull Request
4. 代码审查 → 合并到 `develop`
5. 测试通过 → 合并到 `master` → 自动/手动部署

### 建议添加的文件
- [ ] `CONTRIBUTING.md` — 贡献指南（代码规范、commit 格式）
- [ ] `.env.example` — 环境变量模板（不含真实密钥）
- [ ] `.github/workflows/ci.yml` — CI 自动构建检查

### 代码规范（已有）
- 文件名：kebab-case
- 组件名：PascalCase
- 数据流：Server Components 直读 DB / Server Actions 处理表单 / Client + API 即时反馈
- 中文优先：所有面向用户的文案使用中文
- 详见：`CLAUDE.md`

---

## 四、部署流程

### 当前部署方式
```bash
# 本地 → GitHub → 服务器
git add -A
git commit -m "描述改动"
git push origin master

# SSH 到服务器
ssh root@120.79.181.72
su - admin -c 'cd /home/admin/ripple-horizon && git pull origin master'
su - admin -c 'cd /home/admin/ripple-horizon && npx prisma db push --accept-data-loss'
su - admin -c 'cd /home/admin/ripple-horizon && rm -rf .next && npm run build && pm2 restart ripple-horizon'
```

### 服务器信息
| 项目 | 值 |
|------|-----|
| IP | 120.79.181.72 |
| 系统 | Alibaba Cloud Linux 3 |
| 用户 | admin（应用运行用户） |
| 应用路径 | /home/admin/ripple-horizon |
| 进程管理 | PM2（`pm2 list` 查看状态） |
| 端口 | 3000 |
| 数据库 | /home/admin/ripple-horizon/prisma/dev.db |

### PM2 常用命令
```bash
pm2 list              # 查看进程状态
pm2 logs ripple-horizon  # 查看日志
pm2 restart ripple-horizon  # 重启
pm2 monit             # 实时监控
```

---

## 五、费用预估

| 阶段 | 服务 | 月费（估算） |
|------|------|-------------|
| 当前 | 阿里云 ECS 2vCPU/4GB | ~¥70 |
| P2 | + RDS PostgreSQL 最低配 | +¥70 |
| P2 | + OSS + CDN | +¥10 |
| P2 | + Redis 最低配 | +¥30 |
| P3 | ECS 升配 4vCPU/8GB | +¥130 |
| **P3 合计** | | **~¥310/月** |

---

## 六、下次继续推进

将此文件和新需求一起发给 Claude，Claude 会：
1. 读取本文件了解项目全貌
2. 按照优先级继续推进待办事项
3. 自动完成代码修改、测试、部署
