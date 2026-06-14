import { NavCardGrid } from "@/components/home/nav-card-grid";
import { SpaceButton } from "@/components/home/home-actions";
import { CinematicHero } from "@/components/home/cinematic-hero";

export default function HomePage() {
  return (
    <CinematicHero>
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
        <SpaceButton />
      </section>
    </CinematicHero>
  );
}
