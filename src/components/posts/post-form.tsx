"use client";

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
import { createPost } from "@/lib/actions/posts";

const CATEGORIES = [
  { value: "STUDY_RESOURCES", label: "学习资源" },
  { value: "ONLINE_COURSES", label: "在线课程" },
  { value: "WEBSITES", label: "实用网站" },
  { value: "EXAM_PREP", label: "考试备考" },
  { value: "CAREER_SKILLS", label: "职场技能" },
  { value: "SOFTWARE_TIPS", label: "软件技巧" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "发布中..." : "发布"}
    </Button>
  );
}

export function PostForm() {
  return (
    <form action={createPost} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">标题</Label>
        <Input
          id="title"
          name="title"
          placeholder="给你的分享起一个标题"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">分类</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">内容</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="写下你想分享的内容..."
          rows={10}
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
