import { prisma } from "@/lib/prisma";
import { StudentCard } from "@/components/students/student-card";
import { BackButton } from "@/components/shared/back-button";

export default async function AlumniPage() {
  const alumni = await prisma.user.findMany({
    where: {
      OR: [
        { role: "ALUMNI" },
        { userNumber: { startsWith: "A" } },  // 管理员/HR 也可能是校友
      ],
    },
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-2">校友</h1>
      <p className="text-muted-foreground mb-6">查看校友去向与经验分享，汲取前辈的成长智慧</p>
      {alumni.length === 0 ? (
        <div className="py-16 text-center"><p className="text-lg text-muted-foreground">还没有校友注册</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <StudentCard key={a.id} id={a.id} name={a.name} department={a.department} bio={a.bio} postCount={a._count.posts} />
          ))}
        </div>
      )}
    </div>
  );
}
