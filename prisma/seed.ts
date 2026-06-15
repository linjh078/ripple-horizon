// ============================================================================
// 种子数据脚本 — Prisma v5
// 运行: npx tsx prisma/seed.ts
// ============================================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始播种数据...\n");

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "张三",
      email: "alice@example.com",
      role: "STUDENT",
      department: "计算机学院",
      bio: "2022级计算机科学与技术专业，热爱编程与分享。",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "李四",
      email: "bob@example.com",
      role: "TEACHER",
      department: "电子信息工程学院",
      bio: "电子信息工程学院教师，主讲数字信号处理与嵌入式系统。",
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@example.com" },
    update: {},
    create: {
      name: "王五",
      email: "carol@example.com",
      role: "ALUMNI",
      department: "化学工程学院",
      bio: "2020届毕业生，目前在深圳从事新能源研发工作。",
    },
  });

  console.log(`✅ 创建用户: ${alice.name}, ${bob.name}, ${carol.name}`);

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "C语言期末复习资料整理",
        content: "整理了近三年的C语言期末考试题和答案，涵盖指针、结构体、文件操作等重点章节。",
        category: "STUDY_RESOURCES",
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "B站宝藏UP主推荐：小鱼教你C语言",
        content: "讲解非常清晰，从零基础到进阶都有，配图生动，每集10分钟。",
        category: "ONLINE_COURSES",
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "发现了一个超好用的编程学习网站 — C语言中文网",
        content: "覆盖C、C++、Java、Python等主流语言教程。链接：https://c.biancheng.net/",
        category: "WEBSITES",
        authorId: carol.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "考研数学一经验分享（130分）",
        content: "推荐：张宇高数18讲、李永乐线代讲义、王式安概率统计。",
        category: "EXAM_PREP",
        authorId: bob.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "实习心得：从学生到职场新人的转变",
        content: "在深圳实习三个月。Git版本控制是必备技能，沟通能力比技术更重要。",
        category: "CAREER_SKILLS",
        authorId: carol.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "VS Code 必备插件推荐",
        content: "GitHub Copilot、Prettier、ESLint、GitLens、Material Icon Theme、Todo Tree。",
        category: "SOFTWARE_TIPS",
        authorId: alice.id,
      },
    }),
  ]);

  console.log(`✅ 创建 ${posts.length} 条帖子`);

  await prisma.comment.createMany({
    data: [
      { content: "太有用了！正好期末复习需要！", postId: posts[0].id, authorId: bob.id },
      { content: "这个UP主我也关注了，讲得真的好！", postId: posts[1].id, authorId: bob.id },
      { content: "C语言中文网确实不错！", postId: posts[2].id, authorId: alice.id },
    ],
  });

  console.log("✅ 创建评论");

  await prisma.lifeEvent.createMany({
    data: [
      { title: "入学广东石油化工学院", content: "选择了计算机科学与技术专业。", eventDate: new Date("2022-09-01"), userId: alice.id },
      { title: "第一次参加编程竞赛", content: "蓝桥杯广东省二等奖。", eventDate: new Date("2023-04-15"), userId: alice.id },
      { title: "完成第一个开源项目", content: "基于STM32的智能家居控制系统，收获50个star。", eventDate: new Date("2024-01-20"), userId: alice.id },
      { title: "进入深圳某科技公司实习", content: "新能源公司的软件开发实习岗位。", eventDate: new Date("2020-07-01"), userId: carol.id },
    ],
  });

  console.log("✅ 创建人生事件");

  await prisma.lifeSpot.createMany({
    data: [
      { name: "阿强美食", description: "老牌快餐店，煲仔饭和炒牛河，人均15-20元。", category: "FOOD", location: "学校北门对面小巷内50米", submittedById: alice.id },
      { name: "书香阁奶茶", description: "适合自习的奶茶店，有WiFi和插座。", category: "FOOD", location: "学校东门左侧100米", submittedById: bob.id },
      { name: "便捷打印店", description: "打印0.2元/页，支持微信传文件。", category: "SERVICE", location: "学校南门商业街2号铺", submittedById: alice.id },
    ],
  });

  console.log("✅ 创建校园周边");
  console.log("\n🎉 种子数据创建完成！");
}

main()
  .catch((e) => {
    console.error("❌ 播种失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
