"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/explore", label: "探索" },
  { href: "/companies", label: "企业" },
  { href: "/life", label: "生活" },
];

/**
 * LocalNav — 首页专属透明导航栏
 *
 * 悬浮在视频背景之上，中段 liquid-glass pill，
 * 右侧根据登录状态显示用户下拉菜单或"加入我们"。
 */
export function LocalNav() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="fixed top-[30px] inset-x-0 z-50"
    >
      <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6">
        {/* 左侧 Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity"
          style={{ textShadow: "0 2px 10px rgb(0 0 0 / 0.4)" }}
        >
          🌊 观澜知远
        </Link>

        {/* 中间导航链接组 — liquid-glass pill */}
        <nav className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-2 py-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-white/85 hover:text-white transition-colors rounded-full hover:bg-white/[0.08]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 右侧用户区 */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="size-8 animate-pulse rounded-full bg-white/10" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full" />
                }
              >
                <Avatar className="size-8 ring-2 ring-white/30">
                  <AvatarFallback className="bg-white/20 text-white text-xs backdrop-blur">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* 账户信息 */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">账户</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.name || "用户"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/space/${user?.id}`}
                      className="cursor-pointer"
                    />
                  }
                >
                  <User className="size-4" />
                  <span className="ml-2">我的空间</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-4" />
                  <span className="ml-2">退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
            >
              加入我们
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
