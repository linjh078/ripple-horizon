import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/space/event-form";
import { DeleteEventButton } from "@/components/space/delete-event-button";
import { ProfileEditor } from "@/components/space/profile-editor";
import { BackButton } from "@/components/shared/back-button";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "在校生",
  TEACHER: "教师",
  ALUMNI: "校友",
  HR: "企业HR",
  ADMIN: "管理员",
};

export default async function SpacePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();
  const isOwner = session?.user?.id === userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      lifeEvents: { orderBy: { eventDate: "desc" } },
      posts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, category: true, createdAt: true, likeCount: true },
      },
      _count: { select: { posts: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BackButton label="返回探索" />
      {/* 个人信息头部 */}
      <div className="flex flex-col items-center text-center mb-8 sm:flex-row sm:text-left sm:gap-6">
        <Avatar className="size-20 mb-4 sm:mb-0">
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {user.name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <Badge variant="secondary">{ROLE_LABELS[user.role] || user.role}</Badge>
          </div>
          {[user.department, user.major].filter(Boolean).length > 0 && (
            <p className="text-sm text-muted-foreground">
              {[user.department, user.major].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            加入于 {new Date(user.createdAt).toLocaleDateString("zh-CN")} ·{" "}
            {user._count.posts} 篇分享
          </p>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* 时间轴 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">时间轴</h2>
        {isOwner && <EventForm userId={user.id} />}
      </div>
      {user.lifeEvents.length === 0 ? (
        <p className="text-muted-foreground text-sm">还没有人生事件</p>
      ) : (
        <div className="relative border-l-2 border-muted ml-3 pl-8 space-y-8">
          {user.lifeEvents.map((event) => (
            <div key={event.id} className="relative overflow-hidden min-w-0 pr-8">
              {/* 时间轴圆点 */}
              <div className="absolute -left-[35px] size-3 rounded-full border-2 border-primary bg-background mt-1.5" />
              <time className="text-xs text-muted-foreground">
                {new Date(event.eventDate).toLocaleDateString("zh-CN")}
              </time>
              <h3 className="font-semibold mt-1 break-words">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                {event.content}
              </p>
              {event.imageUrls && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {JSON.parse(event.imageUrls).map((url: string, i: number) => (
                    <img key={i} src={url} alt="" className="size-20 object-cover rounded-md border" />
                  ))}
                </div>
              )}
              {isOwner && <DeleteEventButton eventId={event.id} />}
            </div>
          ))}
        </div>
      )}

      {/* 个人介绍 + 留言板 */}
      <section className="my-8">
        <ProfileEditor
          department={user.department}
          major={user.major}
          bio={user.bio}
          isOwner={isOwner}
        />
      </section>

      {/* 最近的帖子 */}
      {user.posts.length > 0 && (
        <>
          <Separator className="my-8" />
          <h2 className="text-xl font-bold mb-4">最近分享</h2>
          <div className="space-y-3">
            {user.posts.map((post) => (
              <a
                key={post.id}
                href={`/posts/${post.id}`}
                className="block rounded-lg border p-4 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")} ·{" "}
                  {post.likeCount} 赞
                </p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
