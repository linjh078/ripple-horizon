"use client";

import { NavCardGrid } from "@/components/home/nav-card-grid";
import { SpaceButton } from "@/components/home/home-actions";
import { ScrollVideoHero } from "@/components/home/scroll-video-hero";
import { motion } from "framer-motion";

export default function ExplorePage() {
  return (
    <ScrollVideoHero>
      {/* 导航卡片区域 — 视频播完后丝滑登场 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <NavCardGrid />
      </motion.section>

      {/* 底部个人空间引导 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="mt-12 rounded-xl border bg-card p-8 text-center"
      >
        <h3 className="mb-2 text-xl font-semibold">拥有你的个人空间</h3>
        <p className="mb-4 text-muted-foreground">
          建立个人主页，记录在校时间轴，分享你的成长故事与心得。
          <br />
          让每一次经历都成为他人前行的灯塔。
        </p>
        <SpaceButton />
      </motion.section>
    </ScrollVideoHero>
  );
}
