import { prisma } from "@/lib/prisma";
import { SubjectCard } from "@/components/courses/subject-card";
import { SubjectForm } from "@/components/courses/subject-form";
import { BackButton } from "@/components/shared/back-button";

export default async function CoursesPage() {
  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { materials: true } }, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <BackButton />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">课程资源</h1>
      </div>
      <p className="text-muted-foreground mb-4">按学科分类的学习资料库，上传与下载课程资源</p>
      <div className="mb-6"><SubjectForm /></div>
      {subjects.length === 0 ? (
        <div className="py-16 text-center"><p className="text-lg text-muted-foreground">还没有创建学科，来创建第一个吧！</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard key={s.id} id={s.id} name={s.name} department={s.department} description={s.description} materialCount={s._count.materials} />
          ))}
        </div>
      )}
    </div>
  );
}
