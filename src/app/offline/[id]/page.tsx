import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import { DeleteButton } from "@/components/shared/delete-button";
import { deleteOfflineEvent } from "@/lib/actions/life";
import { Calendar, Clock, MapPin } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "沙龙": "bg-blue-50 text-blue-700",
  "分享会": "bg-purple-50 text-purple-700",
  "学习小组": "bg-green-50 text-green-700",
  "其他": "bg-gray-50 text-gray-700",
};

export default async function OfflineEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const event = await prisma.offlineEvent.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <BackButton href="/offline" label="返回线下空间" />
        {currentUserId === event.author.id && (
          <DeleteButton action={deleteOfflineEvent} itemId={event.id} itemLabel={event.title} redirectTo="/offline" />
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <Badge className={CATEGORY_COLORS[event.category] || ""}>{event.category}</Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {event.eventDate.toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <Separator className="mb-6" />

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
          {event.description}
        </p>
      </div>

      <Separator className="mb-4" />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="size-3.5" />
        <span>由 {event.author.name} 发起 · 发布于 {event.createdAt.toLocaleDateString("zh-CN")}</span>
      </div>
    </div>
  );
}
