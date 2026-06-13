"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Pencil, User, MessageSquare } from "lucide-react";
import { updateProfile, updateBio } from "@/lib/actions/users";
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
  major: string | null;
  bio: string | null;
  isOwner: boolean;
}

export function ProfileEditor({ department, major, bio, isOwner }: Props) {
  const [editingIntro, setEditingIntro] = useState(false);
  const [editingMessage, setEditingMessage] = useState(false);

  // ====== 个人介绍表单 ======
  async function handleIntroAction(formData: FormData) {
    const result = await updateProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("个人介绍已更新！");
      setEditingIntro(false);
    }
  }

  // ====== 留言板表单 ======
  async function handleBioAction(formData: FormData) {
    const result = await updateBio(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("留言已更新！");
      setEditingMessage(false);
    }
  }

  const hasIntro = department || major;

  return (
    <div className="space-y-6">
      {/* ====== 个人介绍 ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <User className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground">个人介绍</h3>
        </div>

        {editingIntro ? (
          <form action={handleIntroAction} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pe-department">
                院系 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pe-department"
                name="department"
                defaultValue={department || ""}
                placeholder="例如：化学工程学院"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pe-major">专业 + 班级</Label>
              <Input
                id="pe-major"
                name="major"
                defaultValue={major || ""}
                placeholder="例如：电子22-2"
              />
              <p className="text-xs text-muted-foreground">
                班级里已经包含届数，不需要单独写"2020届"
              </p>
            </div>
            <div className="flex gap-2">
              <SubmitButton label="保存" />
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingIntro(false)}>
                取消
              </Button>
            </div>
          </form>
        ) : hasIntro ? (
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
            <p className="text-sm leading-relaxed">
              {[department, major].filter(Boolean).join(" · ")}
            </p>
          </div>
        ) : isOwner ? (
          <div className="text-center py-4 rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              填写你的院系和专业班级，让大家认识你
            </p>
            <Button variant="outline" size="sm" onClick={() => setEditingIntro(true)}>
              <Pencil className="size-3.5 mr-1.5" />
              填写个人介绍
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">TA 还没有填写个人介绍</p>
        )}
      </section>

      <Separator />

      {/* ====== 留言板（完全独立） ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground">留言板</h3>
        </div>

        {editingMessage ? (
          <form action={handleBioAction} className="rounded-lg border bg-card p-4 space-y-3">
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
          <div className="text-center py-4 rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              给来访者留下一些话或建议
            </p>
            <Button variant="outline" size="sm" onClick={() => setEditingMessage(true)}>
              <Pencil className="size-3.5 mr-1.5" />
              写留言
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">TA 还没有留言</p>
        )}
      </section>
    </div>
  );
}
