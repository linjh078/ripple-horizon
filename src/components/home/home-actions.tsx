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
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExploreButton() {
  return (
    <a href="/posts" className={cn(buttonVariants({ size: "default" }))}>
      开始探索
      <ArrowRight className="ml-1.5 size-4" />
    </a>
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
