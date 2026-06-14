import { NavCardGrid } from "@/components/home/nav-card-grid";
import { SpaceButton } from "@/components/home/home-actions";
import { ScrollVideoHero } from "@/components/home/scroll-video-hero";

export default function ExplorePage() {
  return (
    <ScrollVideoHero>
      {/* 导航卡片区域 */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-foreground">
          选择一个方向开始你的旅程
        </h2>
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
    </ScrollVideoHero>
  );
}
