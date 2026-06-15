import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/shared/back-button";
import { DeleteButton } from "@/components/shared/delete-button";
import { OfflineEventForm } from "@/components/offline/event-form";
import { EditOfflineEventForm } from "@/components/offline/edit-event-form";
import { deleteOfflineEvent } from "@/lib/actions/life";

const CATEGORY_COLORS: Record<string, string> = {
  "沙龙": "bg-blue-50 text-blue-700",
  "分享会": "bg-purple-50 text-purple-700",
  "学习小组": "bg-green-50 text-green-700",
  "其他": "bg-gray-50 text-gray-700",
};

function formatDate(d: Date) {
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const dynamic = "force-dynamic";

export default async function OfflinePage() {
  const session = await auth();
  const currentUserId = session?.user?.id;
  const events = await prisma.offlineEvent.findMany({
    include: { author: { select: { id: true, name: true } } },
    orderBy: { eventDate: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <BackButton />

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <MapPin className="size-6 text-orange-600" />
          线下空间
        </h1>
        <OfflineEventForm />
      </div>
      <p className="text-muted-foreground mb-8">
        校园多功能自由空间——提供线下相聚的场所，促进跨专业交流。在这里发布时间、地点与活动信息。
      </p>

      {events.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <MapPin className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">还没有线下活动</h3>
          <p className="text-muted-foreground">
            成为第一个发起线下活动的人吧！
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-sm transition-shadow relative">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/offline/${event.id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                  </Link>
                  <Badge variant="outline" className={CATEGORY_COLORS[event.category] || ""}>
                    {event.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {event.description}
                </p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t">
                    <Clock className="size-3" />
                    <span>由 {event.author.name} 发起</span>
                  </div>
                </div>
                {currentUserId === event.author.id && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <EditOfflineEventForm event={event} />
                    <DeleteButton action={deleteOfflineEvent} itemId={event.id} itemLabel={event.title} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
