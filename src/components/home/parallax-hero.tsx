"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 视差滚动英雄区 — v5 实景照片版
 *
 * 四层实景照片 + CSS 渐变天空，不同速度滚动视差。
 * 点击"开始探索" → 背景变淡为背景 → 内容区淡入。
 * sessionStorage 记录"本次会话已看过"，刷新/重开浏览器重新播放。
 */
export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [explored, setExplored] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 检查本次会话是否已看过 intro
  useEffect(() => {
    const seen = sessionStorage.getItem("home-intro-seen");
    if (seen === "true") {
      setExplored(true);
      setShowContent(true);
    }
    setMounted(true);
  }, []);

  // 点击"开始探索"
  function handleExplore() {
    sessionStorage.setItem("home-intro-seen", "true");
    setExplored(true);
    // 延时让背景先开始变淡，再显示内容
    setTimeout(() => setShowContent(true), 500);
  }

  // 滚动视差：使用 rAF 节流
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setOffset(-rect.top);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const getLayerY = (speed: number) => offset * speed;

  if (!mounted) {
    // SSR / 首次渲染：显示占位，防止 hydration 闪烁
    return (
      <>
        <div className="h-screen min-h-[600px]" />
        <div className="relative z-10 opacity-0">{children}</div>
      </>
    );
  }

  return (
    <>
      {/* ====== 视差背景层（始终存在，explore 后变淡） ====== */}
      <div
        ref={containerRef}
        className={cn(
          "fixed inset-0 z-0 overflow-hidden transition-all duration-1000 ease-in-out",
          explored ? "opacity-[0.12]" : "opacity-100"
        )}
        aria-hidden="true"
      >
        {/* 第 1 层：CSS 天空渐变（底层，几乎不动） */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${getLayerY(0.04)}px)`,
            background:
              "linear-gradient(180deg, #1a1a4e 0%, #2d3a7a 15%, #4a6fa5 35%, #7eb8da 55%, #c9e4f7 75%, #e8f4fd 100%)",
          }}
        />

        {/* 第 2 层：天空云朵照片（软光混合） */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${getLayerY(0.1)}px)`,
            backgroundImage: "url(/images/parallax/sky.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
            mixBlendMode: "soft-light",
          }}
        />

        {/* 第 3 层：远山照片 */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${getLayerY(0.22)}px) translateZ(0)`,
            backgroundImage: "url(/images/parallax/mountains.png)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

        {/* 第 4 层：森林照片（中景） */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${getLayerY(0.4)}px) translateZ(0)`,
            backgroundImage: "url(/images/parallax/forest.png)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

        {/* 第 5 层：河流照片（前景，移动最快） */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${getLayerY(0.65)}px) translateZ(0)`,
            backgroundImage: "url(/images/parallax/river.png)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

        {/* 底部白色渐变（衔接下方内容） */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "30%",
            background:
              "linear-gradient(transparent, rgba(255,255,255,0.5), rgba(255,255,255,0.9))",
          }}
        />

        {/* 顶部暗角遮罩（让白色文字可读） */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)",
          }}
        />
      </div>

      {/* ====== Intro 覆盖层（标题 + 按钮） ====== */}
      {!explored && (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-500">
          {/* 大标题 */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wider mb-4 drop-shadow-lg animate-in fade-in"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
          >
            观澜知远
          </h1>
          <p
            className="text-base sm:text-lg text-white/90 mb-8 drop-shadow-md text-center px-4 max-w-lg"
            style={{ textShadow: "0 2px 15px rgba(0,0,0,0.5)" }}
          >
            连接校园，共享智慧 — 发现学习资源，记录成长轨迹
          </p>
          <button
            onClick={handleExplore}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-8 py-3.5 cursor-pointer",
              "bg-white/95 text-slate-800 font-semibold text-lg",
              "shadow-xl hover:shadow-2xl hover:bg-white",
              "transition-all duration-300 hover:scale-105 active:scale-95",
              "backdrop-blur-sm"
            )}
          >
            开始探索
            <ArrowRight className="size-5" />
          </button>
        </div>
      )}

      {/* ====== 占位空间（intro 模式下撑满屏幕） ====== */}
      {!explored && <div className="h-screen min-h-[600px]" />}

      {/* ====== 内容区（explore 后淡入） ====== */}
      <div
        className={cn(
          "relative z-10 transition-all duration-700 ease-out",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        {children}
      </div>
    </>
  );
}
