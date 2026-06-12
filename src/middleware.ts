// ============================================================================
// 路由保护中间件 (Auth.js v5)
// 保护需要登录的页面，已登录用户自动跳离认证页
// ============================================================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 已登录用户访问登录/注册页 → 跳转到首页
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 未登录用户访问需要保护的页面 → 跳转到登录页
  const protectedPaths = ["/posts/new"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
