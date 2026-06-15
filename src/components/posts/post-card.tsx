import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/posts/category-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
    _count?: {
      comments: number;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const excerpt =
    post.content.length > 120
      ? post.content.slice(0, 120) + "..."
      : post.content;

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="group h-full cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CategoryBadge category={post.category} />
            <span className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
          <CardTitle className="mt-2 text-lg group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Avatar className="size-5">
                <AvatarFallback className="text-[10px]">
                  {post.author.name[0]}
                </AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3" />
              {post._count?.comments ?? 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
