import { NavCardGrid } from "@/components/home/nav-card-grid";
import { SpaceButton } from "@/components/home/home-actions";
import { Compass } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* 标题 */}
      <div className="mb-8 flex items-center gap-2">
        <Compass className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">探索频道</h1>
      </div>

      {/* 导航卡片区域 */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">
            选择一个方向开始你的旅程
          </h2>
        </div>
        <NavCardGrid />
      </section>

      {/* 底部个人空间引导 */}
      <section className="mt-12 rounded-xl border bg-card p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">拥有你的个人空间</h3>
        <p className="mb-4 text-muted-foreground">
          建立个人主页，记录在校时间轴，分享你的成长故事与心得。
          <br />
          让每一次经历都成为他人前行的灯塔。
        </p>
        <SpaceButton />
      </section>
    </div>
  );
}
