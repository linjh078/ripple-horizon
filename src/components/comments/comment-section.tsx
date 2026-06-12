"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentItem } from "@/components/comments/comment-item";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .finally(() => setFetching(false));
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "评论失败");
        return;
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      toast.success("评论已发布");
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">
        评论 ({comments.length})
      </h3>

      {/* 评论输入 */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <Textarea
            placeholder="写下你的想法..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <Button type="submit" size="sm" disabled={loading || !content.trim()}>
            {loading ? "发布中..." : "发表评论"}
          </Button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          请先登录后再发表评论
        </p>
      )}

      {/* 评论列表 */}
      {fetching ? (
        <p className="text-sm text-muted-foreground">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">还没有评论，来发表第一条吧</p>
      ) : (
        <div className="divide-y">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
