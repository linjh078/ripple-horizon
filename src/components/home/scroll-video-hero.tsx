"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ExploreIntroVideo — 探索频道自动播放视频开场
 *
 * 进入页面后自动播放 earth.mp4 一次，播放完毕后
 * 标题淡出、导航卡片丝滑淡入。视频继续作为背景循环。
 */
export function ScrollVideoHero({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"loading" | "playing" | "complete">("loading");
  const hasPlayedOnce = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 自动播放视频
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasPlayedOnce.current) return;

    const playVideo = async () => {
      try {
        await video.play();
        hasPlayedOnce.current = true;
        setPhase("playing");
      } catch {
        // 自动播放被阻止时直接展示内容
        setPhase("complete");
      }
    };
    playVideo();

    const handleEnded = () => {
      setPhase("complete");
      // 视频结束后继续循环作为背景
      video.loop = true;
      video.play().catch(() => {});
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  if (!mounted) {
    return (
      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ====== 视频背景 — 固定全屏 ====== */}
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
        {/* 暗色叠加 — 视频阶段更深，内容阶段浅一点 */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            phase === "complete" ? "bg-black/40" : "bg-black/30"
          }`}
        />
      </div>

      {/* ====== 开场标题遮罩 — 视频播完后淡出 ====== */}
      <AnimatePresence>
        {phase !== "complete" && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
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

            {/* 加载/播放中指示器 */}
            {phase === "loading" && (
              <div className="absolute bottom-12 flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-xs text-white/50">加载中...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 内容区 — 视频播完后丝滑淡入 ====== */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10"
          >
            {/* 半透明背景 — 视频透出但不影响文字可读性 */}
            <div className="bg-background/92 backdrop-blur-sm">
              <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
