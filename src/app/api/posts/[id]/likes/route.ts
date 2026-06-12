import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/posts/[id]/likes — 切换点赞状态（需登录）
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = session.user.id;

    // 检查是否已点赞
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      // 取消点赞
      await prisma.like.delete({ where: { id: existing.id } });
      // 仅当 likeCount > 0 时才递减，防止负数
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { likeCount: true },
      });
      if (post && post.likeCount > 0) {
        await prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
      }
      return NextResponse.json({ liked: false });
    } else {
      // 添加点赞
      await prisma.like.create({ data: { postId, userId } });
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return NextResponse.json({ liked: true });
    }
  } catch {
    return NextResponse.json(
      { error: "操作失败，请稍后重试" },
      { status: 500 }
    );
  }
}
