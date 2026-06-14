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
import { createCompany } from "@/lib/actions/companies";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "创建中..." : "创建企业"}</Button>;
}

/** 企业创建表单 —— Dialog 弹窗模式 */
export function CompanyForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!session) return <Button size="sm" onClick={() => router.push("/login")}>登录后创建企业</Button>;

  async function handleAction(formData: FormData) {
    const result = await createCompany(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("企业创建成功！"); setOpen(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">创建企业</Button>} />

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>创建企业</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">企业名称</Label>
              <Input id="c-name" name="name" placeholder="如：华为技术有限公司" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-industry">所属行业（选填）</Label>
              <Input id="c-industry" name="industry" placeholder="如：互联网/IT" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">企业介绍</Label>
            <Textarea id="c-desc" name="description" placeholder="介绍一下这家企业..." rows={3} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-loc">地点（选填）</Label>
              <Input id="c-loc" name="location" placeholder="如：深圳" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-web">官网（选填）</Label>
              <Input id="c-web" name="website" placeholder="如：https://huawei.com" />
            </div>
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
