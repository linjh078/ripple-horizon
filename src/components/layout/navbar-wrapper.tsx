"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

/**
 * NavbarWrapper — 首页隐藏全局导航栏
 *
 * 首页使用 CinematicHero 自带的 LocalNav 透明导航栏，
 * 因此全局 Navbar 在 `/` 路由上不渲染。
 */
export function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navbar />;
}
