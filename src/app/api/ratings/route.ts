import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/ratings?targetId=xxx&targetType=xxx — 获取某个对象的所有评级统计
export async function GET(req: NextRequest) {
  try {
    const targetId = req.nextUrl.searchParams.get("targetId");
    const targetType = req.nextUrl.searchParams.get("targetType");
    if (!targetId || !targetType) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    // 获取当前用户对该对象的投票
    const session = await auth();
    let myVote: string | null = null;
    if (session?.user?.id) {
      const mine = await prisma.rating.findUnique({
        where: { targetId_targetType_userId: { targetId, targetType, userId: session.user.id } },
        select: { rating: true },
      });
      myVote = mine?.rating ?? null;
    }

    // 统计各等级的票数
    const ratings = await prisma.rating.groupBy({
      by: ["rating"],
      where: { targetId, targetType },
      _count: { rating: true },
    });

    const counts: Record<string, number> = {
      "夯": 0,
      "顶级": 0,
      "人上人": 0,
      "NPC": 0,
      "拉完了": 0,
    };
    for (const r of ratings) {
      counts[r.rating] = r._count.rating;
    }

    return NextResponse.json({ counts, myVote });
  } catch {
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}

// POST /api/ratings — 投票（upsert：点击切换，再点取消？不，再点可以重新选择）
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { targetId, targetType, rating } = await req.json();
    if (!targetId || !targetType || !rating) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const validRatings = ["夯", "顶级", "人上人", "NPC", "拉完了"];
    if (!validRatings.includes(rating)) {
      return NextResponse.json({ error: "无效的评级" }, { status: 400 });
    }

    // 检查是否已有投票 — upsert 会覆盖旧值（允许改变选择）
    await prisma.rating.upsert({
      where: {
        targetId_targetType_userId: {
          targetId,
          targetType,
          userId: session.user.id,
        },
      },
      update: { rating },
      create: {
        targetId,
        targetType,
        userId: session.user.id,
        rating,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "投票失败" }, { status: 500 });
  }
}
