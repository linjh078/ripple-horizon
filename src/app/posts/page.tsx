import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/posts/post-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "全部", value: "" },
  { label: "学习资源", value: "STUDY_RESOURCES" },
  { label: "在线课程", value: "ONLINE_COURSES" },
  { label: "实用网站", value: "WEBSITES" },
  { label: "考试备考", value: "EXAM_PREP" },
  { label: "职场技能", value: "CAREER_SKILLS" },
  { label: "软件技巧", value: "SOFTWARE_TIPS" },
];

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const where = category ? { category } : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">发现</h1>
        <Link
          href="/posts/new"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="size-4" />
          <span className="ml-1.5">发布</span>
        </Link>
      </div>

      {/* 分类筛选 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive =
            c.value === "" ? !category : category === c.value;
          return (
            <Link
              key={c.value}
              href={c.value ? `/posts?category=${c.value}` : "/posts"}
              className={cn(
                buttonVariants({
                  variant: isActive ? "default" : "outline",
                  size: "sm",
                }),
                "rounded-full"
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* 帖子列表 */}
      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">还没有帖子</p>
          <p className="mt-1 text-sm text-muted-foreground">
            成为第一个分享的人吧！
          </p>
          <Link
            href="/posts/new"
            className={cn(buttonVariants(), "mt-4")}
          >
            发布第一篇帖子
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
