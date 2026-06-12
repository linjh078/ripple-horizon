"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
}

export function LikeButton({ postId, initialCount }: LikeButtonProps) {
  const { data: session } = useSession();
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!session) {
      toast.error("请先登录");
      return;
    }

    // 乐观更新
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/likes`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // 以服务器返回的实际状态为准
      setLiked(data.liked);
    } catch {
      // 回滚：乐观+1就回滚-1，乐观-1就回滚+1
      setLiked((prev) => !prev);
      setCount((prev) => (prev > initialCount ? prev - 1 : prev + 1));
      toast.error("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={loading}
      className={cn("gap-1.5", liked && "text-red-500 hover:text-red-600")}
    >
      <Heart className={cn("size-4", liked && "fill-current")} />
      <span>{count}</span>
    </Button>
  );
}
