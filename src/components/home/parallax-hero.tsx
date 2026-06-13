"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 视差滚动英雄区
 *
 * 多层视差效果：天空 → 远山 → 雪山 → 森林 → 河流 → 人物 → 前景
 * 使用 requestAnimationFrame 实现丝滑的滚动视差
 */
export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = -rect.top;
    setOffset(scrollY);

    // 当英雄区完全滚出视口后隐藏（减少性能开销）
    setVisible(rect.bottom > 0);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // 使用 passive: true 提升滚动性能
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始调用
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, visible]);

  // 各层视差速度系数（0 = 不动，1 = 跟滚动同步）
  const layers = [
    { speed: 0.1, label: "天空" },
    { speed: 0.2, label: "远山" },
    { speed: 0.35, label: "雪山" },
    { speed: 0.5, label: "森林" },
    { speed: 0.7, label: "河流" },
    { speed: 0.85, label: "人物" },
  ];

  // 计算每层的 Y 偏移
  const getLayerY = (speed: number) => offset * speed;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "600px" }}
    >
      {/* ====== 第 1 层：天空渐变（最远，几乎不动）====== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translateY(${getLayerY(0.08)}px)`,
          background:
            "linear-gradient(180deg, #1a1a4e 0%, #2d3a7a 15%, #4a6fa5 35%, #7eb8da 55%, #c9e4f7 75%, #e8f4fd 100%)",
        }}
      >
        {/* 太阳光晕 */}
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: "180px",
            height: "180px",
            top: "12%",
            right: "20%",
            background:
              "radial-gradient(circle, rgba(255,240,220,0.9) 0%, rgba(255,200,150,0.3) 40%, transparent 70%)",
          }}
        />
        {/* 云朵 */}
        <Clouds />
      </div>

      {/* ====== 第 2 层：远山轮廓 ====== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${getLayerY(0.2)}px)` }}
      >
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
          style={{ height: "55%" }}
        >
          {/* 远处淡色山峦 */}
          <polygon points="0,400 0,200 100,160 200,180 300,120 400,150 500,100 600,140 700,90 800,130 900,110 1000,150 1100,100 1200,140 1300,120 1440,170 1440,400" fill="#5b7fa5" opacity="0.6" />
          <polygon points="0,400 0,230 150,190 250,210 380,160 500,200 620,150 750,195 880,170 1000,210 1150,175 1300,200 1440,180 1440,400" fill="#4a6a8a" opacity="0.5" />
        </svg>
      </div>

      {/* ====== 第 3 层：雪山（核心视觉）===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${getLayerY(0.35)}px)` }}
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
          style={{ height: "70%" }}
        >
          {/* 左侧大雪山 */}
          <polygon points="50,500 150,180 200,240 230,200 280,260 320,200 370,500" fill="#e8f0f8" />
          <polygon points="150,180 200,240 230,200 280,260 320,200 250,120" fill="#ffffff" />
          {/* 雪顶高光 */}
          <polygon points="220,150 250,120 280,140 260,170 235,165" fill="#f0f8ff" opacity="0.9" />

          {/* 中间主峰（最高） */}
          <polygon points="400,500 500,80 550,180 600,130 650,190 700,140 750,500" fill="#dce8f2" />
          <polygon points="500,80 550,180 600,130 520,70" fill="#ffffff" />
          <polygon points="530,95 565,120 595,100 580,130 550,125" fill="#f8fcff" opacity="0.95" />

          {/* 右侧雪山群 */}
          <polygon points="750,500 830,200 870,250 910,210 960,280 1000,230 1050,500" fill="#e2ecf4" />
          <polygon points="830,200 870,250 910,210 860,170" fill="#ffffff" />
          <polygon points="960,280 1000,230 980,200" fill="#f0f6fc" opacity="0.8" />

          {/* 最右侧小山 */}
          <polygon points="1050,500 1150,300 1200,340 1250,310 1300,360 1440,320 1440,500" fill="#d5e2ed" />
          <polygon points="1150,300 1200,340 1250,310 1190,265" fill="#f4f8fc" opacity="0.7" />
        </svg>
      </div>

      {/* ====== 第 4 层：森林（针叶林剪影）===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${getLayerY(0.5)}px)` }}
      >
        <svg
          viewBox="0 0 1440 350"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
          style={{ height: "50%" }}
        >
          {/* 深绿色森林带 */}
          <rect x="0" y="120" width="1440" height="230" fill="#1a3a2a" />
          {/* 树木剪影 */}
          {generateTrees()}
          {/* 雾气效果 */}
          <ellipse cx="300" cy="160" rx="250" ry="20" fill="#b8d4e3" opacity="0.15" />
          <ellipse cx="900" cy="155" rx="300" ry="18" fill="#b8d4e3" opacity="0.12" />
          <ellipse cx="600" cy="170" rx="200" ry="15" fill="#c5dde8" opacity="0.1" />
        </svg>
      </div>

      {/* ====== 第 5 层：河流 ====== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${getLayerY(0.7)}px)` }}
      >
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
          style={{ height: "30%" }}
        >
          {/* 河流主体 */}
          <path
            d="M0,200 L300,160 Q400,150 500,155 Q600,160 700,145 Q800,130 900,140 Q1000,150 1100,135 Q1200,120 1300,130 L1440,125 L1440,200 Z"
            fill="#3a7cc3"
            opacity="0.85"
          />
          {/* 水面反光 */}
          <path
            d="M350,165 Q400,155 450,162 Q500,168 550,158"
            stroke="#8cc8f0"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M700,148 Q780,135 850,143 Q920,150 1000,138"
            stroke="#8cc8f0"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          {/* 河岸 */}
          <path
            d="M0,195 L280,158 L350,162 L480,152 L580,158 L680,142 L780,138 L880,148 L980,138 L1080,142 L1180,132 L1280,136 L1440,128"
            stroke="#2a5a3a"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* ====== 第 6 层：冒险者人物（最近，移动最快）====== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${getLayerY(0.85)}px)` }}
      >
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
          style={{ height: "40%" }}
        >
          {/* 一行冒险者小队 */}
          <g transform="translate(300, 200)">
            {/* 第一个人（领队） */}
            <circle cx="0" cy="-20" r="6" fill="#d4a574" />
            <line x1="0" y1="-14" x2="0" y2="10" stroke="#2d5a1e" strokeWidth="3" />
            <line x1="-5" y1="5" x2="5" y2="5" stroke="#2d5a1e" strokeWidth="2" />
            {/* 杖子 */}
            <line x1="5" y1="-8" x2="10" y2="15" stroke="#8B4513" strokeWidth="1.5" />
            {/* 背包 */}
            <rect x="-8" y="-8" width="6" height="10" rx="1" fill="#6b3a2a" />
          </g>

          <g transform="translate(360, 210)">
            <circle cx="0" cy="-18" r="5.5" fill="#f0c8a0" />
            <line x1="0" y1="-12" x2="0" y2="8" stroke="#1a5a3a" strokeWidth="3" />
            <line x1="-4" y1="4" x2="4" y2="4" stroke="#1a5a3a" strokeWidth="2" />
            <rect x="-7" y="-6" width="5" height="9" rx="1" fill="#8b4513" />
          </g>

          <g transform="translate(410, 195)">
            <circle cx="0" cy="-19" r="6" fill="#e8b88a" />
            <line x1="0" y1="-13" x2="0" y2="10" stroke="#3a6b2a" strokeWidth="3" />
            <line x1="-5" y1="5" x2="5" y2="5" stroke="#3a6b2a" strokeWidth="2" />
            <rect x="-8" y="-7" width="6" height="10" rx="1" fill="#5a3a1a" />
            {/* 举旗 */}
            <line x1="6" y1="-15" x2="6" y2="10" stroke="#8B4513" strokeWidth="1" />
            <polygon points="6,-15 18,-10 6,-5" fill="#e74c3c" opacity="0.8" />
          </g>

          <g transform="translate(470, 205)">
            <circle cx="0" cy="-17" r="5" fill="#d4a574" />
            <line x1="0" y1="-12" x2="0" y2="8" stroke="#2d4a1e" strokeWidth="2.5" />
            <line x1="-4" y1="3" x2="4" y2="3" stroke="#2d4a1e" strokeWidth="2" />
            <rect x="-6" y="-5" width="5" height="8" rx="1" fill="#7a4a2a" />
          </g>

          <g transform="translate(520, 198)">
            <circle cx="0" cy="-20" r="6" fill="#f5d0a8" />
            <line x1="0" y1="-14" x2="0" y2="10" stroke="#1a4a2a" strokeWidth="3" />
            <line x1="-5" y1="5" x2="5" y2="5" stroke="#1a4a2a" strokeWidth="2" />
            <rect x="-8" y="-8" width="6" height="10" rx="1" fill="#6b3a2a" />
            {/* 地图 */}
            <rect x="6" y="-12" width="8" height="6" rx="0.5" fill="#f5deb3" stroke="#8B4513" strokeWidth="0.5" />
          </g>

          {/* 宝藏标记点（前方） */}
          <g transform="translate(620, 185)">
            <text x="0" y="0" fontSize="16" textAnchor="middle" fill="#ffd700" opacity="0.9">⭐</text>
            <text x="0" y="14" fontSize="9" textAnchor="middle" fill="#ffd700" opacity="0.7">TREASURE</text>
          </g>
        </svg>
      </div>

      {/* ====== 前景：Vignette 遮罩 + 按钮 ====== */}
      {/* 底部渐变遮罩，让文字更可读 */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "30%",
          background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
        }}
      />

      {/* 中央内容：标题 + 按钮 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wider mb-4 drop-shadow-lg"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        >
          观澜知远
        </h1>
        <p
          className="text-base sm:text-lg text-white/90 mb-8 drop-shadow-md text-center px-4"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
        >
          连接校园，共享智慧
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> — 发现学习资源，记录成长轨迹</span>
        </p>
        <a
          href="#explore-section"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("explore-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-8 py-3.5",
            "bg-white/95 text-slate-800 font-semibold text-lg",
            "shadow-xl hover:shadow-2xl hover:bg-white",
            "transition-all duration-300 hover:scale-105",
            "backdrop-blur-sm"
          )}
        >
          开始探索
          <ArrowRight className="size-5" />
        </a>
        {/* 向下滚动提示 */}
        <p className="mt-6 text-white/60 text-sm animate-bounce">↓ 向下滚动探索更多</p>
      </div>
    </div>
  );
}

/** 飘浮云朵 */
function Clouds() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute top-0 w-full"
      style={{ height: "40%" }}
    >
      <g fill="white" opacity="0.4">
        <ellipse cx="200" cy="60" rx="80" ry="25" />
        <ellipse cx="250" cy="50" rx="60" ry="20" />
        <ellipse cx="180" cy="55" rx="50" ry="18" />

        <ellipse cx="800" cy="40" rx="90" ry="22" />
        <ellipse cx="860" cy="32" rx="65" ry="18" />
        <ellipse cx="770" cy="35" rx="55" ry="16" />

        <ellipse cx="1200" cy="70" rx="70" ry="20" />
        <ellipse cx="1240" cy="62" rx="50" ry="16" />
      </g>
      {/* 更透明的远处云 */}
      <g fill="white" opacity="0.2">
        <ellipse cx="550" cy="90" rx="100" ry="18" />
        <ellipse cx="600" cy="82" rx="70" ry="14" />
        <ellipse cx="1050" cy="50" rx="75" ry="15" />
        <ellipse cx="1090" cy="44" rx="55" ry="12" />
      </g>
    </svg>
  );
}

/** 生成针叶林树木剪影 */
function generateTrees() {
  const trees: React.ReactNode[] = [];
  // 随机生成不同高度的树木
  const positions = [
    20, 55, 90, 130, 170, 200, 240, 280, 310, 350, 390, 420, 460,
    500, 540, 570, 610, 650, 690, 720, 760, 800, 840, 870, 910,
    950, 990, 1020, 1060, 1090, 1130, 1170, 1210, 1240, 1280,
    1310, 1350, 1390, 1420,
  ];

  positions.forEach((x, i) => {
    const h1 = 60 + (i % 5) * 15; // 树第一层高度
    const h2 = h1 + 30; // 树第二层
    const h3 = h2 + 35; // 树第三层（最高的尖）
    const w1 = 35 + (i % 3) * 5;

    trees.push(
      <g key={`tree-${i}`}>
        {/* 树干 */}
        <rect x={x - 2} y={160 - h1 + 20} width={4} height={h1 - 20} fill="#3d2b1f" />
        {/* 三层树冠（从下到上，从宽到窄） */}
        <polygon
          points={`${x},${160 - h1} ${x - w1},${160} ${x + w1},${160}`}
          fill="#1a4a2a"
        />
        <polygon
          points={`${x},${160 - h2} ${x - w1 + 8},${160 - h1 + 10} ${x + w1 - 8},${160 - h1 + 10}`}
          fill="#1d5530"
        />
        <polygon
          points={`${x},${160 - h3} ${x - w1 + 16},${160 - h2 + 10} ${x + w1 - 16},${160 - h2 + 10}`}
          fill="#1f5e35"
        />
      </g>
    );
  });

  return trees;
}
