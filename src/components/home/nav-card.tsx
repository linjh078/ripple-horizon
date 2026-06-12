import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface NavCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: string; // CSS 颜色类名，如 "text-blue-600"
  bgColor: string; // CSS 背景类名，如 "bg-blue-50"
}

export function NavCard({
  icon: Icon,
  title,
  description,
  href,
  color,
  bgColor,
}: NavCardProps) {
  return (
    <Link href={href}>
      <Card className="group h-full cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:p-8">
          {/* 图标圆形容器 */}
          <div
            className={`flex size-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${bgColor}`}
          >
            <Icon className={`size-7 ${color}`} />
          </div>
          {/* 标题 */}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {/* 描述 */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
