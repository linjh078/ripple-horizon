// ============================================================================
// 一次性数据迁移：role+identity 分离
// 运行方式：npx tsx prisma/migrate-role-identity.ts
// ✅ 已于 2026-06-15 执行完毕，无需再次运行
// ============================================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 根据 userNumber 前缀推导身份 */
function deriveIdentity(userNumber: string | null): string {
  if (!userNumber) return "STUDENT"; // 兜底
  const prefix = userNumber.charAt(0).toUpperCase();
  const map: Record<string, string> = {
    U: "STUDENT",
    A: "ALUMNI",
    T: "TEACHER",
    H: "HR",
    C: "COUNSELOR",
  };
  return map[prefix] || "STUDENT";
}

/** 旧 role → 新 role 映射 */
function deriveRole(oldRole: string): string {
  // ADMIN 和 HR 保持权限，其余全部降为 USER
  if (oldRole === "ADMIN") return "ADMIN";
  if (oldRole === "HR") return "HR";
  return "USER";
}

async function main() {
  console.log("开始数据迁移...\n");

  const users = await prisma.user.findMany();
  console.log(`找到 ${users.length} 个用户\n`);

  for (const user of users) {
    const newIdentity = deriveIdentity(user.userNumber);
    const newRole = deriveRole(user.role);

    console.log(
      `  ${user.name} (${user.email})`
    );
    console.log(
      `    旧 role: ${user.role}, userNumber: ${user.userNumber}`
    );
    console.log(
      `    新 role: ${newRole}, identity: ${newIdentity}`
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: newRole,
        identity: newIdentity,
      },
    });
  }

  console.log("\n✅ 迁移完成！");

  // 验证
  const summary = await prisma.user.groupBy({
    by: ["role", "identity"],
    _count: true,
  });
  console.log("\n迁移后统计：");
  for (const row of summary) {
    console.log(`  role=${row.role}, identity=${row.identity}: ${row._count} 人`);
  }
}

main()
  .catch((e) => {
    console.error("迁移失败：", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
