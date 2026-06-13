import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Globe } from "lucide-react";
import { PositionForm } from "@/components/companies/position-form";

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: { positions: { orderBy: { createdAt: "desc" } } },
  });
  if (!company) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {company.industry && <Badge variant="secondary">{company.industry}</Badge>}
          {company.location && <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{company.location}</span>}
          {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline"><Globe className="size-3.5" />官网</a>}
        </div>
        <p className="text-muted-foreground mt-4 whitespace-pre-wrap">{company.description}</p>
      </div>

      <Separator className="mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">招聘职位（{company.positions.length}）</h2>
        <PositionForm companyId={company.id} />
      </div>

      {company.positions.length === 0 ? (
        <div className="py-12 text-center"><p className="text-muted-foreground">还没有发布职位</p></div>
      ) : (
        <div className="space-y-4">
          {company.positions.map((pos) => (
            <Card key={pos.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg">{pos.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{pos.description}</p>
                {pos.requirements && (
                  <div className="mt-3 rounded-md bg-muted p-3">
                    <p className="text-xs font-semibold mb-1">技能要求：</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{pos.requirements}</p>
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
