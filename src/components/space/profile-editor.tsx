"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { updateProfile } from "@/lib/actions/users";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "保存中..." : "保存"}
    </Button>
  );
}

interface Props {
  department: string | null;
  bio: string | null;
  isOwner: boolean;
}

export function ProfileEditor({ department, bio, isOwner }: Props) {
  const [editing, setEditing] = useState(false);

  // 没有内容且不是本人 → 不显示
  if (!editing && !department && !bio) {
    if (!isOwner) return null;
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground mb-3">
          介绍一下自己，或者给来访者留下一些话吧
        </p>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="size-3.5 mr-1.5" />
          编辑个人介绍
        </Button>
      </div>
    );
  }

  // 非编辑状态：展示内容
  if (!editing) {
    return (
      <div className="group rounded-lg border bg-card p-5 relative">
        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity size-8"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3.5" />
          </Button>
        )}
        {department && (
          <p className="text-sm text-muted-foreground mb-2">{department}</p>
        )}
        {bio && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
        )}
      </div>
    );
  }

  // 编辑状态
  async function handleAction(formData: FormData) {
    const result = await updateProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("个人介绍已更新！");
      setEditing(false);
    }
  }

  return (
    <form action={handleAction} className="rounded-lg border bg-card p-5 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pe-department">院系 / 身份</Label>
        <Input
          id="pe-department"
          name="department"
          defaultValue={department || ""}
          placeholder="例如：化学工程学院，2020届毕业生，目前在深圳从事新能源研发工作"
        />
        <p className="text-xs text-muted-foreground">
          在这个位置写你的院系、毕业去向、或者任何你想展示的身份标签
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pe-bio">个人介绍 / 留言</Label>
        <Textarea
          id="pe-bio"
          name="bio"
          defaultValue={bio || ""}
          placeholder="写一些话介绍自己，或者给来访者留言建议..."
          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <SubmitButton />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setEditing(false)}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
