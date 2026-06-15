"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { toast } from "sonner";
import { createPost } from "@/lib/actions/posts";

const ALL_CATEGORIES = [
  { value: "EXAM_PREP", label: "考试备考" },
  { value: "ONLINE_COURSES", label: "在线课程" },
  { value: "WEBSITES", label: "实用网站" },
  { value: "SOFTWARE_TIPS", label: "软件技巧" },
  { value: "STUDY_RESOURCES", label: "学习资源" },
  { value: "CAREER_SKILLS", label: "职场技能" },
];

interface PostDialogProps {
  /** 默认分类 */
  defaultCategory?: string;
  /** 可选分类列表（不传则显示全部） */
  categoryOptions?: string[];
  /** 已登录按钮文案 */
  buttonLabel?: string;
  /** 未登录按钮文案 */
  unauthenticatedLabel?: string;
  /** 弹窗标题 */
  dialogTitle?: string;
  /** 弹窗图标组件 */
  dialogIcon?: React.ReactNode;
}

/** 发帖/发布 Dialog —— 参照 OfflineEventForm 弹窗模式 */
export function PostDialog({
  defaultCategory = "STUDY_RESOURCES",
  categoryOptions,
  buttonLabel = "发布",
  unauthenticatedLabel = "登录后发布",
  dialogTitle = "发布信息",
  dialogIcon,
}: PostDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const categories = categoryOptions
    ? ALL_CATEGORIES.filter((c) => categoryOptions.includes(c.value))
    : ALL_CATEGORIES;

  async function handleSubmit(formData: FormData) {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setPending(true);
    formData.append("imageUrls", JSON.stringify(images));
    const result = await createPost(formData);
    setPending(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("发布成功！");
      setOpen(false);
      setImages([]);
      router.refresh();
    }
  }

  function handleTriggerClick() {
    if (!session?.user) {
      router.push("/login");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!session?.user) {
          router.push("/login");
          return;
        }
        setOpen(v);
        if (!v) setImages([]);
      }}
    >
      <DialogTrigger
        render={
          <Button onClick={handleTriggerClick}>
            <Plus className="size-4" />
            <span className="ml-1.5">
              {session?.user ? buttonLabel : unauthenticatedLabel}
            </span>
          </Button>
        }
      />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dialogIcon || <FileText className="size-5 text-primary" />}
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {/* 标题 */}
          <div className="space-y-1.5">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              name="title"
              maxLength={200}
              placeholder="给你的分享起一个标题"
              required
            />
          </div>

          {/* 分类 */}
          <div className="space-y-1.5">
            <Label htmlFor="category">分类</Label>
            <Select name="category" defaultValue={defaultCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 内容 */}
          <div className="space-y-1.5">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              name="content"
              rows={6}
              maxLength={10000}
              placeholder="写下你想分享的内容..."
              required
            />
          </div>

          {/* 图片上传 */}
          <ImageUpload images={images} onChange={setImages} />

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "发布中..." : buttonLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
