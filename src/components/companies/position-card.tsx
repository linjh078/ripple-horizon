"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { updatePosition, deletePosition } from "@/lib/actions/companies";
import { toast } from "sonner";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "保存中..." : label}
    </Button>
  );
}

interface PositionData {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  companyId: string;
}

export function PositionCard({ position }: { position: PositionData }) {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const canEdit = role === "HR";
  const canDelete = role === "HR" || role === "ADMIN";
  const [editing, setEditing] = useState(false);

  async function handleEdit(formData: FormData) {
    formData.append("id", position.id);
    formData.append("companyId", position.companyId);
    const result = await updatePosition(formData);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("职位已更新！");
      setEditing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定要删除这个职位吗？此操作不可撤销。")) return;
    const formData = new FormData();
    formData.append("id", position.id);
    formData.append("companyId", position.companyId);
    const result = await deletePosition(formData);
    if (result?.error) toast.error(result.error);
    else toast.success("职位已删除");
  }

  if (editing) {
    return (
      <form action={handleEdit} className="rounded-lg border p-4 space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`pos-title-${position.id}`}>职位名称</Label>
          <Input
            id={`pos-title-${position.id}`}
            name="title"
            defaultValue={position.title}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`pos-desc-${position.id}`}>职位描述</Label>
          <Textarea
            id={`pos-desc-${position.id}`}
            name="description"
            defaultValue={position.description}
            rows={3}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`pos-req-${position.id}`}>技能要求（选填）</Label>
          <Textarea
            id={`pos-req-${position.id}`}
            name="requirements"
            defaultValue={position.requirements || ""}
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <SubmitButton label="保存修改" />
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

  return (
    <Card className="group">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg">{position.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
              {position.description}
            </p>
            {position.requirements && (
              <div className="mt-3 rounded-md bg-muted p-3">
                <p className="text-xs font-semibold mb-1">技能要求：</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {position.requirements}
                </p>
              </div>
            )}
          </div>
          {/* 操作按钮：编辑仅 HR，删除 HR/Admin */}
          {(canEdit || canDelete) && (
            <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
