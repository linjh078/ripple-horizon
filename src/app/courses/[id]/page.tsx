import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MaterialForm } from "@/components/courses/material-form";

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      materials: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!subject) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{subject.name}</h1>
        {subject.department && <Badge variant="outline" className="mt-1">{subject.department}</Badge>}
        {subject.description && <p className="text-muted-foreground mt-2">{subject.description}</p>}
        <p className="text-xs text-muted-foreground mt-1">由 {subject.author.name} 创建</p>
      </div>

      <Separator className="mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">学习资料（{subject.materials.length}）</h2>
        <MaterialForm subjectId={subject.id} />
      </div>

      {subject.materials.length === 0 ? (
        <div className="py-12 text-center"><p className="text-muted-foreground">还没有资料，来上传第一份吧！</p></div>
      ) : (
        <div className="space-y-4">
          {subject.materials.map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{m.content}</p>
                {m.imageUrls && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {JSON.parse(m.imageUrls).map((url: string, i: number) => (
                      <img key={i} src={url} alt="" className="size-24 object-cover rounded-md border" />
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">由 {m.author.name} 上传</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
