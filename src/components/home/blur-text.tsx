"use client";

import { motion, useReducedMotion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  stagger?: number;
}

/**
 * BlurText — 逐词模糊淡入动画
 *
 * 将文本按空格拆分为单个词，每个词独立从 blur(10px) + 透明
 * 过渡到 blur(0) + 显示，以 100ms 交错延迟依次出现。
 * 在 prefers-reduced-motion 时直接渲染纯文本。
 */
export function BlurText({
  text,
  className,
  style,
  duration = 0.35,
  stagger = 0.1,
}: BlurTextProps) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return <span className={className} style={style}>{text}</span>;
  }

  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration, delay: i * stagger, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
