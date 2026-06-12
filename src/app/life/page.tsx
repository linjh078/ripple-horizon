import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "全部", value: "" },
  { label: "美食", value: "FOOD" },
  { label: "购物", value: "SHOP" },
  { label: "生活服务", value: "SERVICE" },
  { label: "休闲娱乐", value: "ENTERTAINMENT" },
];

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "美食",
  SHOP: "购物",
  SERVICE: "生活服务",
  ENTERTAINMENT: "休闲娱乐",
};

export default async function LifePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const where = category ? { category } : {};

  const spots = await prisma.lifeSpot.findMany({
    where,
    include: {
      submittedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">校园周边</h1>
      </div>

      {/* 分类筛选 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = c.value === "" ? !category : category === c.value;
          return (
            <Link
              key={c.value}
              href={c.value ? `/life?category=${c.value}` : "/life"}
              className={cn(
                buttonVariants({
                  variant: isActive ? "default" : "outline",
                  size: "sm",
                }),
                "rounded-full"
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* 店铺列表 */}
      {spots.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">还没有分享</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <Card key={spot.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                  <Badge variant="outline">
                    {CATEGORY_LABELS[spot.category] || spot.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {spot.description}
                </p>
                {spot.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="size-3" />
                    <span>{spot.location}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  由 {spot.submittedBy.name} 分享
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
