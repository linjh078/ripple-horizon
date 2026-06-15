// ============================================================================
// 路由保护中间件 (Auth.js v5)
// 保护需要登录的页面，已登录用户自动跳离认证页
// 同时注入安全响应头和缓存策略
// ============================================================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// 安全响应头（所有页面）
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // CSP: 允许本站资源、CloudFront 视频 CDN、内联样式（Tailwind 需要）
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob: https:; " +
    "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net; " +
    "connect-src 'self'; " +
    "font-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // ========== 认证路由处理 ==========

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

  // ========== 注入安全响应头 ==========
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // ========== 缓存策略 ==========
  // 静态资源（图片、上传文件）→ 长缓存（1 年）
  if (
    pathname.startsWith("/uploads/") ||
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image/")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }
  // 页面的 HTML → 短缓存（CDN 侧可缓存 60s，浏览器 stale-while-revalidate）
  else if (!pathname.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
  }

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
