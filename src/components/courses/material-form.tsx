"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { uploadMaterial } from "@/lib/actions/subjects";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "上传中..." : "上传资料"}</Button>;
}

/** 学习资料上传表单 —— Dialog 弹窗模式 */
export function MaterialForm({ subjectId }: { subjectId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  if (!session) return <Button size="sm" variant="outline" onClick={() => router.push("/login")}>登录后上传</Button>;

  async function handleAction(formData: FormData) {
    formData.append("subjectId", subjectId);
    formData.append("imageUrls", JSON.stringify(images));
    const result = await uploadMaterial(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("资料上传成功！"); setOpen(false); setImages([]); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setImages([]); }}>
      <DialogTrigger render={<Button size="sm" variant="outline">上传资料</Button>} />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>上传学习资料</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="m-title">标题</Label>
            <Input id="m-title" name="title" placeholder="资料标题" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-content">内容</Label>
            <Textarea id="m-content" name="content" placeholder="资料内容或说明..." rows={4} required />
          </div>
          <ImageUpload images={images} onChange={setImages} />
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
