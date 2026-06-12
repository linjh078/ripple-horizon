import { NavCard } from "@/components/home/nav-card";
import {
  BookOpen,
  Monitor,
  Globe,
  GraduationCap,
  Briefcase,
  Wrench,
} from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    title: "学习资源",
    description: "期末复习资料、课程笔记、历年真题分享",
    href: "/posts?category=STUDY_RESOURCES",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Monitor,
    title: "在线课程",
    description: "B站宝藏UP主、优质视频课、网课推荐",
    href: "/posts?category=ONLINE_COURSES",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Globe,
    title: "实用网站",
    description: "编程学习、效率工具、AI工具等优质网站分享",
    href: "/posts?category=WEBSITES",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: GraduationCap,
    title: "考试备考",
    description: "考研、考公、考证经验分享与资料交流",
    href: "/posts?category=EXAM_PREP",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: Briefcase,
    title: "职场技能",
    description: "实习心得、工作技能、校友经验分享",
    href: "/posts?category=CAREER_SKILLS",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Wrench,
    title: "软件技巧",
    description: "工作流分享、生产力工具、软件使用窍门",
    href: "/posts?category=SOFTWARE_TIPS",
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
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
