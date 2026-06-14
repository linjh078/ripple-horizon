import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyForm } from "@/components/companies/company-form";
import { BackButton } from "@/components/shared/back-button";
import { DeleteButton } from "@/components/shared/delete-button";
import { deleteCompany } from "@/lib/actions/companies";

export default async function CompaniesPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;
  const companies = await prisma.company.findMany({
    include: { _count: { select: { positions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <BackButton />
      <div className="flex items-center justify-between mb-2"><h1 className="text-2xl font-bold">企业需求</h1></div>
      <p className="text-muted-foreground mb-4">企业 HR 发布职位需求，告诉在校生应该学习哪些技能</p>
      <div className="mb-6"><CompanyForm /></div>
      {companies.length === 0 ? (
        <div className="py-16 text-center"><p className="text-lg text-muted-foreground">还没有企业入驻</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div key={c.id} className="relative">
              <CompanyCard id={c.id} name={c.name} industry={c.industry} description={c.description} location={c.location} positionCount={c._count.positions} />
              {currentUserId && (
                <div className="absolute top-2 right-2 z-10">
                  <DeleteButton action={deleteCompany} itemId={c.id} itemLabel={c.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
