"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createLifeEvent } from "@/lib/actions/life";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "添加中..." : "添加"}
    </Button>
  );
}

/** 人生事件表单 —— Dialog 弹窗模式 */
export function EventForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function handleAction(formData: FormData) {
    formData.append("imageUrls", JSON.stringify(images));
    const result = await createLifeEvent(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("事件添加成功！");
      setOpen(false);
      setImages([]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setImages([]); }}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            添加人生事件
          </Button>
        }
      />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>添加人生事件</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="event-title">标题</Label>
            <Input id="event-title" name="title" placeholder="如：入学、第一次竞赛获奖..." required maxLength={50} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="event-date">日期</Label>
            <Input id="event-date" name="eventDate" type="date" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="event-content">内容</Label>
            <Textarea id="event-content" name="content" placeholder="描述这段经历..." rows={3} required />
          </div>
          <ImageUpload images={images} onChange={setImages} />
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
