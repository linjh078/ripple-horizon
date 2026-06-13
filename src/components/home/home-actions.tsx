"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, MessageCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExploreButton() {
  return (
    <a href="/posts" className={cn(buttonVariants({ size: "default" }))}>
      开始探索
      <ArrowRight className="ml-1.5 size-4" />
    </a>
  );
}

export function MissionButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Heart className="mr-1.5 size-4 text-red-500" />
        网站初心
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="size-5 text-red-500" />
              网站初心
            </DialogTitle>
            <DialogDescription className="pt-2 text-base leading-relaxed text-foreground/80">
              这是在学校的最后一段空闲时光，我想再多做几个项目。后来觉得要是有人能在大一时带带我，我现在应该也是半个技术大佬了吧。于是两个想法一拍即合，构建一个信息分享网站的项目，淋过雨，现在可以为后面的人撑伞，顺便锻炼一下自己做实际项目的能力。
            </DialogDescription>
          </DialogHeader>
          <p className="text-xs text-muted-foreground text-center">
            （后续还会补充更多内容，敬请期待）
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function JoinButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        加入我们
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <MessageCircle className="size-5 text-green-500" />
              联系作者
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              欢迎加入观澜知远！请添加作者微信交流：
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">微信号</p>
            <p className="text-xl font-bold tracking-wider">13714249330</p>
          </div>
          <p className="text-xs text-muted-foreground">
            添加时请备注"观澜知远"，感谢支持！
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SpaceButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  function handleClick() {
    if (status === "loading") return;
    if (session?.user?.id) {
      router.push(`/space/${session.user.id}`);
    } else {
      router.push("/register");
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={status === "loading"}
    >
      {status === "loading"
        ? "加载中..."
        : session?.user?.id
          ? "进入我的空间"
          : "创建我的空间"}
    </Button>
  );
}
