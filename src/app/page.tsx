import { NavCardGrid } from "@/components/home/nav-card-grid";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      {/* Hero 区域 */}
      <section className="mb-12 text-center sm:mb-16">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground w-fit">
          <Sparkles className="size-3.5 text-primary" />
          <span>广东石油化工学院知识分享平台</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          观澜知远
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          连接校园，共享智慧。在这里发现学习资源、优质课程、实用工具，
          <br className="hidden sm:block" />
          记录你的成长轨迹，与校友一起拓展视野。
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/posts"
            className={cn(buttonVariants({ size: "default" }))}
          >
            开始探索
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            加入我们
          </Link>
        </div>
      </section>

      {/* 导航卡片区域 */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">探索频道</h2>
          <span className="text-sm text-muted-foreground">
            — 选择一个方向开始你的旅程
          </span>
        </div>
        <NavCardGrid />
      </section>

      {/* 底部个人空间引导 */}
      <section className="mt-16 rounded-xl border bg-card p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">拥有你的个人空间</h3>
        <p className="mb-4 text-muted-foreground">
          建立个人主页，记录在校时间轴，分享你的成长故事与心得。
          <br />
          让每一次经历都成为他人前行的灯塔。
        </p>
        <Link
          href="/register"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          创建我的空间
        </Link>
      </section>
    </div>
  );
}
