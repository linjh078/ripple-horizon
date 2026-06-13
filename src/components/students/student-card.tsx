import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StudentCardProps {
  id: string;
  name: string;
  department: string | null;
  bio: string | null;
  postCount: number;
}

export function StudentCard({ id, name, department, bio, postCount }: StudentCardProps) {
  return (
    <Link href={`/space/${id}`}>
      <Card className="hover:shadow-sm transition-shadow h-full">
        <CardContent className="flex items-start gap-4 pt-6">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate">{name}</h3>
            {department && <p className="text-xs text-muted-foreground mt-0.5">{department}</p>}
            {bio && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{bio}</p>}
            <Badge variant="outline" className="mt-2 text-xs">{postCount} 篇分享</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
