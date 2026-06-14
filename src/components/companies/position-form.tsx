"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPosition } from "@/lib/actions/companies";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "发布中..." : "发布职位"}</Button>;
}

/** 职位发布表单 —— Dialog 弹窗模式 */
export function PositionForm({ companyId }: { companyId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!session) return <Button size="sm" variant="outline" onClick={() => router.push("/login")}>登录后发布</Button>;
  const role = (session.user as { role?: string }).role;
  if (role !== "HR" && role !== "ADMIN") return null; // 仅 HR 和管理员可见

  async function handleAction(formData: FormData) {
    formData.append("companyId", companyId);
    const result = await createPosition(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("职位发布成功！"); setOpen(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline">发布职位</Button>} />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>发布职位</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-title">职位名称</Label>
            <Input id="p-title" name="title" placeholder="如：前端开发工程师" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">职位描述</Label>
            <Textarea id="p-desc" name="description" placeholder="描述这个职位的工作内容..." rows={3} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-req">技能要求（选填）</Label>
            <Textarea id="p-req" name="requirements" placeholder="例如：需要掌握 React、TypeScript..." rows={3} />
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
