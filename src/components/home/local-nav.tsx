"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "发现" },
  { href: "/courses", label: "课程" },
  { href: "/companies", label: "企业" },
  { href: "/life", label: "生活" },
];

/**
 * LocalNav — 首页专属透明导航栏
 *
 * 悬浮在视频背景之上，与暗色视频形成对比的白色文字。
 * 中段为 liquid-glass 圆角 pill 导航链接组，移动端隐藏。
 */
export function LocalNav() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="fixed top-[30px] inset-x-0 z-50"
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6">
        {/* 左侧 Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity"
        >
          🌊 观澜知远
        </Link>

        {/* 中间导航链接组 — liquid-glass pill */}
        <nav className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-2 py-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 右侧 CTA */}
        <div>
          {session ? (
            <Link
              href={`/space/${session.user.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
            >
              我的空间
            </Link>
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
