"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
  /** Server action to call on confirm. Receives the item id as FormData. */
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  /** Unique id of the item to delete */
  itemId: string;
  /** Label for the item being deleted (shown in confirmation) */
  itemLabel?: string;
  /** Optional path to revalidate after delete */
  redirectTo?: string;
}

/**
 * DeleteButton — 删除按钮 + 二次确认 Dialog
 *
 * 用法：
 * <DeleteButton action={deletePost} itemId={post.id} itemLabel={post.title} />
 */
export function DeleteButton({ action, itemId, itemLabel = "这条内容", redirectTo }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setPending(true);
    const formData = new FormData();
    formData.append("id", itemId);
    const result = await action(formData);
    setPending(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("已删除");
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除「{itemLabel}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={pending}>
              取消
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={pending}>
              {pending ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
