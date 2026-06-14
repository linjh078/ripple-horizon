import { NavCard } from "@/components/home/nav-card";
import { Users, Award, Library, Target, Share2, MapPin } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "在校生",
    description: "浏览在校生主页，了解彼此的学习历程与成长轨迹",
    href: "/students",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Award,
    title: "校友",
    description: "查看校友去向与经验分享，汲取前辈的成长智慧",
    href: "/alumni",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Library,
    title: "课程资源",
    description: "按学科分类的学习资料库，上传与下载课程资源",
    href: "/courses",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Target,
    title: "考试备考",
    description: "考研、考公、考证、留学等考试经验与资料交流",
    href: "/exams",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: Share2,
    title: "信息共享",
    description: "优质课程、实用网站、软件技巧，信息共享与交流",
    href: "/resources",
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
  },
  {
    icon: MapPin,
    title: "线下空间",
    description: "校园自由空间——沙龙、公开分享、线下活动，在这里发布时间、地点与活动信息",
    href: "/offline",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
];

export function NavCardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <NavCard key={card.href} {...card} />
      ))}
    </div>
  );
}
