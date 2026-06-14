import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NavCardGrid } from "@/components/home/nav-card-grid";
import { PostCard } from "@/components/posts/post-card";
import { SpaceButton } from "@/components/home/home-actions";
import { buttonVariants } from "@/components/ui/button";
import { Compass, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ExplorePage() {
  // 获取最新帖子（前 6 条）
  const recentPosts = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* 标题栏 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="size-6 text-primary" />
          <h1 className="text-2xl font-bold">探索频道</h1>
        </div>
        <Link
          href="/posts/new"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="size-4" />
          <span className="ml-1.5">发布</span>
        </Link>
      </div>

      {/* 导航卡片区域 */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            选择一个方向开始你的旅程
          </h2>
        </div>
        <NavCardGrid />
      </section>

      {/* 最新动态 */}
      {recentPosts.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              最新动态
            </h2>
            <Link
              href="/posts"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* 底部个人空间引导 */}
      <section className="mt-12 rounded-xl border bg-card p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">拥有你的个人空间</h3>
        <p className="mb-4 text-muted-foreground">
          建立个人主页，记录在校时间轴，分享你的成长故事与心得。
          <br />
          让每一次经历都成为他人前行的灯塔。
        </p>
        <SpaceButton />
      </section>
    </div>
  );
}
