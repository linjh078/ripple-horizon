"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/image-upload";
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

export function EventForm({ userId }: { userId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
        添加人生事件
      </Button>
    );
  }

  function handleCancel() {
    setShowForm(false);
    setImages([]);
  }

  async function handleAction(formData: FormData) {
    formData.append("imageUrls", JSON.stringify(images));
    const result = await createLifeEvent(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("事件添加成功！");
      setShowForm(false);
      setImages([]);
    }
  }

  return (
    <form action={handleAction} className="space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <Label htmlFor="event-title">标题</Label>
        <Input id="event-title" name="title" placeholder="如：入学、第一次竞赛获奖..." required maxLength={50} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-date">日期</Label>
        <Input id="event-date" name="eventDate" type="date" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-content">内容</Label>
        <Textarea id="event-content" name="content" placeholder="描述这段经历..." rows={3} required />
      </div>
      <ImageUpload images={images} onChange={setImages} />
      <div className="flex gap-2">
        <SubmitButton />
        <Button type="button" variant="ghost" onClick={handleCancel} className="flex-1">
          取消
        </Button>
      </div>
    </form>
  );
}
