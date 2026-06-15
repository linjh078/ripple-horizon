"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** 视频播放到 20% 时定格——地球初现，快速切入 */
const JUMP_AT = 0.2;
/** sessionStorage key —— 同一次浏览器会话内回退不再重播 */
const INTRO_KEY = "explore-intro-played";

/**
 * ExploreIntroVideo — 探索频道自动播放视频开场
 *
 * 首次进入自动播放 earth.mp4 到 20% 定格，标题淡出、导航卡片丝滑淡入。
 * 同一次浏览器会话内从子页面回退时跳过动画，直接展示内容。
 * 关闭标签页/浏览器后重新进入网站时再次播放。
 */
export function ScrollVideoHero({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"loading" | "playing" | "complete">("loading");
  const hasPlayedOnce = useRef(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 自动播放视频 — 到达 JUMP_AT 时定格
  useEffect(() => {
    if (!mounted) return;

    // 回退时不重播：sessionStorage 命中则直接展示内容
    if (typeof window !== "undefined" && sessionStorage.getItem(INTRO_KEY) === "1") {
      setPhase("complete");
      return;
    }

    const video = videoRef.current;
    if (!video || hasPlayedOnce.current) return;

    // 超时兜底：5 秒后无论如何展示内容
    const timeout = setTimeout(() => {
      if (phaseRef.current !== "complete") {
        sessionStorage.setItem(INTRO_KEY, "1");
        setPhase("complete");
      }
    }, 5000);

    const handleCanPlay = () => {
      clearTimeout(timeout);
      if (hasPlayedOnce.current) return;
      video.play().then(() => {
        hasPlayedOnce.current = true;
        setPhase("playing");
      }).catch(() => {
        sessionStorage.setItem(INTRO_KEY, "1");
        setPhase("complete");
      });
    };

    // 时间检查：到达卫星近景时定格
    const handleTimeUpdate = () => {
      if (phaseRef.current !== "playing") return;
      if (video.duration && video.currentTime >= video.duration * JUMP_AT) {
        video.pause();
        sessionStorage.setItem(INTRO_KEY, "1");
        setPhase("complete");
      }
    };

    if (video.readyState >= 2) {
      handleCanPlay();
    } else {
      video.addEventListener("canplay", handleCanPlay);
    }
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      clearTimeout(timeout);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [mounted]);

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
      {/* ====== 视频背景 — 固定全屏，定格后作静态背景 ====== */}
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
        {/* 播放中：暗色叠加；定格后：更浅叠加露出视频帧 */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            phase === "complete" ? "bg-black/15" : "bg-black/30"
          }`}
        />
      </div>

      {/* ====== 开场标题遮罩 — 定格后淡出 ====== */}
      <AnimatePresence>
        {phase !== "complete" && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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

            {phase === "loading" && (
              <div className="absolute bottom-12 flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-xs text-white/50">加载中...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 内容区 — 定格后丝滑淡入，视频帧作背景 ====== */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10"
          >
            <div className="bg-black/10 backdrop-blur-[2px]">
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
