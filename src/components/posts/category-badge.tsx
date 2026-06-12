import { Badge } from "@/components/ui/badge";

const CATEGORY_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  STUDY_RESOURCES: { label: "学习资源", variant: "default" },
  ONLINE_COURSES: { label: "在线课程", variant: "secondary" },
  WEBSITES: { label: "实用网站", variant: "outline" },
  EXAM_PREP: { label: "考试备考", variant: "default" },
  CAREER_SKILLS: { label: "职场技能", variant: "secondary" },
  SOFTWARE_TIPS: { label: "软件技巧", variant: "outline" },
};

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = CATEGORY_MAP[category] || { label: category, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
