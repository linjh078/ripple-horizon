import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";

interface CompanyCardProps {
  id: string;
  name: string;
  industry: string | null;
  description: string;
  location: string | null;
  positionCount: number;
}

export function CompanyCard({ id, name, industry, description, location, positionCount }: CompanyCardProps) {
  return (
    <Link href={`/companies/${id}`}>
      <Card className="hover:shadow-sm transition-shadow h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <CardTitle className="text-lg">{name}</CardTitle>
            </div>
            {industry && <Badge variant="outline">{industry}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
          {location && <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1"><MapPin className="size-3" /><span>{location}</span></div>}
          <Badge variant="secondary" className="text-xs mt-1">{positionCount} 个职位</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
