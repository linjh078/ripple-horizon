"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createOfflineEvent } from "@/lib/actions/life";

const CATEGORIES = ["沙龙", "分享会", "学习小组", "其他"];

/** 线下活动发布表单 —— Dialog 弹窗模式 */
export function OfflineEventForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setPending(true);
    const result = await createOfflineEvent(formData);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("活动发布成功！");
      setOpen(false);
    }
  }

  function handleTriggerClick() {
    if (!session?.user) {
      router.push("/login");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!session?.user) { router.push("/login"); return; } setOpen(v); }}>
      <DialogTrigger
        render={
          <Button onClick={handleTriggerClick}>
            <Plus className="size-4" />
            <span className="ml-1.5">{session?.user ? "发布活动" : "登录后发布活动"}</span>
          </Button>
        }
      />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-orange-600" />
            发布线下活动
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {/* 标题 */}
          <div className="space-y-1.5">
            <Label htmlFor="title">活动标题</Label>
            <Input
              id="title"
              name="title"
              maxLength={50}
              placeholder="例如：前端技术分享沙龙"
              required
            />
          </div>

          {/* 分类 */}
          <div className="space-y-1.5">
            <Label htmlFor="category">活动分类</Label>
            <Select name="category" defaultValue="沙龙">
              <SelectTrigger id="category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 时间 */}
          <div className="space-y-1.5">
            <Label htmlFor="eventDate">活动时间</Label>
            <Input id="eventDate" name="eventDate" type="datetime-local" required />
          </div>

          {/* 地点 */}
          <div className="space-y-1.5">
            <Label htmlFor="location">活动地点</Label>
            <Input
              id="location"
              name="location"
              placeholder="例如：图书馆一楼研讨室"
            />
          </div>

          {/* 描述 */}
          <div className="space-y-1.5">
            <Label htmlFor="description">活动描述</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="描述活动内容、面向人群、注意事项等"
              required
            />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "发布中..." : "发布活动"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
