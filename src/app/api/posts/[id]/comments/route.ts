import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDelete } from "@/lib/permissions";
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
      take: 50,
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
      data: { content, postId: id, authorId: session.user.id },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "评论发布失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]/comments?commentId=xxx — 删除评论
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params; // consume params
    const commentId = req.nextUrl.searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json({ error: "缺少评论 ID" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return NextResponse.json({ error: "评论不存在" }, { status: 404 });
    }

    if (!(await canDelete(comment.authorId))) {
      return NextResponse.json({ error: "无权删除此评论" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
