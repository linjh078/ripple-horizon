import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface SubjectCardProps {
  id: string;
  name: string;
  department: string | null;
  description: string | null;
  materialCount: number;
}

export function SubjectCard({ id, name, department, description, materialCount }: SubjectCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="hover:shadow-sm transition-shadow h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <CardTitle className="text-lg">{name}</CardTitle>
            </div>
            <Badge variant="outline">{materialCount} 份资料</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {department && <p className="text-xs text-muted-foreground mb-1">{department}</p>}
          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
