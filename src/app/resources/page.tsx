import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { RatingBar } from "@/components/shared/rating-bar";

const CATEGORIES = [
  { label: "全部", value: "" },
  { label: "在线课程", value: "ONLINE_COURSES" },
  { label: "实用网站", value: "WEBSITES" },
  { label: "软件技巧", value: "SOFTWARE_TIPS" },
];

const LABELS: Record<string, string> = { ONLINE_COURSES: "在线课程", WEBSITES: "实用网站", SOFTWARE_TIPS: "软件技巧" };

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const where = { category: category || { in: ["ONLINE_COURSES", "WEBSITES", "SOFTWARE_TIPS"] } };

  const posts = await prisma.post.findMany({
    where,
    include: { author: { select: { id: true, name: true, image: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">信息共享</h1><p className="text-muted-foreground text-sm mt-1">优质课程、实用网站、软件技巧分享</p></div>
        <Link href="/posts/new" className={cn(buttonVariants({ size: "sm" }))}><Plus className="size-4" /><span className="ml-1.5">登录后发布</span></Link>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = c.value === "" ? !category : category === c.value;
          return (
            <Link key={c.value} href={c.value ? `/resources?category=${c.value}` : "/resources"} className={cn(buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }), "rounded-full")}>{c.label}</Link>
          );
        })}
      </div>
      {posts.length === 0 ? (
        <div className="py-16 text-center"><p className="text-lg text-muted-foreground">还没有分享</p></div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <Link href={`/posts/${p.id}`}>
                <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-lg">{p.title}</CardTitle><Badge variant="outline">{LABELS[p.category] || p.category}</Badge></div></CardHeader>
                <CardContent className="pb-2"><p className="text-sm text-muted-foreground line-clamp-2">{p.content}</p><p className="text-xs text-muted-foreground mt-2">{p.author.name} · {p._count.comments} 评论</p></CardContent>
              </Link>
              <div className="px-6 pb-4 pt-0">
                <RatingBar targetId={p.id} targetType="post" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
