"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  currentUserId?: string;
  postId: string;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({ comment, currentUserId, postId, onDelete }: CommentItemProps) {
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUserId === comment.author.id;

  async function handleDelete() {
    if (!confirm("确定删除这条评论吗？")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments?commentId=${comment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "删除失败");
        return;
      }
      toast.success("评论已删除");
      onDelete?.(comment.id);
    } catch {
      toast.error("删除失败，请稍后重试");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex gap-3 py-3 group">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-xs">
          {comment.author.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
          </span>
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
      {isOwner && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
