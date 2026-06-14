"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteLifeEvent } from "@/lib/actions/life";
import { toast } from "sonner";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("确定删除这条事件吗？")) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("id", eventId);
    const result = await deleteLifeEvent(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("已删除");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleDelete}
      disabled={loading}
      className="absolute top-0 right-0 text-muted-foreground hover:text-destructive"
      title="删除"
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
}
