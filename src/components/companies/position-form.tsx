"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPosition } from "@/lib/actions/companies";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" disabled={pending}>{pending ? "发布中..." : "发布职位"}</Button>;
}

export function PositionForm({ companyId }: { companyId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [show, setShow] = useState(false);

  if (!session) return <Button size="sm" variant="outline" onClick={() => router.push("/login")}>登录后发布</Button>;
  if (!show) return <Button size="sm" variant="outline" onClick={() => setShow(true)}>发布职位</Button>;

  async function handleAction(formData: FormData) {
    formData.append("companyId", companyId);
    const result = await createPosition(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("职位发布成功！"); setShow(false); }
  }

  return (
    <form action={handleAction} className="rounded-lg border p-4 space-y-3 w-full">
      <div className="space-y-1"><Label htmlFor="p-title">职位名称</Label><Input id="p-title" name="title" placeholder="如：前端开发工程师" required /></div>
      <div className="space-y-1"><Label htmlFor="p-desc">职位描述</Label><Textarea id="p-desc" name="description" placeholder="描述这个职位的工作内容..." rows={3} required /></div>
      <div className="space-y-1"><Label htmlFor="p-req">技能要求（选填）</Label><Textarea id="p-req" name="requirements" placeholder="例如：需要掌握 React、TypeScript，了解 Node.js 后端开发..." rows={3} /></div>
      <div className="flex gap-2"><SubmitButton /><Button type="button" variant="ghost" size="sm" onClick={() => setShow(false)}>取消</Button></div>
    </form>
  );
}
