"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSubject } from "@/lib/actions/subjects";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" disabled={pending}>{pending ? "创建中..." : "创建学科"}</Button>;
}

export function SubjectForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [show, setShow] = useState(false);

  if (!session) return <Button size="sm" onClick={() => router.push("/login")}>登录后创建学科</Button>;
  if (!show) return <Button size="sm" onClick={() => setShow(true)}>创建学科</Button>;

  async function handleAction(formData: FormData) {
    const result = await createSubject(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("学科创建成功！"); setShow(false); }
  }

  return (
    <form action={handleAction} className="rounded-lg border p-4 space-y-3">
      <div className="space-y-1"><Label htmlFor="s-name">学科名称</Label><Input id="s-name" name="name" placeholder="如：高等数学、C语言程序设计" required maxLength={50} /></div>
      <div className="space-y-1"><Label htmlFor="s-dept">所属院系（选填）</Label><Input id="s-dept" name="department" placeholder="如：数学与计算机学院" /></div>
      <div className="space-y-1"><Label htmlFor="s-desc">学科简介（选填）</Label><Textarea id="s-desc" name="description" placeholder="简要介绍这个学科..." rows={2} /></div>
      <div className="flex gap-2"><SubmitButton /><Button type="button" variant="ghost" size="sm" onClick={() => setShow(false)}>取消</Button></div>
    </form>
  );
}
