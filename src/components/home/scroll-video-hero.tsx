"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * ScrollVideoHero — 滚动驱动视频背景
 *
 * 视频固定在视口中，滚动进度映射到 video.currentTime。
 * 前景内容有视差层级，滚动到底后显示 children（探索卡片）。
 */
export function ScrollVideoHero({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 强制触发视频加载
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause(); // 先暂停，由滚动控制播放
  }, []);

  // 滚动驱动视频播放
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !videoRef.current) return;
    const video = videoRef.current;
    if (!video.duration) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // 滚动区域：从容器顶部进入视口 → 容器底部离开视口
    const scrollStart = 0;
    const scrollEnd = rect.height - viewportH;
    const scrolled = -rect.top;

    if (scrollEnd <= 0) return;
    const progress = Math.max(0, Math.min(1, scrolled / scrollEnd));

    // 映射滚动进度到视频时间
    const targetTime = progress * video.duration;
    // 只在差值较大时更新，避免频繁设置
    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!mounted) {
    return (
      <>
        <div style={{ height: "300vh" }} />
        <div className="relative z-10 bg-background">{children}</div>
      </>
    );
  }

  return (
    <>
      {/* ====== 固定视频背景 ====== */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-black" />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/earth.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ====== 滚动内容区 ====== */}
      <div ref={containerRef} className="relative z-10" style={{ height: "350vh" }}>
        {/* 第 1 屏：标题淡入 */}
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-sm tracking-[0.3em] text-white/60 uppercase">
              Explore the Horizon
            </p>
            <h1
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ textShadow: "0 4px 60px rgb(0 0 0 / 0.8)" }}
            >
              探索频道
            </h1>
            <p
              className="mx-auto max-w-lg text-base text-white/70 sm:text-lg"
              style={{ textShadow: "0 2px 10px rgb(0 0 0 / 0.5)" }}
            >
              选择一个方向，开始你的旅程
            </p>
          </motion.div>

          {/* 滚动提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/50 tracking-wider">
              向下滚动探索
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="size-5 rounded-full border border-white/30 flex items-center justify-center"
            >
              <span className="text-white/40 text-[10px]">↓</span>
            </motion.div>
          </motion.div>
        </div>

        {/* 第 2 屏：过渡 */}
        <div className="flex h-screen items-center justify-center px-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl text-white/60 sm:text-2xl"
            style={{ textShadow: "0 2px 20px rgb(0 0 0 / 0.7)" }}
          >
            连接校园，共享智慧
          </motion.p>
        </div>
      </div>

      {/* ====== 内容区（滚动到达后显示） ====== */}
      <div className="relative z-10 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          {children}
        </div>
      </div>
    </>
  );
}
