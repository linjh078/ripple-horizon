"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, MessageCircle } from "lucide-react";
import { BlurText } from "./blur-text";
import { LocalNav } from "./local-nav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260317_100335_dc625816-c3c1-4b00-b93e-4cb301cf5ea5.mp4";

/**
 * CinematicHero — 电影感视频背景 Hero（单页版）
 *
 * 全屏自动播放视频 + 液态玻璃导航栏 + BlurText 逐词动画 +
 * 点击"开始探索"跳转 /explore，"加入我们"弹出作者微信。
 * 首页不再包含滚动内容区。
 */
export function CinematicHero() {
  const prefersReduced = useReducedMotion();
  const [missionOpen, setMissionOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 强制触发视频播放（解决 hydration 后 autoPlay 失效）
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = video.play();
    if (play !== undefined) {
      play.catch(() => {
        // 浏览器拦截自动播放，静默忽略（muted 通常不会被拦）
      });
    }
  }, []);

  return (
    <>
      {/* ====== 视频背景层 ====== */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* 视频加载前黑色兜底 */}
        <div className="absolute inset-0 bg-black" />

        {/* 全屏视频 — 优先本地文件，回退 CDN */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* 暗色叠加层 — 确保白色文字可读 */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ====== 首页悬浮导航栏 ====== */}
      <LocalNav />

      {/* ====== Hero 内容区 ====== */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* 徽章 */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="liquid-glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white"
          style={{
            backgroundColor: "rgb(255 255 255 / 0.08)",
            textShadow: "0 1px 3px rgb(0 0 0 / 0.5)",
          }}
        >
          <Sparkles className="size-3.5 text-white/80" />
          <span>广东石油化工学院知识分享平台</span>
        </motion.div>

        {/* 标题 — BlurText 逐词动画 */}
        <BlurText
          text="观澜知远"
          className="mb-3 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          duration={0.35}
          stagger={0.12}
          style={{ textShadow: "0 4px 40px rgb(0 0 0 / 0.6)" }}
        />

        {/* 副标题小字 */}
        <motion.p
          initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="mb-6 text-lg text-white/80 tracking-widest"
          style={{ textShadow: "0 2px 15px rgb(0 0 0 / 0.5)" }}
        >
          观往来之澜，知山河之远
        </motion.p>

        {/* 描述 — 延迟淡入 + 模糊消除 */}
        <motion.p
          initial={prefersReduced ? {} : { filter: "blur(4px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-xl text-base text-white/85 sm:text-lg leading-relaxed"
          style={{ textShadow: "0 2px 10px rgb(0 0 0 / 0.4)" }}
        >
          连接校园，共享智慧
          <br className="hidden sm:block" />
          记录你的成长轨迹，与校友一起拓展视野
        </motion.p>

        {/* CTA 按钮组 — 延迟淡入 */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          {/* 主 CTA: 开始探索 → /explore */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-xl transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
          >
            开始探索
            <ArrowRight className="size-4" />
          </Link>

          {/* 次 CTA: 加入我们 → 微信弹窗 */}
          <button
            onClick={() => setJoinOpen(true)}
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/[0.06] hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: "rgb(255 255 255 / 0.04)" }}
          >
            加入我们
            <ArrowRight className="size-4" />
          </button>
        </motion.div>

        {/* 网站初心 — 小字链接 */}
        <motion.button
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5, ease: "easeOut" }}
          onClick={() => setMissionOpen(true)}
          className="mt-5 inline-flex items-center gap-1 text-xs text-white/65 hover:text-white/90 transition-colors cursor-pointer"
          style={{ textShadow: "0 1px 4px rgb(0 0 0 / 0.5)" }}
        >
          <Heart className="size-3 text-red-400" />
          网站初心
        </motion.button>

        {/* 网站初心 Dialog */}
        <Dialog open={missionOpen} onOpenChange={setMissionOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Heart className="size-5 text-red-500" />
                网站初心
              </DialogTitle>
              <DialogDescription className="pt-2 text-base leading-relaxed text-foreground/80">
                这是在学校的最后一段空闲时光，我想再多做几个项目。后来觉得要是有人能在大一时带带我，我现在应该也是半个技术大佬了吧。于是两个想法一拍即合，构建一个信息分享网站的项目，淋过雨，现在可以为后面的人撑伞，顺便锻炼一下自己做实际项目的能力。
              </DialogDescription>
            </DialogHeader>
            <p className="text-xs text-muted-foreground text-center">
              （后续还会补充更多内容，敬请期待）
            </p>
          </DialogContent>
        </Dialog>

        {/* 加入我们 Dialog — 微信联系 */}
        <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
          <DialogContent className="max-w-sm text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2">
                <MessageCircle className="size-5 text-green-500" />
                联系作者
              </DialogTitle>
              <DialogDescription className="pt-2 text-base">
                欢迎加入观澜知远！请添加作者微信交流：
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">微信号</p>
              <p className="text-xl font-bold tracking-wider">13714249330</p>
            </div>
            <p className="text-xs text-muted-foreground">
              添加时请备注"观澜知远"，感谢支持！
            </p>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
