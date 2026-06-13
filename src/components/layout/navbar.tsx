"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Compass, Coffee, User, LogOut, LogIn, UserPlus, Library, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* 左侧 Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-primary hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">🌊</span>
          <span className="hidden sm:inline">观澜知远</span>
        </Link>

        {/* 中间导航 */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Home className="size-4" />
            <span className="ml-1.5">首页</span>
          </Link>
          <Link
            href="/posts"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Compass className="size-4" />
            <span className="ml-1.5">发现</span>
          </Link>
          <Link
            href="/courses"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Library className="size-4" />
            <span className="ml-1.5 hidden sm:inline">课程</span>
          </Link>
          <Link
            href="/companies"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Building2 className="size-4" />
            <span className="ml-1.5 hidden sm:inline">企业</span>
          </Link>
          <Link
            href="/life"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Coffee className="size-4" />
            <span className="ml-1.5">生活</span>
          </Link>
        </nav>

        {/* 右侧用户区 */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full" />
                }
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                <LogIn className="size-4 sm:mr-1.5" />
                <span className="hidden sm:inline">登录</span>
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                <UserPlus className="size-4 sm:mr-1.5" />
                <span className="hidden sm:inline">注册</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
