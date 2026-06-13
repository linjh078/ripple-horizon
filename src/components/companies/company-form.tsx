"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCompany } from "@/lib/actions/companies";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" disabled={pending}>{pending ? "创建中..." : "创建企业"}</Button>;
}

export function CompanyForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [show, setShow] = useState(false);

  if (!session) return <Button size="sm" onClick={() => router.push("/login")}>登录后创建企业</Button>;
  if (!show) return <Button size="sm" onClick={() => setShow(true)}>创建企业</Button>;

  async function handleAction(formData: FormData) {
    const result = await createCompany(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("企业创建成功！"); setShow(false); }
  }

  return (
    <form action={handleAction} className="rounded-lg border p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="c-name">企业名称</Label><Input id="c-name" name="name" placeholder="如：华为技术有限公司" required /></div>
        <div className="space-y-1"><Label htmlFor="c-industry">所属行业（选填）</Label><Input id="c-industry" name="industry" placeholder="如：互联网/IT" /></div>
      </div>
      <div className="space-y-1"><Label htmlFor="c-desc">企业介绍</Label><Textarea id="c-desc" name="description" placeholder="介绍一下这家企业..." rows={3} required /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="c-loc">地点（选填）</Label><Input id="c-loc" name="location" placeholder="如：深圳" /></div>
        <div className="space-y-1"><Label htmlFor="c-web">官网（选填）</Label><Input id="c-web" name="website" placeholder="如：https://huawei.com" /></div>
      </div>
      <div className="flex gap-2"><SubmitButton /><Button type="button" variant="ghost" size="sm" onClick={() => setShow(false)}>取消</Button></div>
    </form>
  );
}
