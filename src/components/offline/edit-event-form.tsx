"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { updateOfflineEvent } from "@/lib/actions/life";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "沙龙", label: "沙龙" },
  { value: "分享会", label: "分享会" },
  { value: "学习小组", label: "学习小组" },
  { value: "其他", label: "其他" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "保存中..." : "保存修改"}</Button>;
}

interface EditEventData {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  location: string | null;
  category: string;
}

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditOfflineEventForm({ event }: { event: EditEventData }) {
  const [open, setOpen] = useState(false);

  async function handleAction(formData: FormData) {
    formData.append("id", event.id);
    const result = await updateOfflineEvent(formData);
    if (result?.error) toast.error(result.error);
    else { toast.success("活动已更新！"); setOpen(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="ghost"><Pencil className="size-3.5" /></Button>} />
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>编辑活动</DialogTitle></DialogHeader>
        <form action={handleAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="e-title">标题</Label>
            <Input id="e-title" name="title" defaultValue={event.title} required maxLength={50} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="e-category">分类</Label>
              <Select name="category" defaultValue={event.category}>
                <SelectTrigger id="e-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-date">时间</Label>
              <Input id="e-date" name="eventDate" type="datetime-local" defaultValue={toDatetimeLocal(event.eventDate)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-location">地点（选填）</Label>
            <Input id="e-location" name="location" defaultValue={event.location || ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-desc">描述</Label>
            <Textarea id="e-desc" name="description" defaultValue={event.description} rows={4} required />
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
