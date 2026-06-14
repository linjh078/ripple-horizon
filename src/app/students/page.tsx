import { prisma } from "@/lib/prisma";
import { StudentCard } from "@/components/students/student-card";
import { BackButton } from "@/components/shared/back-button";

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-2">在校生</h1>
      <p className="text-muted-foreground mb-6">浏览在校同学的主页，了解彼此的学习历程</p>
      {students.length === 0 ? (
        <div className="py-16 text-center"><p className="text-lg text-muted-foreground">还没有在校生注册</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <StudentCard key={s.id} id={s.id} name={s.name} department={s.department} bio={s.bio} postCount={s._count.posts} />
          ))}
        </div>
      )}
    </div>
  );
}
