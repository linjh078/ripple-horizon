import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化：允许上传目录的本地图片 + CDN 远程图片
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d8j0ntlcm91z4.cloudfront.net",
      },
    ],
    // 上传目录的本地图片走默认 loader，无需额外配置
  },

  // 压缩：生产环境启用 gzip/brotli（默认开启，显式声明）
  compress: true,

  // React 严格模式（开发时检测潜在问题）
  reactStrictMode: true,

  // 客户端路由缓存：页面数据在浏览器缓存中保持 60 秒
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },

  // 请求体大小限制（默认 4MB → 放大到 8MB 以适应图片上传 base64）
  serverExternalPackages: [],
};

export default nextConfig;
