import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const SUB_CATEGORIES = [
  { label: "全部", value: "" },
  { label: "考研", value: "考研" },
  { label: "考公", value: "考公" },
  { label: "考证", value: "考证" },
  { label: "留学", value: "留学" },
];

export default async function ExamsPage({ searchParams }: { searchParams: Promise<{ sub?: string }> }) {
  const { sub } = await searchParams;

  const where: Record<string, unknown> = { category: "EXAM_PREP" };
  if (sub) where.title = { contains: `[${sub}]` };

  const posts = await prisma.post.findMany({
    where,
    include: { author: { select: { id: true, name: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">考试备考</h1><p className="text-muted-foreground text-sm mt-1">考研·考公·考证·留学经验分享与资料交流</p></div>
        <Link href="/posts/new" className={cn(buttonVariants({ size: "sm" }))}><Plus className="size-4" /><span className="ml-1.5">发帖</span></Link>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {SUB_CATEGORIES.map((s) => {
          const isActive = s.value === "" ? !sub : sub === s.value;
          return (
            <Link key={s.value} href={s.value ? `/exams?sub=${s.value}` : "/exams"} className={cn(buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }), "rounded-full")}>{s.label}</Link>
          );
        })}
      </div>
      {posts.length === 0 ? (
        <div className="py-16 text-center"><p className="text-lg text-muted-foreground">还没有备考分享</p></div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link key={p.id} href={`/posts/${p.id}`}>
              <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2"><CardTitle className="text-lg">{p.title}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground line-clamp-3">{p.content}</p><p className="text-xs text-muted-foreground mt-2">{p.author.name} · {p._count.comments} 评论 · {p.likeCount} 赞</p></CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
