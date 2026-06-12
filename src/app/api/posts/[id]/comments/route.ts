import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/posts/[id]/comments — 获取帖子的评论列表
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // 限制最大返回条数
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "加载评论失败" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/comments — 添加评论（需登录）
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "请输入评论内容" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "评论发布失败，请稍后重试" },
      { status: 500 }
    );
  }
}
