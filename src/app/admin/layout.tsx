import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// 管理后台侧边栏导航项（可扩展）
const ADMIN_NAV_ITEMS = [
  {
    href: "/admin/users",
    label: "用户管理",
    icon: Users,
    description: "管理所有用户账户和权限",
  },
  // 未来扩展：
  // { href: "/admin/verify", label: "身份审核", icon: UserCheck, description: "审核注册用户身份" },
  // { href: "/admin/content", label: "内容管理", icon: FileText, description: "管理违规内容和举报" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <Shield className="size-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">您还不是管理员</h1>
        <p className="text-muted-foreground mb-6">
          加入我们成为管理员，请添加作者微信交流：
        </p>
        <div className="rounded-lg bg-muted p-4 mb-4">
          <p className="text-sm text-muted-foreground">微信号</p>
          <p className="text-xl font-bold tracking-wider">13714249330</p>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          添加时请备注"观澜知远"，感谢支持！
        </p>
        <Link
          href="/"
          className="text-sm text-primary hover:underline"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl gap-6 px-4 py-8 sm:px-6">
      {/* 侧边栏 */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-20">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            返回首页
          </Link>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            控制中心
          </h2>
          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-muted",
                  "text-foreground font-medium"
                )}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
