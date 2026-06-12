import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3">
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
    </div>
  );
}
