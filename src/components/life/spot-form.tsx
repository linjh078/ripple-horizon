"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { createLifeSpot } from "@/lib/actions/life";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "FOOD", label: "美食" },
  { value: "SHOP", label: "购物" },
  { value: "SERVICE", label: "生活服务" },
  { value: "ENTERTAINMENT", label: "休闲娱乐" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "添加中..." : "添加"}
    </Button>
  );
}

/** 校园周边地点表单 —— Dialog 弹窗模式 */
export function SpotForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  if (!session) {
    return (
      <Button onClick={() => router.push("/login")} size="sm">
        登录后分享地点
      </Button>
    );
  }

  async function handleAction(formData: FormData) {
    formData.append("imageUrls", JSON.stringify(images));
    const result = await createLifeSpot(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("地点添加成功！");
      setOpen(false);
      setImages([]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setImages([]); }}>
      <DialogTrigger
        render={
          <Button size="sm">分享地点</Button>
        }
      />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>分享地点</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="spot-name">名称</Label>
            <Input id="spot-name" name="name" placeholder="店铺/地点名称" required maxLength={50} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="spot-category">分类</Label>
            <Select name="category" required>
              <SelectTrigger id="spot-category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="spot-description">描述</Label>
            <Textarea id="spot-description" name="description" placeholder="介绍一下这个地点..." rows={3} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="spot-location">位置（选填）</Label>
            <Input id="spot-location" name="location" placeholder="如：学校北门对面小巷内50米" />
          </div>
          <ImageUpload images={images} onChange={setImages} />
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
