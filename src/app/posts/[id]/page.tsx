import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoryBadge } from "@/components/posts/category-badge";
import { CommentSection } from "@/components/comments/comment-section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/shared/delete-button";
import { RatingBar } from "@/components/shared/rating-bar";
import { deletePost } from "@/lib/actions/posts";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true, department: true } },
    },
  });

  if (!post) notFound();

  // 根据帖子分类智能返回对应的列表页
  const backMap: Record<string, { href: string; label: string }> = {
    EXAM_PREP: { href: "/exams", label: "返回考试升学" },
    ONLINE_COURSES: { href: "/resources", label: "返回信息共享" },
    WEBSITES: { href: "/resources", label: "返回信息共享" },
    SOFTWARE_TIPS: { href: "/resources", label: "返回信息共享" },
  };
  const back = backMap[post.category] || { href: "/posts", label: "返回列表" };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* 返回按钮 + 删除 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={back.href}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="size-4" />
          <span className="ml-1.5">{back.label}</span>
        </Link>
        {currentUserId === post.author.id && (
          <DeleteButton action={deletePost} itemId={post.id} itemLabel={post.title} redirectTo={back.href} />
        )}
      </div>

      {/* 帖子头部 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CategoryBadge category={post.category} />
        </div>
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {post.author.department && `${post.author.department} · `}
              {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </p>
          </div>
        </div>
      </div>

      {/* 正文 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* 图片 */}
      {post.imageUrls && (
        <div className="flex flex-wrap gap-3 mb-6">
          {JSON.parse(post.imageUrls).map((url: string, i: number) => (
            <img key={i} src={url} alt="" className="max-w-full rounded-lg border object-cover" style={{ maxHeight: "400px" }} />
          ))}
        </div>
      )}

      {/* 评级 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <RatingBar targetId={post.id} targetType="post" />
      </div>

      <Separator className="mb-8" />

      {/* 评论区 */}
      <CommentSection postId={post.id} />
    </div>
  );
}
