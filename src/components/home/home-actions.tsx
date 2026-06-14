"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

/**
 * SpaceButton — 个人空间入口按钮
 *
 * 已登录 → /space/[userId]，未登录 → /register
 */
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
