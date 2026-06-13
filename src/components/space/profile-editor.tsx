"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Pencil, User, MessageSquare } from "lucide-react";
import { updateProfile } from "@/lib/actions/users";
import { toast } from "sonner";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "保存中..." : label}
    </Button>
  );
}

interface Props {
  department: string | null;
  bio: string | null;
  isOwner: boolean;
}

export function ProfileEditor({ department, bio, isOwner }: Props) {
  const [editingIntro, setEditingIntro] = useState(false);
  const [editingMessage, setEditingMessage] = useState(false);

  async function handleAction(formData: FormData) {
    const result = await updateProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("已更新！");
      setEditingIntro(false);
      setEditingMessage(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ====== 个人介绍 ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <User className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground">
            个人介绍
          </h3>
        </div>

        {/* 编辑模式 */}
        {editingIntro ? (
          <form action={handleAction} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pe-department">院系 / 身份</Label>
              <Input
                id="pe-department"
                name="department"
                defaultValue={department || ""}
                placeholder="例如：化学工程学院，2020届毕业生，目前在深圳从事新能源研发工作"
              />
            </div>
            <div className="flex gap-2">
              <SubmitButton label="保存" />
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingIntro(false)}>
                取消
              </Button>
            </div>
          </form>
        ) : department ? (
          /* 有内容的展示模式 */
          <div className="group rounded-lg border bg-card p-4 relative">
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity size-8"
                onClick={() => setEditingIntro(true)}
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{department}</p>
          </div>
        ) : isOwner ? (
          /* 空内容 + 本人 */
          <div className="text-center py-4 rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              介绍一下你的院系、身份和去向
            </p>
            <Button variant="outline" size="sm" onClick={() => setEditingIntro(true)}>
              <Pencil className="size-3.5 mr-1.5" />
              填写个人介绍
            </Button>
          </div>
        ) : (
          /* 空内容 + 非本人 → 不显示 */
          <p className="text-sm text-muted-foreground">TA 还没有填写个人介绍</p>
        )}
      </section>

      <Separator />

      {/* ====== 留言板 ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground">
            留言板
          </h3>
        </div>

        {/* 编辑模式 */}
        {editingMessage ? (
          <form action={handleAction} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pe-bio">给来访者的话</Label>
              <Textarea
                id="pe-bio"
                name="bio"
                defaultValue={bio || ""}
                placeholder="在这里写下想对来访者说的话、建议、或者任何你想分享的..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <SubmitButton label="保存" />
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingMessage(false)}>
                取消
              </Button>
            </div>
          </form>
        ) : bio ? (
          /* 有内容的展示模式 */
          <div className="group rounded-lg border bg-card p-4 relative">
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity size-8"
                onClick={() => setEditingMessage(true)}
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
          </div>
        ) : isOwner ? (
          /* 空内容 + 本人 */
          <div className="text-center py-4 rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              给来访者留下一些话或建议吧
            </p>
            <Button variant="outline" size="sm" onClick={() => setEditingMessage(true)}>
              <Pencil className="size-3.5 mr-1.5" />
              写留言
            </Button>
          </div>
        ) : (
          /* 空内容 + 非本人 */
          <p className="text-sm text-muted-foreground">TA 还没有留言</p>
        )}
      </section>
    </div>
  );
}
